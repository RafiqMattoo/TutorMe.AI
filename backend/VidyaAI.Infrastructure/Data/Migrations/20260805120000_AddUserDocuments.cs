using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidyaAI.Infrastructure.Data.Migrations
{
    public partial class AddUserDocuments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QualificationDocumentUrl",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExperienceDocumentUrl",
                table: "Users",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QualificationDocumentUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ExperienceDocumentUrl",
                table: "Users");
        }
    }
}
