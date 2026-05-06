using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedRoleDemoUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9871));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9886));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9889));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9127), new DateTime(2027, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9049) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9702));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "Email", "EmailVerified", "FirstName", "IsActive", "IsDeleted", "LastLoginAt", "LastName", "PasswordHash", "Phone", "RefreshToken", "RefreshTokenExpiry", "Role", "SchoolId", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000006"), null, new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9772), "schooladmin@vidyaai.com", true, "Aaliya", true, false, null, "Khan", "$2a$11$RIzKRlsKF6lh3k9LHQHsROIDjily/9oaxg5wL8JSVdSxmBRQv7WVm", null, null, null, "SchoolAdmin", new Guid("00000000-0000-0000-0000-000000000002"), null },
                    { new Guid("00000000-0000-0000-0000-000000000007"), null, new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9777), "teacher@vidyaai.com", true, "Rohan", true, false, null, "Sharma", "$2a$11$RIzKRlsKF6lh3k9LHQHsROIDjily/9oaxg5wL8JSVdSxmBRQv7WVm", null, null, null, "Teacher", new Guid("00000000-0000-0000-0000-000000000002"), null },
                    { new Guid("00000000-0000-0000-0000-000000000008"), null, new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9783), "student@vidyaai.com", true, "Zoya", true, false, null, "Mir", "$2a$11$RIzKRlsKF6lh3k9LHQHsROIDjily/9oaxg5wL8JSVdSxmBRQv7WVm", null, null, null, "Student", new Guid("00000000-0000-0000-0000-000000000002"), null },
                    { new Guid("00000000-0000-0000-0000-000000000009"), null, new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9788), "parent@vidyaai.com", true, "Imran", true, false, null, "Mir", "$2a$11$RIzKRlsKF6lh3k9LHQHsROIDjily/9oaxg5wL8JSVdSxmBRQv7WVm", null, null, null, "Parent", new Guid("00000000-0000-0000-0000-000000000002"), null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(6171));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(6172));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(6174));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(5950), new DateTime(2027, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(5920) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 18, 56, 30, 671, DateTimeKind.Utc).AddTicks(6149));
        }
    }
}
