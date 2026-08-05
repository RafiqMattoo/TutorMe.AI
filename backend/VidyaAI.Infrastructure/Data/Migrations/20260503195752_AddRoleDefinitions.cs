using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleDefinitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RoleDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleDefinitions", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2107));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2111));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2114));

            migrationBuilder.InsertData(
                table: "RoleDefinitions",
                columns: new[] { "Id", "CreatedAt", "Description", "DisplayName", "IsActive", "IsDeleted", "IsSystemRole", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("30000000-0000-0000-0000-000000000001"), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2599), "Global platform owner with full operational control.", "Super Admin", true, false, true, "SuperAdmin", null },
                    { new Guid("30000000-0000-0000-0000-000000000002"), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2604), "Manages one school, its users, content, and operations.", "School Admin", true, false, true, "SchoolAdmin", null },
                    { new Guid("30000000-0000-0000-0000-000000000003"), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2608), "Creates learning content and supports study workflows.", "Teacher", true, false, true, "Teacher", null },
                    { new Guid("30000000-0000-0000-0000-000000000004"), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2613), "Learner workspace for study materials and practice.", "Student", true, false, true, "Student", null },
                    { new Guid("30000000-0000-0000-0000-000000000005"), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2616), "Guardian view into school learning content.", "Parent", true, false, true, "Parent", null }
                });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2390));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2405));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2410));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2425));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2430));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2436));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2441));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2448));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2453));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2458));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2466));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2470));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2474));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2479));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2483));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2489));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2493));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2498));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1615), new DateTime(2027, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1565) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2995), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2994) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3011), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3010) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3018), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3017) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3031), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3031) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3101), new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(3101) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1943));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1949));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1954));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1959));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(1977));

            migrationBuilder.CreateIndex(
                name: "IX_RoleDefinitions_Name",
                table: "RoleDefinitions",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleDefinitions");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2487));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2492));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2497));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3241));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3285));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3304));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3318));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3328));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3344));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3355));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3366));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3377));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3399));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3411));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3422));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3432));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3443));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3453));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3463));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3474));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3493));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3505));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3516));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(1608), new DateTime(2027, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(1509) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4557), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4556) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4605), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4604) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4622), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4621) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4637), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4636) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4652), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4651) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2288));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2328));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2336));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2343));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(2351));
        }
    }
}
