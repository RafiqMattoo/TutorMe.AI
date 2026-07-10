using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Materials.Queries
{
    public record GetMaterialsQuery(int Page, int PageSize, string? Search, Guid? SchoolId)
        : IRequest<PagedResult<MaterialDto>>;

    public sealed class GetMaterialsQueryHandler(IAppDbContext db) : IRequestHandler<GetMaterialsQuery, PagedResult<MaterialDto>>
    {
        public async Task<PagedResult<MaterialDto>> Handle(GetMaterialsQuery q, CancellationToken ct)
        {
            var query = db.Materials.AsNoTracking()
                .Include(m => m.UploadedBy)
                .Include(m => m.Category)
                .AsQueryable();

            if (q.SchoolId.HasValue) query = query.Where(m => m.SchoolId == q.SchoolId);
            if (!string.IsNullOrWhiteSpace(q.Search))
                query = query.Where(m => m.Title.Contains(q.Search) || m.FileName.Contains(q.Search));

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize)
                .Select(m => new MaterialDto(
                    m.Id, m.Title, m.FileName, m.FileUrl, m.ContentType,
                    m.FileSize, m.PageCount, m.Status, m.ErrorMessage,
                    m.UploadedById, m.UploadedBy.FirstName + " " + m.UploadedBy.LastName,
                    m.SchoolId, m.CategoryId, m.Category != null ? m.Category.Name : null,
                    m.Chunks.Count, m.CreatedAt))
                .ToListAsync(ct);

            return new PagedResult<MaterialDto>(items, total, q.Page, q.PageSize);
        }
    }

    public record GetMaterialChunksQuery(Guid MaterialId) : IRequest<IReadOnlyList<MaterialChunkDto>>;

    public sealed class GetMaterialChunksQueryHandler(IAppDbContext db)
        : IRequestHandler<GetMaterialChunksQuery, IReadOnlyList<MaterialChunkDto>>
    {
        public async Task<IReadOnlyList<MaterialChunkDto>> Handle(GetMaterialChunksQuery q, CancellationToken ct) =>
            await db.MaterialChunks.AsNoTracking()
                .Where(c => c.MaterialId == q.MaterialId)
                .OrderBy(c => c.ChunkIndex)
                .Select(c => new MaterialChunkDto(c.Id, c.ChunkIndex, c.PageNumber, c.Content))
                .ToListAsync(ct);
    }

    public record GetMaterialByIdQuery(Guid Id) : IRequest<MaterialDto>;

    public sealed class GetMaterialByIdQueryHandler(IAppDbContext db) : IRequestHandler<GetMaterialByIdQuery, MaterialDto>
    {
        public async Task<MaterialDto> Handle(GetMaterialByIdQuery q, CancellationToken ct)
        {
            var m = await db.Materials.AsNoTracking()
                .Include(x => x.UploadedBy).Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException("Material not found.");

            var chunkCount = await db.MaterialChunks.CountAsync(c => c.MaterialId == q.Id, ct);

            return new MaterialDto(m.Id, m.Title, m.FileName, m.FileUrl, m.ContentType,
                m.FileSize, m.PageCount, m.Status, m.ErrorMessage,
                m.UploadedById, m.UploadedBy.FirstName + " " + m.UploadedBy.LastName,
                m.SchoolId, m.CategoryId, m.Category?.Name, chunkCount, m.CreatedAt);
        }
    }
}

namespace VidyaAI.Application.Materials.Commands
{
    // Upload + ingest in one shot. Caller streams the file in via the controller.
    public record UploadMaterialCommand(
        Stream FileStream, string FileName, string ContentType, long FileSize,
        string Title, Guid? CategoryId, Guid? SchoolId, Guid UploadedById)
        : IRequest<MaterialDto>;

