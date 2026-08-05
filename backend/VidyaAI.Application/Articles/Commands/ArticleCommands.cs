using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Articles.Queries
{
    public record GetArticlesQuery(int Page, int PageSize, string? Search, ArticleStatus? Status, Guid? SchoolId) : IRequest<PagedResult<ArticleListDto>>;

    public sealed class GetArticlesQueryHandler(IAppDbContext db) : IRequestHandler<GetArticlesQuery, PagedResult<ArticleListDto>>
    {
        public async Task<PagedResult<ArticleListDto>> Handle(GetArticlesQuery q, CancellationToken ct)
        {
            var query = db.Articles.AsNoTracking().Include(a => a.Author).Include(a => a.Category).AsQueryable();
            if (q.SchoolId.HasValue) query = query.Where(a => a.SchoolId == q.SchoolId);
            if (q.Status.HasValue) query = query.Where(a => a.Status == q.Status);
            if (!string.IsNullOrWhiteSpace(q.Search)) query = query.Where(a => a.Title.Contains(q.Search));

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize)
                .Select(a => new ArticleListDto(
                    a.Id, a.Title, a.CoverImageUrl, a.ContentType, a.Status,
                    a.Tags, a.ViewCount, a.Likes.Count, a.Comments.Count,
                    a.PublishedAt, $"{a.Author.FirstName} {a.Author.LastName}",
                    a.Category != null ? a.Category.Name : null, a.CreatedAt))
                .ToListAsync(ct);

            return new PagedResult<ArticleListDto>(items, total, q.Page, q.PageSize);
        }
    }

    public record GetArticleByIdQuery(Guid Id) : IRequest<ArticleDto>;

    public sealed class GetArticleByIdQueryHandler(IAppDbContext db) : IRequestHandler<GetArticleByIdQuery, ArticleDto>
    {
        public async Task<ArticleDto> Handle(GetArticleByIdQuery q, CancellationToken ct)
        {
            var a = await db.Articles.AsNoTracking()
                .Include(x => x.Author).Include(x => x.Category)
                .Include(x => x.School).Include(x => x.Likes).Include(x => x.Comments)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException("Article not found.");

            return new ArticleDto(a.Id, a.Title, a.Body, a.Summary, a.AiSummary,
                a.CoverImageUrl, a.YoutubeUrl, a.ContentType, a.Status, a.Tags,
                a.ViewCount, a.Likes.Count, a.Comments.Count, a.PublishedAt, a.ScheduledAt,
                a.AuthorId, $"{a.Author.FirstName} {a.Author.LastName}",
                a.SchoolId, a.School?.Name, a.CategoryId, a.Category?.Name, a.CreatedAt);
        }
    }
}

namespace VidyaAI.Application.Articles.Commands
{
    public record CreateArticleCommand(string Title, string Body, string? CoverImageUrl, string? YoutubeUrl,
        ContentType ContentType, string? Tags, Guid? CategoryId, Guid? SchoolId,
        DateTime? ScheduledAt, Guid AuthorId) : IRequest<ArticleDto>;

    public sealed class CreateArticleCommandValidator : AbstractValidator<CreateArticleCommand>
    {
        public CreateArticleCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(500).WithMessage("Title is required (max 500 chars).");
            RuleFor(x => x.Body).NotEmpty().WithMessage("Body content is required.");
            RuleFor(x => x.YoutubeUrl).Must(url => url == null || Uri.IsWellFormedUriString(url, UriKind.Absolute))
                .WithMessage("YouTube URL must be a valid URL.");
        }
    }

    public sealed class CreateArticleCommandHandler(IAppDbContext db) : IRequestHandler<CreateArticleCommand, ArticleDto>
    {
        public async Task<ArticleDto> Handle(CreateArticleCommand cmd, CancellationToken ct)
        {
            var article = new Article
            {
                Title = cmd.Title, Body = cmd.Body, CoverImageUrl = cmd.CoverImageUrl,
                YoutubeUrl = cmd.YoutubeUrl, ContentType = cmd.ContentType, Tags = cmd.Tags,
                CategoryId = cmd.CategoryId, SchoolId = cmd.SchoolId,
                AuthorId = cmd.AuthorId, Status = ArticleStatus.Draft, ScheduledAt = cmd.ScheduledAt
            };
            db.Articles.Add(article);
            await db.SaveChangesAsync(ct);
            return await new VidyaAI.Application.Articles.Queries.GetArticleByIdQueryHandler(db)
                .Handle(new VidyaAI.Application.Articles.Queries.GetArticleByIdQuery(article.Id), ct);
        }
    }

    public record UpdateArticleCommand(Guid Id, string Title, string Body, string? CoverImageUrl,
        string? YoutubeUrl, ContentType ContentType, string? Tags,
        Guid? CategoryId, DateTime? ScheduledAt) : IRequest<ArticleDto>;

    public sealed class UpdateArticleCommandHandler(IAppDbContext db) : IRequestHandler<UpdateArticleCommand, ArticleDto>
    {
        public async Task<ArticleDto> Handle(UpdateArticleCommand cmd, CancellationToken ct)
        {
            var article = await db.Articles.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Article not found.");

            article.Title = cmd.Title; article.Body = cmd.Body;
            article.CoverImageUrl = cmd.CoverImageUrl; article.YoutubeUrl = cmd.YoutubeUrl;
            article.ContentType = cmd.ContentType; article.Tags = cmd.Tags;
            article.CategoryId = cmd.CategoryId; article.ScheduledAt = cmd.ScheduledAt;
            await db.SaveChangesAsync(ct);
            return await new VidyaAI.Application.Articles.Queries.GetArticleByIdQueryHandler(db)
                .Handle(new VidyaAI.Application.Articles.Queries.GetArticleByIdQuery(cmd.Id), ct);
        }
    }

    public record PublishArticleCommand(Guid Id) : IRequest;
    public sealed class PublishArticleCommandHandler(IAppDbContext db) : IRequestHandler<PublishArticleCommand>
    {
        public async Task Handle(PublishArticleCommand cmd, CancellationToken ct)
        {
            var article = await db.Articles.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Article not found.");
            article.Status = ArticleStatus.Published;
            article.PublishedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
        }
    }

    public record UnpublishArticleCommand(Guid Id) : IRequest;
    public sealed class UnpublishArticleCommandHandler(IAppDbContext db) : IRequestHandler<UnpublishArticleCommand>
    {
        public async Task Handle(UnpublishArticleCommand cmd, CancellationToken ct)
        {
            var article = await db.Articles.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Article not found.");
            article.Status = ArticleStatus.Draft;
            article.PublishedAt = null;
            await db.SaveChangesAsync(ct);
        }
    }

    public record DeleteArticleCommand(Guid Id) : IRequest;
    public sealed class DeleteArticleCommandHandler(IAppDbContext db) : IRequestHandler<DeleteArticleCommand>
    {
        public async Task Handle(DeleteArticleCommand cmd, CancellationToken ct)
        {
            var article = await db.Articles.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Article not found.");
            article.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
