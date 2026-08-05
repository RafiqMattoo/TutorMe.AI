using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Schools.Commands;
using VidyaAI.Application.Schools.Queries;
using VidyaAI.Application.DTOs;


namespace VidyaAI.API.Controllers
{

    [Route("api/schools"), Authorize(Roles = "SuperAdmin")]
    public sealed class SchoolsController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetSchoolsQuery(page, pageSize, search), ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await Sender.Send(new GetSchoolByIdQuery(id), ct));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSchoolRequest req, CancellationToken ct)
        {
            var result = await Sender.Send(new CreateSchoolCommand(req.Name, req.Address, req.City, req.State, req.Phone, req.Email, req.Type, req.Board, req.Plan), ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSchoolRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new UpdateSchoolCommand(id, req.Name, req.Address, req.City, req.State, req.Phone, req.Email, req.LogoUrl, req.Type, req.Board, req.IsActive, req.Plan, req.SubscriptionStatus, req.SubscriptionExpiresAt), ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct) { await Sender.Send(new DeleteSchoolCommand(id), ct); return NoContent(); }
    }
}