    public sealed class UploadMaterialCommandHandler(
        IAppDbContext db,
        IStorageService storage,
        IPdfTextExtractor pdfExtractor,
        ITextChunker chunker,
        IEmbeddingService embeddings,
        ILogger<UploadMaterialCommandHandler> log)
        : IRequestHandler<UploadMaterialCommand, MaterialDto>
    {
        public async Task<MaterialDto> Handle(UploadMaterialCommand cmd, CancellationToken ct)
        {
            // Buffer the upload stream to memory so we can both store and parse it.
            using var ms = new MemoryStream();
            await cmd.FileStream.CopyToAsync(ms, ct);
            ms.Position = 0;

            var url = await storage.UploadAsync(ms, cmd.FileName, cmd.ContentType, ct);

            var material = new Material
            {
                Title = string.IsNullOrWhiteSpace(cmd.Title) ? cmd.FileName : cmd.Title,
                FileName = cmd.FileName,
                FileUrl = url,
                ContentType = cmd.ContentType,
                FileSize = cmd.FileSize,
                Status = MaterialStatus.Processing,
                UploadedById = cmd.UploadedById,
                SchoolId = cmd.SchoolId,
                CategoryId = cmd.CategoryId
            };
            db.Materials.Add(material);
            await db.SaveChangesAsync(ct);

            // Once the row exists, finish indexing even if the browser disconnects
            // so the material is not left stuck in Processing.
            var ingestCt = CancellationToken.None;
            try
            {
                ms.Position = 0;
                var pages = pdfExtractor.Extract(ms).ToList();
                material.PageCount = pages.Count;

                var chunks = chunker.Chunk(pages);
                if (chunks.Count > 0)
                {
                    // Small batches + a pause between them to stay inside Gemini free-tier RPM.
                    // Each chunk is persisted as we go, so a mid-run failure leaves a partial
                    // (but usable) material rather than zero data.
                    const int batchSize = 10;
                    const int pauseMsBetweenBatches = 1500;
                    var failedBatches = 0;

                    for (var i = 0; i < chunks.Count; i += batchSize)
                    {
                        var batch = chunks.Skip(i).Take(batchSize).ToList();
                        IReadOnlyList<float[]> vectors;
                        try
                        {
                            vectors = await embeddings.EmbedBatchAsync(
                                batch.Select(b => b.Content).ToList(), ingestCt);
                        }
                        catch (Exception batchEx)
                        {
                            failedBatches++;
                            log.LogWarning(batchEx,
                                "Embedding batch starting at chunk {Index} failed; storing chunks without embeddings",
                                i);
                            vectors = Array.Empty<float[]>();
                        }

                        for (var j = 0; j < batch.Count; j++)
                        {
                            db.MaterialChunks.Add(new MaterialChunk
                            {
                                MaterialId = material.Id,
                                ChunkIndex = batch[j].Index,
                                PageNumber = batch[j].PageNumber,
                                Content = batch[j].Content,
                                TokenCount = batch[j].TokenCount,
                                Embedding = vectors.Count > j ? vectors[j] : null
                            });
                        }
                        await db.SaveChangesAsync(ingestCt);

                        if (i + batchSize < chunks.Count)
                            await Task.Delay(pauseMsBetweenBatches, ingestCt);
                    }

                    if (failedBatches == 0)
                    {
                        material.Status = MaterialStatus.Ready;
                    }
                    else
                    {
                        material.Status = MaterialStatus.Ready;
                        material.ErrorMessage = $"Indexed with {failedBatches} batch(es) skipped due to rate limits — re-upload to retry those chunks.";
                    }
                }
                else
                {
                    material.Status = MaterialStatus.Ready;
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Failed to ingest material {Id}", material.Id);
                material.Status = MaterialStatus.Failed;
                material.ErrorMessage = ex.Message;
            }

            await db.SaveChangesAsync(ingestCt);

            return await new VidyaAI.Application.Materials.Queries.GetMaterialByIdQueryHandler(db)
                .Handle(new VidyaAI.Application.Materials.Queries.GetMaterialByIdQuery(material.Id), ingestCt);
        }
    }

    public record DeleteMaterialCommand(Guid Id) : IRequest;

    public sealed class DeleteMaterialCommandHandler(IAppDbContext db, IStorageService storage)
        : IRequestHandler<DeleteMaterialCommand>
    {
        public async Task Handle(DeleteMaterialCommand cmd, CancellationToken ct)
        {
            var m = await db.Materials.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Material not found.");
            m.IsDeleted = true;
            await db.SaveChangesAsync(ct);
            try { await storage.DeleteAsync(m.FileUrl, ct); } catch { /* best-effort */ }
        }
    }
}
