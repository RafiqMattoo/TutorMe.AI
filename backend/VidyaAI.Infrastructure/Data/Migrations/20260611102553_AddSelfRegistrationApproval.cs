using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSelfRegistrationApproval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "Approved");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeLevel",
                table: "Users",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianName",
                table: "Users",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianPhone",
                table: "Users",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RollNumber",
                table: "Users",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "Schools",
                type: "text",
                nullable: false,
                defaultValue: "Approved");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1810));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1810));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1820));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2070));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2080));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2080));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2080));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2090));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1950));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1950));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1970));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1970));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1970));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1980));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1980));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2000));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2000));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2020));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2030));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2030));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2030));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2040));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2040));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1710), new DateTime(2027, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1690) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2180), new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2180) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2190), new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2190) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200), new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200), new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200), new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(2200) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "DateOfBirth", "GradeLevel", "GuardianName", "GuardianPhone", "RollNumber" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1770), null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "DateOfBirth", "GradeLevel", "GuardianName", "GuardianPhone", "RollNumber" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1780), null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "DateOfBirth", "GradeLevel", "GuardianName", "GuardianPhone", "RollNumber" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1780), null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "DateOfBirth", "GradeLevel", "GuardianName", "GuardianPhone", "RollNumber" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1790), null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                columns: new[] { "ApprovalStatus", "CreatedAt", "DateOfBirth", "GradeLevel", "GuardianName", "GuardianPhone", "RollNumber" },
                values: new object[] { "Approved", new DateTime(2026, 6, 11, 10, 25, 53, 661, DateTimeKind.Utc).AddTicks(1790), null, null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GradeLevel",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GuardianName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GuardianPhone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RollNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Schools");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6780));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6780));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6780));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7040));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7040));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7050));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7050));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7050));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6910));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6920));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6970));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6970));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6980));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6980));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6980));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6990));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6990));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6640), new DateTime(2027, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6630) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7180), new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7180) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7190), new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7190) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7190), new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7190) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7200), new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7200) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7200), new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(7200) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6740));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6740));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6750));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6750));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 8, 20, 31, 15, 55, DateTimeKind.Utc).AddTicks(6760));
        }
    }
}
