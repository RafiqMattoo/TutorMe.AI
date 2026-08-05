using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Articles.Commands;
using VidyaAI.Application.Articles.Queries;
using VidyaAI.Application.Auth.Commands;
using VidyaAI.Application.Dashboard.Queries;
using VidyaAI.Application.Deliveries.Commands;
using VidyaAI.Application.Deliveries.Queries;
using VidyaAI.Application.Flashcards.Commands;
using VidyaAI.Application.Flashcards.Queries;
using VidyaAI.Application.LessonPlans.Commands;
using VidyaAI.Application.LessonPlans.Queries;
using VidyaAI.Application.Academics.Commands;
using VidyaAI.Application.Academics.Queries;
using VidyaAI.Application.Students.Commands;
using VidyaAI.Application.Students.Queries;
using VidyaAI.Application.Transport.Commands;
using VidyaAI.Application.Transport.Queries;
using VidyaAI.Application.Approvals.Commands;
using VidyaAI.Application.Approvals.Queries;
using VidyaAI.Application.Materials.Commands;
using VidyaAI.Application.Materials.Queries;
using VidyaAI.Application.Narration.Commands;
using VidyaAI.Application.Narration.Queries;
using VidyaAI.Application.Notifications.Commands;
using VidyaAI.Application.Notifications.Queries;
using VidyaAI.Application.Registration.Commands;
using VidyaAI.Application.Registration.Queries;
using VidyaAI.Application.Quizzes.Commands;
using VidyaAI.Application.Quizzes.Queries;
using VidyaAI.Application.Schools.Commands;
using VidyaAI.Application.Schools.Queries;
using VidyaAI.Application.SimpleBot.Commands;
using VidyaAI.Application.Tutor.Commands;
using VidyaAI.Application.Tutor.Queries;
using VidyaAI.Application.Users.Commands;
using VidyaAI.Application.Users.Queries;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Enrollments;
using VidyaAI.Application.Roles;
using VidyaAI.Domain.Enums;


namespace VidyaAI.API.Controllers
{
    // ── TUTOR (RAG chat) ──────────────────────────────────────────────
    [Route("api/tutor"), Authorize]
    public sealed class TutorController(ISender sender) : BaseController(sender)
    {
        [HttpGet("sessions")]
        public async Task<IActionResult> GetSessions(CancellationToken ct)
            => Ok(await Sender.Send(new GetChatSessionsQuery(CurrentUserId), ct));

        [HttpGet("sessions/{id:guid}/messages")]
        public async Task<IActionResult> GetMessages(Guid id, CancellationToken ct)
            => Ok(await Sender.Send(new GetChatMessagesQuery(id, CurrentUserId), ct));

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskTutorRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new AskTutorCommand(req.SessionId, req.MaterialId, req.Question, CurrentUserId), ct));

        // Server-Sent Events stream of the answer, token-by-token (ChatGPT-style typing).
        [HttpPost("ask/stream")]
        public async Task AskStream([FromBody] AskTutorRequest req, CancellationToken ct)
        {
            Response.Headers.ContentType = "text/event-stream";
            Response.Headers.CacheControl = "no-cache";
            Response.Headers["X-Accel-Buffering"] = "no"; // disable proxy buffering (nginx)
            HttpContext.Features.Get<IHttpResponseBodyFeature>()?.DisableBuffering();

            async Task WriteEventAsync(TutorStreamEvent ev) =>
                await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(ev, SseJson)}\n\n", ct);

            try
            {
                await foreach (var ev in Sender.CreateStream(
                    new AskTutorStreamCommand(req.SessionId, req.MaterialId, req.Question, CurrentUserId), ct))
                {
                    await WriteEventAsync(ev);
                    await Response.Body.FlushAsync(ct);
                }
            }
            catch (Exception ex) when (!ct.IsCancellationRequested)
            {
                await WriteEventAsync(new TutorStreamEvent("error", null, ex.Message, null, null));
                await Response.Body.FlushAsync(ct);
            }
        }

        private static readonly System.Text.Json.JsonSerializerOptions SseJson =
            new(System.Text.Json.JsonSerializerDefaults.Web);

        [HttpDelete("sessions/{id:guid}")]
        public async Task<IActionResult> DeleteSession(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteChatSessionCommand(id, CurrentUserId), ct);
            return NoContent();
        }
    }
}

