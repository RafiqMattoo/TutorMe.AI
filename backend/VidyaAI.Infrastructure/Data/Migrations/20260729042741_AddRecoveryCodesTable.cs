using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRecoveryCodesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecoveryCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecoveryCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecoveryCodes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3207));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3233));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3264));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4937));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4966));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4996));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(5024));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(5052));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3710));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3774));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3814));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3851));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3947));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4011));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4049));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4088));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4127));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4171));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4208));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4244));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4281));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4319));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4357));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4404));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4443));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4483));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4572));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(4647));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(2350), new DateTime(2027, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(2332) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6030), new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6029) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6096), new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6096) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6136), new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6136) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6174), new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6173) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6211), new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(6211) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(2951));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(2986));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3017));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3049));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 4, 27, 37, 336, DateTimeKind.Utc).AddTicks(3081));

            migrationBuilder.CreateIndex(
                name: "IX_RecoveryCodes_UserId",
                table: "RecoveryCodes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecoveryCodes");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1814));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1837));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1858));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3260));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3282));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3304));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3325));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3347));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2187));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2372));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2400));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2440));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2469));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2498));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2524));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2550));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2577));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2607));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2633));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2660));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2835));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2865));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2892));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2937));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2963));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(2991));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3018));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3050));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1185), new DateTime(2027, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1171) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3949), new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3948) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3996), new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(3996) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4041), new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4041) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4070), new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4070) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4097), new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(4097) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1623));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1652));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1676));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 16, 34, 3, 874, DateTimeKind.Utc).AddTicks(1724));
        }
    }
}
