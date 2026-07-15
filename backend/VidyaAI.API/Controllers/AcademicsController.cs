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
 // ── ACADEMIC STRUCTURE (A1) ──────────────────────────────────────
 // Manage the academic backbone for a school. SuperAdmin operates on a school passed
 // via ?schoolId=; everyone else is scoped to their own school (from the JWT).
    [Route("api/academics"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class AcademicsController(ISender sender) : BaseController(sender)
    {
        // Resolve the tenant: a non-SuperAdmin is always pinned to their own school.
        private Guid Scope(Guid? schoolId)
            => ((IsSuperAdmin ? (schoolId ?? CurrentSchoolId) : CurrentSchoolId))
               ?? throw new InvalidOperationException("A school context is required.");

        // Academic years (+ terms)
        [HttpGet("years")]
        public async Task<IActionResult> GetYears([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetAcademicYearsQuery(Scope(schoolId)), ct));

        [HttpPost("years")]
        public async Task<IActionResult> SaveYear([FromBody] SaveAcademicYearRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveAcademicYearCommand(null, Scope(req.SchoolId), req.Name, req.StartDate, req.EndDate, req.IsCurrent), ct));

        [HttpPut("years/{id:guid}")]
        public async Task<IActionResult> UpdateYear(Guid id, [FromBody] SaveAcademicYearRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveAcademicYearCommand(id, Scope(req.SchoolId), req.Name, req.StartDate, req.EndDate, req.IsCurrent), ct));

        [HttpDelete("years/{id:guid}")]
        public async Task<IActionResult> DeleteYear(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteAcademicYearCommand(id, Scope(schoolId)), ct); return NoContent(); }

        [HttpPost("years/{yearId:guid}/terms")]
        public async Task<IActionResult> SaveTerm(Guid yearId, [FromBody] SaveTermRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTermCommand(null, Scope(schoolId), yearId, req.Name, req.StartDate, req.EndDate, req.SortOrder), ct));

        [HttpPut("terms/{id:guid}")]
        public async Task<IActionResult> UpdateTerm(Guid id, [FromBody] SaveTermRequest req, [FromQuery] Guid yearId, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTermCommand(id, Scope(schoolId), yearId, req.Name, req.StartDate, req.EndDate, req.SortOrder), ct));

        [HttpDelete("terms/{id:guid}")]
        public async Task<IActionResult> DeleteTerm(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteTermCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Classes
        [HttpGet("classes")]
        public async Task<IActionResult> GetClasses([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetSchoolClassesQuery(Scope(schoolId)), ct));

        [HttpPost("classes")]
        public async Task<IActionResult> SaveClass([FromBody] SaveSchoolClassRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSchoolClassCommand(null, Scope(req.SchoolId), req.Name, req.Stage, req.Level), ct));

        [HttpPut("classes/{id:guid}")]
        public async Task<IActionResult> UpdateClass(Guid id, [FromBody] SaveSchoolClassRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSchoolClassCommand(id, Scope(req.SchoolId), req.Name, req.Stage, req.Level), ct));

        [HttpDelete("classes/{id:guid}")]
        public async Task<IActionResult> DeleteClass(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteSchoolClassCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Sections
        [HttpGet("sections")]
        public async Task<IActionResult> GetSections([FromQuery] Guid? schoolId, [FromQuery] Guid? classId, CancellationToken ct)
            => Ok(await Sender.Send(new GetSectionsQuery(Scope(schoolId), classId), ct));

        [HttpPost("sections")]
        public async Task<IActionResult> SaveSection([FromBody] SaveSectionRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSectionCommand(null, Scope(schoolId), req.SchoolClassId, req.Name, req.Capacity, req.ClassTeacherId, req.StreamId), ct));

        [HttpPut("sections/{id:guid}")]
        public async Task<IActionResult> UpdateSection(Guid id, [FromBody] SaveSectionRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSectionCommand(id, Scope(schoolId), req.SchoolClassId, req.Name, req.Capacity, req.ClassTeacherId, req.StreamId), ct));

        [HttpDelete("sections/{id:guid}")]
        public async Task<IActionResult> DeleteSection(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteSectionCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Subjects
        [HttpGet("subjects")]
        public async Task<IActionResult> GetSubjects([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetSubjectsQuery(Scope(schoolId)), ct));

        [HttpPost("subjects")]
        public async Task<IActionResult> SaveSubject([FromBody] SaveSubjectRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSubjectCommand(null, Scope(req.SchoolId), req.Name, req.Code, req.MediumOfInstruction, req.IsLanguage, req.IsCoScholastic), ct));

        [HttpPut("subjects/{id:guid}")]
        public async Task<IActionResult> UpdateSubject(Guid id, [FromBody] SaveSubjectRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSubjectCommand(id, Scope(req.SchoolId), req.Name, req.Code, req.MediumOfInstruction, req.IsLanguage, req.IsCoScholastic), ct));

        [HttpDelete("subjects/{id:guid}")]
        public async Task<IActionResult> DeleteSubject(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteSubjectCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Houses
        [HttpGet("houses")]
        public async Task<IActionResult> GetHouses([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetHousesQuery(Scope(schoolId)), ct));

        [HttpPost("houses")]
        public async Task<IActionResult> SaveHouse([FromBody] SaveHouseRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveHouseCommand(null, Scope(req.SchoolId), req.Name, req.ColorHex, req.HouseMasterId), ct));

        [HttpPut("houses/{id:guid}")]
        public async Task<IActionResult> UpdateHouse(Guid id, [FromBody] SaveHouseRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveHouseCommand(id, Scope(req.SchoolId), req.Name, req.ColorHex, req.HouseMasterId), ct));

        [HttpDelete("houses/{id:guid}")]
        public async Task<IActionResult> DeleteHouse(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteHouseCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Teachers (picker options for class teacher / house master / allocation)
        [HttpGet("teachers")]
        public async Task<IActionResult> GetTeachers([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetSchoolTeachersQuery(Scope(schoolId)), ct));

        // Streams
        [HttpGet("streams")]
        public async Task<IActionResult> GetStreams([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetStreamsQuery(Scope(schoolId)), ct));

        [HttpPost("streams")]
        public async Task<IActionResult> SaveStream([FromBody] SaveStreamRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStreamCommand(null, Scope(req.SchoolId), req.Name, req.Code), ct));

        [HttpPut("streams/{id:guid}")]
        public async Task<IActionResult> UpdateStream(Guid id, [FromBody] SaveStreamRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStreamCommand(id, Scope(req.SchoolId), req.Name, req.Code), ct));

        [HttpDelete("streams/{id:guid}")]
        public async Task<IActionResult> DeleteStream(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteStreamCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Subject allocations (subject–teacher–class mapping)
        [HttpGet("allocations")]
        public async Task<IActionResult> GetAllocations([FromQuery] Guid? schoolId, [FromQuery] Guid? classId, CancellationToken ct)
            => Ok(await Sender.Send(new GetSubjectAllocationsQuery(Scope(schoolId), classId), ct));

        [HttpPost("allocations")]
        public async Task<IActionResult> SaveAllocation([FromBody] SaveSubjectAllocationRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSubjectAllocationCommand(null, Scope(req.SchoolId), req.SubjectId, req.SchoolClassId, req.SectionId, req.TeacherId), ct));

        [HttpPut("allocations/{id:guid}")]
        public async Task<IActionResult> UpdateAllocation(Guid id, [FromBody] SaveSubjectAllocationRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveSubjectAllocationCommand(id, Scope(req.SchoolId), req.SubjectId, req.SchoolClassId, req.SectionId, req.TeacherId), ct));

        [HttpDelete("allocations/{id:guid}")]
        public async Task<IActionResult> DeleteAllocation(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteSubjectAllocationCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Grading scales (+ bands)
        [HttpGet("grading-scales")]
        public async Task<IActionResult> GetGradingScales([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetGradingScalesQuery(Scope(schoolId)), ct));

        [HttpPost("grading-scales")]
        public async Task<IActionResult> SaveGradingScale([FromBody] SaveGradingScaleRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveGradingScaleCommand(null, Scope(req.SchoolId), req.Name, req.Board, req.IsDefault), ct));

        [HttpPut("grading-scales/{id:guid}")]
        public async Task<IActionResult> UpdateGradingScale(Guid id, [FromBody] SaveGradingScaleRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveGradingScaleCommand(id, Scope(req.SchoolId), req.Name, req.Board, req.IsDefault), ct));

        [HttpDelete("grading-scales/{id:guid}")]
        public async Task<IActionResult> DeleteGradingScale(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteGradingScaleCommand(id, Scope(schoolId)), ct); return NoContent(); }

        [HttpPost("grading-scales/{scaleId:guid}/bands")]
        public async Task<IActionResult> SaveGradeBand(Guid scaleId, [FromBody] SaveGradeBandRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveGradeBandCommand(null, Scope(schoolId), scaleId, req.Grade, req.MinPercent, req.MaxPercent, req.GradePoint, req.Description), ct));

        [HttpPut("bands/{id:guid}")]
        public async Task<IActionResult> UpdateGradeBand(Guid id, [FromBody] SaveGradeBandRequest req, [FromQuery] Guid scaleId, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new SaveGradeBandCommand(id, Scope(schoolId), scaleId, req.Grade, req.MinPercent, req.MaxPercent, req.GradePoint, req.Description), ct));

        [HttpDelete("bands/{id:guid}")]
        public async Task<IActionResult> DeleteGradeBand(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteGradeBandCommand(id, Scope(schoolId)), ct); return NoContent(); }
    }
}
