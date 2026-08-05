using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public Guid UserId => Guid.TryParse(User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : Guid.Empty;
    public string Email => User?.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    public string Role => User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
    public Guid? SchoolId
    {
        get
        {
            var raw = User?.FindFirstValue("schoolId");
            return string.IsNullOrEmpty(raw) ? null : Guid.TryParse(raw, out var id) ? id : null;
        }
    }
    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
    public bool IsInRole(string role) => User?.IsInRole(role) ?? false;
}
