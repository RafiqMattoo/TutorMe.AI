using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class LinkPermissionsToRoleDefinitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RolePermissions_Role_Module",
                table: "RolePermissions");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "RolePermissions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<Guid>(
                name: "RoleDefinitionId",
                table: "RolePermissions",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6061));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6066));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6074));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6965));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6971));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6976));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6985));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6588), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6601), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6610), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6618), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6626), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6637), new Guid("30000000-0000-0000-0000-000000000001") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6647), new Guid("30000000-0000-0000-0000-000000000002") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6659), new Guid("30000000-0000-0000-0000-000000000002") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6667), new Guid("30000000-0000-0000-0000-000000000002") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6679), new Guid("30000000-0000-0000-0000-000000000002") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6690), new Guid("30000000-0000-0000-0000-000000000002") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6757), new Guid("30000000-0000-0000-0000-000000000003") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6768), new Guid("30000000-0000-0000-0000-000000000003") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6778), new Guid("30000000-0000-0000-0000-000000000003") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6785), new Guid("30000000-0000-0000-0000-000000000004") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6797), new Guid("30000000-0000-0000-0000-000000000004") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6804), new Guid("30000000-0000-0000-0000-000000000004") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6814), new Guid("30000000-0000-0000-0000-000000000005") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6823), new Guid("30000000-0000-0000-0000-000000000005") });

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                columns: new[] { "CreatedAt", "RoleDefinitionId" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6831), new Guid("30000000-0000-0000-0000-000000000005") });

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5399), new DateTime(2027, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5336) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7538), new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7536) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7570), new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7569) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7579), new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7579) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7588), new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7587) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7597), new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(7596) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5974));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5982));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5989));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(5996));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 20, 13, 58, 587, DateTimeKind.Utc).AddTicks(6003));

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleDefinitionId_Module",
                table: "RolePermissions",
                columns: new[] { "RoleDefinitionId", "Module" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_RoleDefinitions_RoleDefinitionId",
                table: "RolePermissions",
                column: "RoleDefinitionId",
                principalTable: "RoleDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_RoleDefinitions_RoleDefinitionId",
                table: "RolePermissions");

            migrationBuilder.DropIndex(
                name: "IX_RolePermissions_RoleDefinitionId_Module",
                table: "RolePermissions");

            migrationBuilder.DropColumn(
                name: "RoleDefinitionId",
                table: "RolePermissions");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "RolePermissions",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

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

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2599));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2604));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2608));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2613));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 57, 51, 639, DateTimeKind.Utc).AddTicks(2616));

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
                name: "IX_RolePermissions_Role_Module",
                table: "RolePermissions",
                columns: new[] { "Role", "Module" },
                unique: true);
        }
    }
}
