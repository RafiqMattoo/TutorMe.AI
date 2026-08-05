// JWT token service
public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string email, string role, Guid? schoolId);
    string GenerateRefreshToken();
}