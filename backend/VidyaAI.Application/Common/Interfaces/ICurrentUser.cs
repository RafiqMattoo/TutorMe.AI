using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VidyaAI.Application.Common.Interfaces
{
    public interface ICurrentUser
    {
        Guid UserId { get; }
        string Email { get; }
        string Role { get; }
        Guid? SchoolId { get; }
        bool IsAuthenticated { get; }
        bool IsInRole(string role);
    }
}
