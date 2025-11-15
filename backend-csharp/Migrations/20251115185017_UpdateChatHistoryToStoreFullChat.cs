using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessAssistant.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChatHistoryToStoreFullChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "ChatHistory");

            migrationBuilder.RenameColumn(
                name: "Response",
                table: "ChatHistory",
                newName: "MessagesJson");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ChatHistory",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ChatHistory");

            migrationBuilder.RenameColumn(
                name: "MessagesJson",
                table: "ChatHistory",
                newName: "Response");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "ChatHistory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
