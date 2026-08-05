using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Students_UserId",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "EstablishedYear",
                table: "Schools",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistrationNumber",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicYearId = table.Column<Guid>(type: "uuid", nullable: false),
                    TermId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exams_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Exams_Terms_TermId",
                        column: x => x.TermId,
                        principalTable: "Terms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ExamSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExamId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    MaxMarks = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    PassMarks = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamSubjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamSubjects_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamSubjects_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentExamResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExamSubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    MarksObtained = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Grade = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Remarks = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentExamResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentExamResults_ExamSubjects_ExamSubjectId",
                        column: x => x.ExamSubjectId,
                        principalTable: "ExamSubjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentExamResults_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                columns: new[] { "CreatedAt", "EstablishedYear", "RegistrationNumber", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(8751), null, null, new DateTime(2027, 8, 4, 10, 49, 55, 141, DateTimeKind.Utc).AddTicks(8723) });

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

            migrationBuilder.CreateIndex(
                name: "IX_Students_AadhaarNumber",
                table: "Students",
                column: "AadhaarNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Students_ApaarId",
                table: "Students",
                column: "ApaarId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_SchoolId_RollNumber",
                table: "Students",
                columns: new[] { "SchoolId", "RollNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true,
                filter: "\"UserId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_AcademicYearId",
                table: "Exams",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SchoolId",
                table: "Exams",
                column: "SchoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_TermId",
                table: "Exams",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubjects_ExamId_SubjectId",
                table: "ExamSubjects",
                columns: new[] { "ExamId", "SubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubjects_SubjectId",
                table: "ExamSubjects",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentExamResults_ExamSubjectId",
                table: "StudentExamResults",
                column: "ExamSubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentExamResults_StudentId",
                table: "StudentExamResults",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentExamResults_StudentId_ExamSubjectId",
                table: "StudentExamResults",
                columns: new[] { "StudentId", "ExamSubjectId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentExamResults");

            migrationBuilder.DropTable(
                name: "ExamSubjects");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Students_AadhaarNumber",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_ApaarId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_SchoolId_RollNumber",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_UserId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "EstablishedYear",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "RegistrationNumber",
                table: "Schools");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8730));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8751));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8773));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(441));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(471));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(494));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(518));

            migrationBuilder.UpdateData(
                table: "RoleDefinitions",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(541));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9126));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9183));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9243));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9307));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9347));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9383));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9415));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9448));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9502));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9564));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9633));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9671));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9737));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9779));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9814));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9899));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9953));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(9989));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(23));

            migrationBuilder.UpdateData(
                table: "RolePermissions",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(74));

            migrationBuilder.UpdateData(
                table: "Schools",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "SubscriptionExpiresAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(7945), new DateTime(2027, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(7924) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1724), new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1723) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1786), new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1785) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1849), new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1848) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000004"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1894), new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1893) });

            migrationBuilder.UpdateData(
                table: "UserSchoolEnrollments",
                keyColumn: "Id",
                keyValue: new Guid("20000000-0000-0000-0000-000000000005"),
                columns: new[] { "CreatedAt", "EnrolledAt" },
                values: new object[] { new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1938), new DateTime(2026, 7, 29, 8, 31, 13, 962, DateTimeKind.Utc).AddTicks(1937) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8469));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8499));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8528));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8557));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 29, 8, 31, 13, 961, DateTimeKind.Utc).AddTicks(8585));

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId");
        }
    }
}
