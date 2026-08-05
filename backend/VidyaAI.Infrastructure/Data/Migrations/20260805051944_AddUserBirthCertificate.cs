using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBirthCertificate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BirthCertificateUrl",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1928));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1967));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1976));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3890));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3920));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3933));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3943));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3952));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2539));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2635));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2672));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2708));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2731));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2773));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2798));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2820));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2844));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2918));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(2987));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3052));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3120));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3194));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3260));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3295));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3318));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3345));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3371));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(3395));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(193), new DateTime(2027, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(132) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6114), new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6112) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6248), new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6247) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6276), new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6275) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6302), new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6301) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6342), new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(6341) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "BirthCertificateUrl", "CreatedAt" },
                values: new object[] { null, new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1521) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                columns: new[] { "BirthCertificateUrl", "CreatedAt" },
                values: new object[] { null, new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1553) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                columns: new[] { "BirthCertificateUrl", "CreatedAt" },
                values: new object[] { null, new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1581) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                columns: new[] { "BirthCertificateUrl", "CreatedAt" },
                values: new object[] { null, new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1608) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                columns: new[] { "BirthCertificateUrl", "CreatedAt" },
                values: new object[] { null, new DateTime(2026, 8, 5, 5, 19, 40, 89, DateTimeKind.Utc).AddTicks(1634) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthCertificateUrl",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9241));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9244));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9889));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9894));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9898));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9903));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9907));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9518));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9539));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9552));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9560));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9568));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9577));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9596));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9605));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9613));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9624));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9636));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9644));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9652));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9660));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9668));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9675));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9683));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9693));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9703));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9711));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(8751), new DateTime(2027, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(8723) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(359), new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(358) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(387), new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(386) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(397), new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(397) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(405), new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(405) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(413), new DateTime(2026, 8, 4, 10, 49, 55, 142, DateTimeKind.Utc).AddTicks(413) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9132));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9141));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9162));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9168));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(9173));
        }
    }
}
