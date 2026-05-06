using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Roles;

public record GetRoleDefinitionsQuery : IRequest<IReadOnlyList<RoleDefinitionDto>>;

public sealed class GetRoleDefinitionsQueryHandler(IAppDbContext db)
    : IRequestHandler<GetRoleDefinitionsQuery, IReadOnlyList<RoleDefinitionDto>>
{
    public async Task<IReadOnlyList<RoleDefinitionDto>> Handle(GetRoleDefinitionsQuery q, CancellationToken ct)
        => await db.RoleDefinitions.AsNoTracking()
            .OrderByDescending(x => x.IsSystemRole).ThenBy(x => x.DisplayName)
            .Select(x => new RoleDefinitionDto(x.Id, x.Name, x.DisplayName, x.Description, x.IsSystemRole, x.IsActive, x.CreatedAt))
            .ToListAsync(ct);
}

public record CreateRoleDefinitionCommand(string Name, string DisplayName, string? Description, bool IsActive) : IRequest<RoleDefinitionDto>;

public sealed class CreateRoleDefinitionCommandHandler(IAppDbContext db)
    : IRequestHandler<CreateRoleDefinitionCommand, RoleDefinitionDto>
{
    public async Task<RoleDefinitionDto> Handle(CreateRoleDefinitionCommand cmd, CancellationToken ct)
    {
        var name = cmd.Name.Trim().Replace(" ", string.Empty);
        if (await db.RoleDefinitions.AnyAsync(x => x.Name == name, ct))
            throw new ArgumentException("A role with this name already exists.");

        var role = new RoleDefinition
        {
            Name = name,
            DisplayName = cmd.DisplayName.Trim(),
            Description = cmd.Description,
            IsSystemRole = false,
            IsActive = cmd.IsActive
        };
        db.RoleDefinitions.Add(role);
        await db.SaveChangesAsync(ct);

        return new RoleDefinitionDto(role.Id, role.Name, role.DisplayName, role.Description, role.IsSystemRole, role.IsActive, role.CreatedAt);
    }
}

public record UpdateRoleDefinitionCommand(Guid Id, string DisplayName, string? Description, bool IsActive) : IRequest<RoleDefinitionDto>;

public sealed class UpdateRoleDefinitionCommandHandler(IAppDbContext db)
    : IRequestHandler<UpdateRoleDefinitionCommand, RoleDefinitionDto>
{
    public async Task<RoleDefinitionDto> Handle(UpdateRoleDefinitionCommand cmd, CancellationToken ct)
    {
        var role = await db.RoleDefinitions.FindAsync([cmd.Id], ct)
            ?? throw new KeyNotFoundException("Role not found.");

        role.DisplayName = cmd.DisplayName.Trim();
        role.Description = cmd.Description;
        role.IsActive = cmd.IsActive;
        await db.SaveChangesAsync(ct);

        return new RoleDefinitionDto(role.Id, role.Name, role.DisplayName, role.Description, role.IsSystemRole, role.IsActive, role.CreatedAt);
    }
}

public record DeleteRoleDefinitionCommand(Guid Id) : IRequest;

public sealed class DeleteRoleDefinitionCommandHandler(IAppDbContext db)
    : IRequestHandler<DeleteRoleDefinitionCommand>
{
    public async Task Handle(DeleteRoleDefinitionCommand cmd, CancellationToken ct)
    {
        var role = await db.RoleDefinitions.FindAsync([cmd.Id], ct)
            ?? throw new KeyNotFoundException("Role not found.");
        if (role.IsSystemRole)
            throw new InvalidOperationException("System roles cannot be deleted.");
        role.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}

public record GetRolePermissionsQuery(Guid? RoleDefinitionId) : IRequest<IReadOnlyList<RolePermissionDto>>;

public sealed class GetRolePermissionsQueryHandler(IAppDbContext db)
    : IRequestHandler<GetRolePermissionsQuery, IReadOnlyList<RolePermissionDto>>
{
    public async Task<IReadOnlyList<RolePermissionDto>> Handle(GetRolePermissionsQuery q, CancellationToken ct)
    {
        var query = db.RolePermissions.AsNoTracking().Include(x => x.RoleDefinition).AsQueryable();
        if (q.RoleDefinitionId.HasValue) query = query.Where(x => x.RoleDefinitionId == q.RoleDefinitionId);

        return await query
            .OrderBy(x => x.RoleDefinition!.DisplayName).ThenBy(x => x.Module)
            .Select(x => new RolePermissionDto(x.Id, x.RoleDefinitionId!.Value,
                x.RoleDefinition!.Name, x.RoleDefinition.DisplayName, x.Module,
                x.CanView, x.CanCreate, x.CanEdit, x.CanDelete, x.CanApprove))
            .ToListAsync(ct);
    }
}

public record UpsertRolePermissionCommand(
    Guid RoleDefinitionId, PermissionModule Module,
    bool CanView, bool CanCreate, bool CanEdit, bool CanDelete, bool CanApprove) : IRequest<RolePermissionDto>;

public sealed class UpsertRolePermissionCommandHandler(IAppDbContext db)
    : IRequestHandler<UpsertRolePermissionCommand, RolePermissionDto>
{
    public async Task<RolePermissionDto> Handle(UpsertRolePermissionCommand cmd, CancellationToken ct)
    {
        var roleDefinition = await db.RoleDefinitions.FindAsync([cmd.RoleDefinitionId], ct)
            ?? throw new KeyNotFoundException("Role not found.");

        var permission = await db.RolePermissions
            .FirstOrDefaultAsync(x => x.RoleDefinitionId == cmd.RoleDefinitionId && x.Module == cmd.Module, ct);

        if (permission is null)
        {
            permission = new RolePermission { RoleDefinitionId = cmd.RoleDefinitionId, Module = cmd.Module };
            db.RolePermissions.Add(permission);
        }

        permission.RoleDefinitionId = cmd.RoleDefinitionId;
        permission.Role = Enum.TryParse<UserRole>(roleDefinition.Name, out var enumRole) ? enumRole : null;
        permission.CanView = cmd.CanView;
        permission.CanCreate = cmd.CanCreate;
        permission.CanEdit = cmd.CanEdit;
        permission.CanDelete = cmd.CanDelete;
        permission.CanApprove = cmd.CanApprove;
        permission.IsDeleted = false;

        await db.SaveChangesAsync(ct);

        return new RolePermissionDto(permission.Id, roleDefinition.Id,
            roleDefinition.Name, roleDefinition.DisplayName, permission.Module,
            permission.CanView, permission.CanCreate, permission.CanEdit, permission.CanDelete, permission.CanApprove);
    }
}

public record DeleteRolePermissionCommand(Guid Id) : IRequest;

public sealed class DeleteRolePermissionCommandHandler(IAppDbContext db)
    : IRequestHandler<DeleteRolePermissionCommand>
{
    public async Task Handle(DeleteRolePermissionCommand cmd, CancellationToken ct)
    {
        var permission = await db.RolePermissions.FindAsync([cmd.Id], ct)
            ?? throw new KeyNotFoundException("Permission not found.");
        permission.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}
