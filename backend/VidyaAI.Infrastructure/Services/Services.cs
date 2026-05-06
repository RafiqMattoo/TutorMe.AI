using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;
using VidyaAI.Infrastructure.Data;

namespace VidyaAI.Infrastructure.Services;

// ── SCHOOL SERVICE ────────────────────────────────────────────────
public sealed class SchoolService(AppDbContext db)
{
    public async Task<PagedResult<SchoolDto>> GetAllAsync(PaginationQuery q, CancellationToken ct)
    {
        var query = db.Schools.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q.Search))
            query = query.Where(s => s.Name.Contains(q.Search) || (s.City != null && s.City.Contains(q.Search)));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((q.Page - 1) * q.PageSize)
            .Take(q.PageSize)
            .Select(s => new SchoolDto(
                s.Id, s.Name, s.Address, s.City, s.State, s.Phone, s.Email, s.LogoUrl,
                s.Type, s.Board, s.Plan, s.SubscriptionStatus, s.SubscriptionExpiresAt, s.IsActive,
                s.Users.Count, s.Articles.Count, s.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<SchoolDto>(items, total, q.Page, q.PageSize);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var school = await db.Schools.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"School {id} not found.");
        school.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}

// ── USER SERVICE ──────────────────────────────────────────────────
public sealed class UserService(AppDbContext db)
{
    public async Task ToggleActiveAsync(Guid id, CancellationToken ct)
    {
        var user = await db.Users.FindAsync([id], ct)
            ?? throw new KeyNotFoundException("User not found.");
        user.IsActive = !user.IsActive;
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var user = await db.Users.FindAsync([id], ct)
            ?? throw new KeyNotFoundException("User not found.");
        user.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}

// ── CATEGORY SERVICE ──────────────────────────────────────────────
public sealed class CategoryService(AppDbContext db)
{
    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct) =>
        await db.Categories
            .OrderBy(c => c.SortOrder)
            .Select(c => new CategoryDto(
                c.Id, c.Name, c.Description, c.IconUrl,
                c.SortOrder, c.IsActive, c.Articles.Count))
            .ToListAsync(ct);

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest req, CancellationToken ct)
    {
        var cat = new Category
        {
            Name = req.Name, Description = req.Description,
            IconUrl = req.IconUrl, SortOrder = req.SortOrder
        };
        db.Categories.Add(cat);
        await db.SaveChangesAsync(ct);
        return new CategoryDto(cat.Id, cat.Name, cat.Description, cat.IconUrl, cat.SortOrder, cat.IsActive, 0);
    }

    public async Task<CategoryDto> UpdateAsync(Guid id, UpdateCategoryRequest req, CancellationToken ct)
    {
        var cat = await db.Categories.FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Category not found.");
        cat.Name = req.Name; cat.Description = req.Description;
        cat.IconUrl = req.IconUrl; cat.SortOrder = req.SortOrder; cat.IsActive = req.IsActive;
        await db.SaveChangesAsync(ct);
        return new CategoryDto(cat.Id, cat.Name, cat.Description, cat.IconUrl, cat.SortOrder, cat.IsActive,
            await db.Articles.CountAsync(a => a.CategoryId == id, ct));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var cat = await db.Categories.FindAsync([id], ct)
            ?? throw new KeyNotFoundException("Category not found.");
        cat.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}
