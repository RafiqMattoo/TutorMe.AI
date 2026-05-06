using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissionsAndEnrollments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Module = table.Column<string>(type: "text", nullable: false),
                    CanView = table.Column<bool>(type: "boolean", nullable: false),
                    CanCreate = table.Column<bool>(type: "boolean", nullable: false),
                    CanEdit = table.Column<bool>(type: "boolean", nullable: false),
                    CanDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CanApprove = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserSchoolEnrollments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSchoolEnrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSchoolEnrollments_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSchoolEnrollments_Users_UserId",
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

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "Id", "CanApprove", "CanCreate", "CanDelete", "CanEdit", "CanView", "CreatedAt", "IsDeleted", "Module", "Role", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("10000000-0000-0000-0000-000000000001"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3241), false, "Dashboard", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000002"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3285), false, "Schools", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000003"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3304), false, "Users", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000004"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3318), false, "Roles", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000005"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3328), false, "Articles", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000006"), true, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3344), false, "Categories", "SuperAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000007"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3355), false, "Dashboard", "SchoolAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000008"), false, true, true, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3366), false, "Users", "SchoolAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000009"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3377), false, "Roles", "SchoolAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000010"), true, true, false, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3399), false, "Articles", "SchoolAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000011"), false, true, false, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3411), false, "Categories", "SchoolAdmin", null },
                    { new Guid("10000000-0000-0000-0000-000000000012"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3422), false, "Dashboard", "Teacher", null },
                    { new Guid("10000000-0000-0000-0000-000000000013"), false, true, false, true, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3432), false, "Articles", "Teacher", null },
                    { new Guid("10000000-0000-0000-0000-000000000014"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3443), false, "Categories", "Teacher", null },
                    { new Guid("10000000-0000-0000-0000-000000000015"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3453), false, "Dashboard", "Student", null },
                    { new Guid("10000000-0000-0000-0000-000000000016"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3463), false, "Articles", "Student", null },
                    { new Guid("10000000-0000-0000-0000-000000000017"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3474), false, "Categories", "Student", null },
                    { new Guid("10000000-0000-0000-0000-000000000018"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3493), false, "Dashboard", "Parent", null },
                    { new Guid("10000000-0000-0000-0000-000000000019"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3505), false, "Articles", "Parent", null },
                    { new Guid("10000000-0000-0000-0000-000000000020"), false, false, false, false, true, new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(3516), false, "Categories", "Parent", null }
                });

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(1608), new DateTime(2027, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(1509) });

            migrationBuilder.InsertData(
                table: "UserSchoolEnrollments",
                columns: new[] { "Id", "CreatedAt", "EnrolledAt", "IsDeleted", "IsPrimary", "Role", "SchoolId", "Status", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { new Guid("20000000-0000-0000-0000-000000000001"), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4557), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4556), false, true, "SuperAdmin", new Guid("00000000-0000-0000-0000-000000000002"), "Active", null, new Guid("00000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000002"), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4605), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4604), false, true, "SchoolAdmin", new Guid("00000000-0000-0000-0000-000000000002"), "Active", null, new Guid("00000000-0000-0000-0000-000000000006") },
                    { new Guid("20000000-0000-0000-0000-000000000003"), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4622), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4621), false, true, "Teacher", new Guid("00000000-0000-0000-0000-000000000002"), "Active", null, new Guid("00000000-0000-0000-0000-000000000007") },
                    { new Guid("20000000-0000-0000-0000-000000000004"), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4637), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4636), false, true, "Student", new Guid("00000000-0000-0000-0000-000000000002"), "Active", null, new Guid("00000000-0000-0000-0000-000000000008") },
                    { new Guid("20000000-0000-0000-0000-000000000005"), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4652), new DateTime(2026, 5, 3, 19, 41, 27, 999, DateTimeKind.Utc).AddTicks(4651), false, true, "Parent", new Guid("00000000-0000-0000-0000-000000000002"), "Active", null, new Guid("00000000-0000-0000-0000-000000000009") }
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_Role_Module",
                table: "RolePermissions",
                columns: new[] { "Role", "Module" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSchoolEnrollments_SchoolId",
                table: "UserSchoolEnrollments",
                column: "SchoolId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSchoolEnrollments_UserId_SchoolId_Role",
                table: "UserSchoolEnrollments",
                columns: new[] { "UserId", "SchoolId", "Role" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "UserSchoolEnrollments");

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

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9772));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9777));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9783));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 19, 20, 53, 956, DateTimeKind.Utc).AddTicks(9788));
        }
    }
}
