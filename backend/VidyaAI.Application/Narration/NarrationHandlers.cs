using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Enums;
using NarrationEntity = VidyaAI.Domain.Entities.Narration;
using NarrationSegmentEntity = VidyaAI.Domain.Entities.NarrationSegment;

namespace VidyaAI.Application.Narration.Queries
{
    // Returns the narration (status + audio + timeline) for a material, or null if
    // none has been generated yet.
    public record GetNarrationQuery(Guid MaterialId, NarrationKind Kind = NarrationKind.Verbatim) : IRequest<NarrationDto?>;

    public sealed class GetNarrationQueryHandler(IAppDbContext db)
        : IRequestHandler<GetNarrationQuery, NarrationDto?>
    {
        public async Task<NarrationDto?> Handle(GetNarrationQuery q, CancellationToken ct)
        {
            var n = await db.Narrations.AsNoTracking()
                .Include(x => x.Segments)
                .FirstOrDefaultAsync(x => x.MaterialId == q.MaterialId && x.Kind == q.Kind, ct);
            return n is null ? null : NarrationMapping.ToDto(n);
        }
    }

    // Lists the TTS voices the configured engine offers (for a voice picker).
    public record ListNarrationVoicesQuery : IRequest<IReadOnlyList<NarrationVoiceDto>>;

    public sealed class ListNarrationVoicesQueryHandler(ITtsService tts)
        : IRequestHandler<ListNarrationVoicesQuery, IReadOnlyList<NarrationVoiceDto>>
    {
        public Task<IReadOnlyList<NarrationVoiceDto>> Handle(ListNarrationVoicesQuery q, CancellationToken ct)
            => Task.FromResult<IReadOnlyList<NarrationVoiceDto>>(
                tts.GetVoices().Select(v => new NarrationVoiceDto(v.Id, v.Name, v.Language)).ToList());
    }
}

namespace VidyaAI.Application.Narration.Commands
{
    using VidyaAI.Application.Narration.Queries;

    // Generates (or regenerates) the audio narration for a material. Returns
    // immediately with Status = Processing; synthesis runs in the background and the
    // client polls GetNarrationQuery until Ready/Failed.
    public record GenerateNarrationCommand(Guid MaterialId, string? Voice, NarrationKind Kind = NarrationKind.Verbatim)
        : IRequest<NarrationDto>;

    public sealed class GenerateNarrationCommandHandler(
        IAppDbContext db,
        IStorageService storage,
        IServiceScopeFactory scopeFactory,
        ILogger<GenerateNarrationCommandHandler> log)
        : IRequestHandler<GenerateNarrationCommand, NarrationDto>
    {
        public async Task<NarrationDto> Handle(GenerateNarrationCommand cmd, CancellationToken ct)
        {
            var material = await db.Materials.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == cmd.MaterialId, ct)
                ?? throw new KeyNotFoundException("Material not found.");

            // Replace any existing narration of this kind. Delete its audio file first
            // so we don't orphan blobs on disk.
            var existing = await db.Narrations
                .FirstOrDefaultAsync(n => n.MaterialId == cmd.MaterialId && n.Kind == cmd.Kind, ct);
            if (existing is not null)
            {
                if (!string.IsNullOrEmpty(existing.AudioUrl))
                    await storage.DeleteAsync(existing.AudioUrl, ct);
                db.Narrations.Remove(existing); // segments cascade at the DB level
                await db.SaveChangesAsync(ct);
            }

            var narration = new NarrationEntity
            {
                MaterialId = cmd.MaterialId,
                Kind = cmd.Kind,
                Status = NarrationStatus.Processing,
                Voice = cmd.Voice,
            };
            db.Narrations.Add(narration);
            await db.SaveChangesAsync(ct);

            // Fire-and-forget: synthesis (and, for Explained, an LLM pass per section)
            // is slow and must outlive this request, so it runs in its own DI scope.
            var narrationId = narration.Id;
            var materialId = cmd.MaterialId;
            var voice = cmd.Voice;
            var kind = cmd.Kind;
            _ = Task.Run(() => RunSynthesisAsync(scopeFactory, narrationId, materialId, voice, kind, log));

            return NarrationMapping.ToDto(narration);
        }

        // Teacher-style prompt that turns a dense passage into a short, simple spoken
        // explanation for the animated explainer.
        private const string ExplainSystemPrompt =
            "You are a friendly tutor making a short explainer. Rewrite the passage below into a clear, " +
            "simple spoken explanation a student can follow, in 2-4 short sentences. Use plain language and a " +
            "natural speaking tone. Only use information found in the passage — do not invent facts. " +
            "Output ONLY the explanation text, with no preamble, labels, or markdown.";

        // Builds a text-to-image prompt from a section's narration text. Keeps a fixed,
        // child-friendly storybook style and asks for no embedded text (image models
        // render garbled letters). Deterministic — no extra LLM round-trip per section.
        private static string BuildImagePrompt(string sectionText)
        {
            var subject = sectionText.Replace('\n', ' ').Trim();
            if (subject.Length > 600) subject = subject[..600];
            return "A clean, friendly educational storybook illustration with soft colours and simple shapes. "
                 + "Do not render any text, letters, words, captions, or numbers in the image. "
                 + "Illustrate this idea: " + subject;
        }

