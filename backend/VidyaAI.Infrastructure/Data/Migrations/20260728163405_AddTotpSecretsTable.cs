using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTotpSecretsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TotpSecrets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Secret = table.Column<string>(type: "text", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TotpSecrets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TotpSecrets_Users_UserId",
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

            migrationBuilder.CreateIndex(
                name: "IX_TotpSecrets_UserId",
                table: "TotpSecrets",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TotpSecrets");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7688));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7706));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7723));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8961));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8979));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8996));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9013));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9029));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8325));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8365));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8386));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8417));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8440));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8463));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8485));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8506));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8526));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8550));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8571));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8592));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8618));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8640));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8661));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8696));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8719));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8742));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8763));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(8788));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7191), new DateTime(2027, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7176) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9511), new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9510) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9549), new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9548) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9584), new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9583) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9695), new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9695) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9718), new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(9717) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7527));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7552));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7571));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7591));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 28, 9, 15, 18, 779, DateTimeKind.Utc).AddTicks(7610));
        }
    }
}