        private static async Task RunSynthesisAsync(
            IServiceScopeFactory scopeFactory, Guid narrationId, Guid materialId, string? voice,
            NarrationKind kind, ILogger log)
        {
            using var scope = scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
            var tts = scope.ServiceProvider.GetRequiredService<ITtsService>();
            var storage = scope.ServiceProvider.GetRequiredService<IStorageService>();

            var narration = await db.Narrations.FirstOrDefaultAsync(n => n.Id == narrationId);
            if (narration is null) return;

            try
            {
                var chunks = await db.MaterialChunks.AsNoTracking()
                    .Where(c => c.MaterialId == materialId)
                    .OrderBy(c => c.ChunkIndex)
                    .Select(c => new { c.ChunkIndex, c.PageNumber, c.Content })
                    .Where(c => !string.IsNullOrWhiteSpace(c.Content))
                    .ToListAsync();

                var segments = new List<TtsSegment>(chunks.Count);
                // Both Explained and Illustrated narrate an AI-simplified version of each
                // section (Illustrated additionally gets a generated picture per section).
                if (kind != NarrationKind.Verbatim)
                {
                    // One LLM pass per section to produce the simplified narration text.
                    // On any per-section failure, fall back to the original text so the
                    // explainer still has audio for that section.
                    var llm = scope.ServiceProvider.GetRequiredService<ILlmChatService>();
                    for (var i = 0; i < chunks.Count; i++)
                    {
                        var c = chunks[i];
                        string text;
                        try
                        {
                            text = (await llm.CompleteAsync(ExplainSystemPrompt,
                                new[] { new ChatTurn("user", c.Content) }, CancellationToken.None)).Trim();
                            if (string.IsNullOrWhiteSpace(text)) text = c.Content;
                        }
                        catch (Exception ex)
                        {
                            log.LogWarning(ex, "Explain step failed for chunk {Chunk}; using original text", c.ChunkIndex);
                            text = c.Content;
                        }
                        segments.Add(new TtsSegment(i, c.ChunkIndex, c.PageNumber, text));
                    }
                }
                else
                {
                    segments.AddRange(chunks.Select((c, i) => new TtsSegment(i, c.ChunkIndex, c.PageNumber, c.Content)));
                }

                if (segments.Count == 0)
                {
                    narration.Status = NarrationStatus.Failed;
                    narration.ErrorMessage = "This material has no readable text to narrate.";
                    await db.SaveChangesAsync();
                    return;
                }

                var result = await tts.SynthesizeAsync(segments, voice, CancellationToken.None);

                using var ms = new MemoryStream(result.Audio);
                var url = await storage.UploadAsync(ms,
                    $"narration-{kind.ToString().ToLowerInvariant()}-{materialId:N}{result.FileExtension}", result.ContentType);

                narration.AudioUrl = url;
                narration.ContentType = result.ContentType;
                narration.DurationMs = result.DurationMs;
                narration.Status = NarrationStatus.Ready;

                // For the Illustrated kind, generate one picture per section. Each image
                // is independent and best-effort: a failure leaves that segment text-only
                // rather than failing the whole narration. Status only flips to Ready when
                // SaveChanges runs below, so the client keeps polling until images are done.
                var images = scope.ServiceProvider.GetRequiredService<IImageGenerationService>();
                var generateImages = kind == NarrationKind.Illustrated && images.Enabled;

                foreach (var t in result.Timings)
                {
                    string? imageUrl = null;
                    if (generateImages)
                    {
                        try
                        {
                            var img = await images.GenerateAsync(BuildImagePrompt(t.Text), CancellationToken.None);
                            if (img is not null)
                            {
                                using var imgMs = new MemoryStream(img.Data);
                                imageUrl = await storage.UploadAsync(imgMs,
                                    $"scene-{materialId:N}-{t.Index}{img.FileExtension}", img.ContentType);
                            }
                        }
                        catch (Exception ex)
                        {
                            log.LogWarning(ex, "Scene image generation failed for segment {Index}", t.Index);
                        }
                    }

                    db.NarrationSegments.Add(new NarrationSegmentEntity
                    {
                        NarrationId = narration.Id,
                        SegmentIndex = t.Index,
                        ChunkIndex = t.ChunkIndex,
                        PageNumber = t.PageNumber,
                        Text = t.Text,
                        StartMs = t.StartMs,
                        EndMs = t.EndMs,
                        ImageUrl = imageUrl,
                    });
                }

                await db.SaveChangesAsync();
                log.LogInformation("Narration {Id} ready: {Segments} segments, {Ms}ms",
                    narration.Id, result.Timings.Count, result.DurationMs);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Narration {Id} failed", narrationId);
                narration.Status = NarrationStatus.Failed;
                narration.ErrorMessage = ex.Message;
                try { await db.SaveChangesAsync(); }
                catch (Exception saveEx) { log.LogError(saveEx, "Failed to persist narration failure {Id}", narrationId); }
            }
        }
    }
}

namespace VidyaAI.Application.Narration
{
    internal static class NarrationMapping
    {
        public static NarrationDto ToDto(NarrationEntity n) => new(
            n.Id, n.MaterialId, n.Kind, n.Status, n.AudioUrl, n.ContentType, n.Voice, n.DurationMs, n.ErrorMessage,
            n.Segments.OrderBy(s => s.SegmentIndex)
                .Select(s => new NarrationSegmentDto(s.SegmentIndex, s.ChunkIndex, s.PageNumber, s.Text, s.StartMs, s.EndMs, s.ImageUrl))
                .ToList(),
            n.CreatedAt);
    }
}
