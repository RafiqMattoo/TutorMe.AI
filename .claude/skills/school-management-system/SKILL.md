---
name: school-management-system
description: Master execution prompt for building VidyaAI into a full-fledged, enterprise-grade, NEP-2020-aligned School Management System (SMS) for Indian schools. Invoke when the user wants to design or build any SMS module — admissions, SIS, attendance, timetable, NEP competency-based assessment & Holistic Progress Card, fees/finance, HR/payroll, library, transport, hostel, communication, compliance (UDISE+/RTE/APAAR/DPDP), parent portal, or analytics. Builds ONE module at a time, end-to-end, matching the existing Clean-Architecture + MediatR backend and React/TanStack/Tailwind frontend.
---

# VidyaAI — Enterprise School Management System (NEP 2020) — Master Build Prompt

You are extending **VidyaAI** (a multi-tenant, AI-first education platform) into a complete,
enterprise-grade **School Management System** for Indian schools, fully aligned to the
**National Education Policy (NEP) 2020** and Indian statutory/compliance requirements.

This skill is the single source of truth for that programme. It is executed **incrementally**:
each invocation builds **exactly one module (or one sub-feature)** end-to-end — Domain →
Application → Infrastructure → API → Frontend → migration → verification — and stops. Never
attempt the whole system in one pass. Quality and consistency over breadth.

---

## 0. How to execute this skill (the protocol)

When invoked:

1. **Pick the target.** Use the module the user named. If none named, propose the next
   un-built module from the **Roadmap** (§4) in dependency order and confirm with one
   `AskUserQuestion`.
2. **Scope a single bit.** Decompose the chosen module into the smallest shippable vertical
   slice that delivers user value (e.g. "Fee head + fee structure CRUD" before "online payment").
   Present the slice and its acceptance criteria, then build it.
3. **Build the full vertical slice** across all layers (§2 architecture contract). Reuse
   existing patterns and services — do not reinvent auth, multi-tenancy, storage, notifications,
   AI, or pagination.
4. **Migrate & verify.** Add the EF migration, build backend (`dotnet build`) and frontend
   (`npx tsc --noEmit`), and report results honestly. Do **not** apply DB migrations or push
   unless asked.
5. **Update the roadmap checkbox** in this file (§4) and write a one-line memory if a
   non-obvious decision was made.
6. **Stop.** Summarise what shipped, what's stubbed, and the recommended next slice.

**Golden rules**
- One module per run. One vertical slice at a time inside it.
- Every table is tenant-scoped by `SchoolId` and soft-deleted. Every query respects the
  current tenant and role.
- NEP alignment is not cosmetic — model the 5+3+3+4 stages, competencies, and the Holistic
  Progress Card as first-class domain concepts (§3).
- Match the codebase's existing conventions exactly (§2). New code must read like old code.
- No mock data in production paths; no silent truncation; surface every skipped/stubbed part.

---

## 1. Product vision & guiding principles

**Vision.** A leadership-to-classroom-to-parent platform that runs the entire lifecycle of an
Indian school — admission to alumni — with NEP-2020 pedagogy and AI woven through, usable by a
single school or a multi-branch trust from one tenant-aware deployment.

**Guiding principles**
- **NEP-first pedagogy:** competency-based, holistic, multilingual, experiential, low-stakes,
  flexible. Assessment measures learning *outcomes*, not just marks.
- **Enterprise-grade:** multi-tenant isolation, RBAC + fine-grained permissions, auditability,
  observability, idempotent money flows, data privacy (DPDP Act 2023), horizontal scale.
- **India-real:** UDISE+, APAAR/Aadhaar, RTE 25% EWS, CBSE/CISCE/State boards, regional
  languages, fee/GST realities, biometric/RFID attendance, SMS/WhatsApp comms.
- **Leverage what exists:** the AI learning suite (Materials/RAG Tutor, Flashcards, Quizzes,
  Narration/Recite/Explainer, Story Scenes, Lesson Plans) becomes the *teaching-learning* core
  of the LMS — connect to it, don't duplicate it.
- **Accessible & inclusive:** WCAG-minded UI, multilingual UI strings, divyang (CWSN) support.

---

## 2. Architecture contract (match this exactly)

The repo lives at `/Users/rafiq/RiderProjects/TutorMe.AI`. Backend is .NET Clean Architecture;
frontend is React + Vite under `backend/VidyaAI.API/frontend`.

### Backend (.NET, Clean Architecture, MediatR CQRS)
- **Projects:** `VidyaAI.Domain` (entities, enums), `VidyaAI.Application` (CQRS handlers, DTOs,
  interfaces, validators), `VidyaAI.Infrastructure` (EF Core, services, migrations),
  `VidyaAI.API` (controllers, Program.cs, config).
- **Entities:** `BaseEntity` (Id `Guid`, `CreatedAt`, `UpdatedAt?`, `IsDeleted` soft-delete).
  Group related entities in one file per area: `Entities.cs`, `LearningEntities.cs`,
  `NarrationEntities.cs` → add e.g. `SisEntities.cs`, `FinanceEntities.cs`, `ExamEntities.cs`.
- **Enums:** all in `VidyaAI.Domain/Enums/Enums.cs`. Stored as strings (`HasConversion<string>()`).
- **CQRS:** MediatR. One `record` per Command/Query implementing `IRequest<TDto>`, with a sealed
  `...Handler`. Group per feature in `Application/<Feature>/<Feature>Handlers.cs` using nested
  `namespace VidyaAI.Application.<Feature>.Commands` / `.Queries`. Add FluentValidation
  `...Validator` classes. Mapping via a small internal static `...Mapping` class.
- **DTOs:** records in `Application/DTOs/Dtos.cs`.
- **Interfaces:** `Application/Common/Interfaces/IServices.cs` and `IAppDbContext` (add new
  `DbSet<>`s here AND in `AppDbContext`).
- **DbContext:** `Infrastructure/Data/AppDbContext.cs` — `DbSet<>` + Fluent config in
  `OnModelCreating` (keys, max lengths, indexes, unique constraints, `HasQueryFilter(x => !x.IsDeleted)`,
  tenant index on `SchoolId`, cascade rules, enum `HasConversion<string>`).
- **Controllers:** `API/Controllers/Controllers.cs`. `sealed class XController(ISender sender) : BaseController(sender)`
  with `[Route("api")]`/`[Route("api/[controller]")]`; actions `=> Ok(await Sender.Send(...))`.
  Authorize by role/permission.
- **Services:** `Infrastructure/Services/*.cs`, registered in `Program.cs`. Config-driven
  providers where external (follow `GeminiService`/`MacSayTtsService`/`LocalFileStorageService`).
- **Migrations:** `dotnet ef migrations add <Name> --project VidyaAI.Infrastructure --startup-project VidyaAI.API`.
  Postgres; pgvector already used for embeddings. Never auto-apply to the DB unless asked.
- **Cross-cutting to reuse:** `ICurrentUser` (UserId/Role/SchoolId/IsInRole), `IStorageService`,
  `IEmailService`, `ICacheService` (Redis), `INotification`/notifications pipeline,
  `ILlmChatService`/`IEmbeddingService`/`IImageGenerationService`, JWT auth, soft-delete filters.

### Frontend (React + TS + Vite + TanStack Query + Tailwind)
- **Pages:** `src/pages/<feature>/<Feature>Page.tsx`. Data via `@tanstack/react-query`.
- **API:** add a typed module to `src/api/index.ts` (axios; `.then(r => r.data)`).
- **Types:** mirror DTOs in `src/types/index.ts`.
- **Routing:** add `<Route>` in `src/App.tsx` wrapped in `<RoleRoute>`.
- **RBAC:** add the path to `allowedRoutes` per role in `src/auth/roles.ts` (`canAccess`).
- **Nav:** add an item with a `lucide-react` icon in `src/components/layout/AdminLayout.tsx`.
- **UI kit:** reuse `PageHeader`, `card`, `btn-primary`/`btn-secondary`, `input`, `clsx`,
  Tailwind tokens, `animate-*` keyframes in `tailwind.config.js`.

### Multi-tenancy & RBAC
- Tenant = `School`. Every domain row carries `SchoolId` (nullable only for platform-global rows).
- Roles today: `SuperAdmin, SchoolAdmin, Teacher, Student, Parent`. Extend with SMS roles as
  needed (e.g. `Principal, Accountant, Librarian, Transport, Counselor, Receptionist, Nurse`)
  via the existing `RoleDefinition`/`RolePermission`/`PermissionModule` system — prefer
  fine-grained permissions over hard-coded role checks for new modules.

---

## 3. NEP 2020 domain model (build these as first-class concepts)

Model these explicitly so every module can speak NEP:

- **Stage structure (5+3+3+4):** `SchoolStage { Foundational, Preparatory, Middle, Secondary }`.
  Map `Grade`/`Class` (Balvatika/Pre-K → Grade 12) to a stage. Foundational = play/activity-based
  (FLN focus); Secondary = multidisciplinary + subject choice + credits.
- **FLN (Foundational Literacy & Numeracy):** trackable competencies & milestones for
  Foundational/Preparatory; teacher observation entries; "Nipun Bharat" goals.
- **Competency framework:** `LearningOutcome`/`Competency` linked to `Subject` + `Grade`, with
  proficiency levels (e.g. Beginner → Proficient → Advanced) and Bloom/skill tags. Assessments,
  assignments and AI content map to competencies.
- **Holistic Progress Card (HPC):** the report card is 360° — `self`, `peer`, `teacher`, and
  `parent` inputs across **scholastic** (subject competencies) and **co-scholastic** (values,
  health & wellbeing, arts, sports, life skills) domains. No single rank; descriptive +
  competency-graded. CBSE 9-point grading supported where boards require marks.
- **Assessment philosophy:** continuous & comprehensive — `Formative` (low-stakes, frequent),
  `Summative` (term), with rubrics, descriptive feedback, and competency attainment. Avoid
  high-stakes-only design.
- **Multilingualism:** content & UI support mother-tongue/regional languages; subjects can be
  taught in a medium of instruction; three-language formula fields.
- **Experiential / multidisciplinary / vocational:** projects, bagless days, internships,
  art-integrated & sport-integrated learning, skill courses, and **Academic Bank of Credits
  (ABC)**-style credit accumulation at secondary stage.
- **Inclusion:** CWSN/divyang flags, accommodations, gender-inclusion, EWS/RTE tracking.

---

## 4. Module roadmap (build in this dependency order; tick as shipped)

> Execute top-down; each module assumes the ones above it. Within a module, ship the smallest
> vertical slice first. Update these checkboxes as modules land.

### Phase A — Foundation & academic backbone
- [x] **A1. Academic Structure** — AcademicYear, Term/Semester, SchoolStage (NEP 5+3+3+4)
  mapping, Class/Grade, Section (+ class teacher), Subject (+ medium of instruction,
  three-language, co-scholastic), House. Tenant-scoped, the spine everything references.
  *(Shipped: `AcademicEntities.cs`, `AcademicHandlers.cs`, `AcademicsController`,
  `AcademicStructurePage.tsx`, migration `AddAcademicStructure`. Backend + tsc green.)*
  *(Completed 2026-06-12: added Streams (`AcademicStream`, Section.StreamId), Subject–Teacher
  mapping (`SubjectAllocation` + `/academics/teachers` picker), configurable Grading Scales
  (`GradingScale` + `GradeBand`, one default/school, CBSE-9-point style). Wired class-teacher &
  house-master pickers. Migration `AddStreamsAllocationsGrading` (additive). Backend + tsc green.)*
- [~] **A2. Student Information System (SIS)** — Student master: demographics, APAAR ID, UDISE
  student fields, Aadhaar (consented/encrypted), guardians/parents (link to `User`/Parent role),
  siblings, category (Gen/OBC/SC/ST/EWS), CWSN/divyang, medical, documents (via `IStorageService`),
  admission number, current enrollment (Class/Section/Year), house, transport/hostel flags.
  *(Shipped 2026-06-12: `Student` master — `SisEntities.cs`, `StudentHandlers.cs`,
  `StudentsController`, `StudentsPage.tsx`, migration `AddStudents`. Full CRUD + paged/filterable
  roster (search, class, status), admission-number suggestion, identity/placement/contact/
  demographics/guardian fields, RTE & CWSN flags, Category for UDISE. Backend + tsc green.
  DEFERRED: photo/document upload via `IStorageService`, medical & discipline records, sibling
  links, ID-card/QR generation, Parent/Student login provisioning, bulk CSV import, Aadhaar
  encryption (E7). Enrollment-history/promotion is A4.)*
- [ ] **A3. Staff & HR core** — Staff master (teaching/non-teaching), qualifications, subjects
  handled, designations, the extended SMS roles, joining/exit, documents. Reuse `User` for login.
- [ ] **A4. Enrollment & promotion** — enrol a student into Class/Section for a Year; promote /
  detain / transfer-out at year rollover; maintain enrollment history.

### Phase B — Daily operations
- [ ] **B1. Admissions** — public enquiry → application form → document checklist → verification
  → **RTE 25% EWS lottery/merit** → seat allocation → admission fee → convert to Student.
  Leverage existing self-registration/approval flow where it fits.
- [ ] **B2. Timetable & scheduling** — periods/bells, teacher-subject-class allocation, room
  allocation, clash detection, and a **substitution engine** for absent teachers.
- [ ] **B3. Attendance** — student (daily + period-wise) and staff; manual + biometric/RFID
  ingestion hooks; leave application/approval; NEP-relevant attendance analytics & alerts to parents.
- [ ] **B4. Communication** — announcements, circulars, targeted notices (school/class/section/
  individual), multi-channel delivery (in-app + email now; SMS/WhatsApp adapters as providers),
  read receipts. Extend the existing Notifications pipeline.

### Phase C — Teaching, learning & assessment (NEP core)
- [ ] **C1. Curriculum & competencies** — Subject → Unit/Chapter → LearningOutcome/Competency
  with proficiency levels; map existing Materials/Lesson Plans/Quizzes/Flashcards to competencies.
- [ ] **C2. Assignments & homework** — create/assign (class/section/student), submissions
  (file/text), competency tagging, AI-assisted feedback (reuse `ILlmChatService`), grading.
- [ ] **C3. Examinations & assessment** — exam terms, schemes, formative/summative records,
  rubrics, marks/grades entry, CBSE 9-point grading, moderation, result processing.
- [ ] **C4. Holistic Progress Card (HPC) & report cards** — 360° scholastic + co-scholastic,
  self/peer/teacher/parent inputs, descriptive feedback, competency attainment, printable
  PDF report card / marksheet; multilingual.
- [ ] **C5. Experiential, vocational & ABC credits** — projects, bagless-day activities,
  internships, skill courses, credit accumulation at secondary stage.

### Phase D — Finance & resources
- [ ] **D1. Fees & Finance** — fee heads, fee structures per class/category, concessions &
  scholarships (incl. RTE), invoice generation, **online payment** (gateway adapter, idempotent),
  receipts, dues/late fees, refunds, GST where applicable, ledgers & day-book.
- [ ] **D2. Payroll (staff)** — salary structures, attendance/leave-linked, payslips, statutory
  (PF/ESI/TDS) fields.
- [ ] **D3. Library** — catalog (books + digital, link to Materials), member issue/return,
  reservations, fines.
- [~] **D4. Transport** — routes, stops, vehicles, drivers, student allocation, fees link,
  GPS/live-tracking hooks, parent ETA notifications.
  *(Shipped 2026-06-13: `TransportEntities.cs` (Vehicle/Route/Stop/StudentTransport),
  `TransportHandlers.cs`, `TransportController`, `TransportPage.tsx` (4 tabs), migration
  `AddTransport`. Fleet w/ inline driver, routes w/ fare + `TransportFeeFrequency`, ordered
  stops w/ pickup/drop & optional stop-fare, per-student allocation w/ captured fare. Reusable
  `GET /students/options` picker added. Polished segmented `Tabs` UI component (also applied to
  Academics). Backend + tsc green. DEFERRED: GPS/live-tracking, parent ETA notifications,
  full fee-invoice integration (D1), driver as first-class staff record.)*
- [ ] **D5. Hostel/Boarding** — blocks/rooms, allocation, attendance, mess, visitor log.
- [ ] **D6. Inventory & assets** — stores, stock, issue/indent, asset register.

### Phase E — Wellbeing, governance & intelligence
- [ ] **E1. Counseling & wellbeing** — confidential counselor notes, referrals, health/wellbeing
  tracking feeding the HPC co-scholastic domain.
- [ ] **E2. Calendar, events, clubs & houses** — academic calendar, holidays, events, activity
  clubs, house points.
- [ ] **E3. Certificates & documents** — Transfer Certificate, bonafide, character, custom
  templates → PDF (reuse `EmailTemplates`/storage patterns).
- [ ] **E4. Compliance & government reporting** — UDISE+ data points & exports, RTE reports,
  board data exports, statutory registers.
- [ ] **E5. Parent & student portal/app surface** — consolidated child view: attendance, HPC,
  fees, homework, comms, transport, calendar.
- [ ] **E6. Analytics & BI** — leadership dashboards: FLN attainment, learning outcomes,
  attendance/dropout-risk, fee collection, staff load. Reuse `DashboardQueries` patterns.
- [ ] **E7. Platform hardening** — audit log, DPDP-Act consent & data-subject controls,
  PII encryption, per-module fine-grained permissions, rate limiting, observability.

---

## 5. Per-module execution template (use for every slice)

For the chosen slice, produce all of the following — and nothing outside scope:

```
### <Module>.<Slice> — <name>

**NEP / compliance hook:** <which NEP idea or statute this serves; "none" if purely operational>
**Depends on:** <modules/entities that must already exist>

1. DOMAIN
   - Entities (file: <X>Entities.cs): fields, relationships, SchoolId, soft-delete.
   - Enums (Enums.cs): <new enums, string-stored>.

2. APPLICATION
   - DTOs (Dtos.cs): request/response records.
   - Commands/Queries (<Feature>Handlers.cs): with handlers + FluentValidation validators + mapping.
   - Interfaces (IServices.cs): only if a new external capability is needed.

3. INFRASTRUCTURE
   - AppDbContext: DbSet + Fluent config (indexes incl. SchoolId, unique keys, query filter, enums).
   - Services: new provider(s) registered in Program.cs (config-driven if external).
   - Migration: dotnet ef migrations add <Name> (do not apply).

4. API
   - Controller(s) in Controllers.cs: endpoints, role/permission authorization, tenant scoping.

5. FRONTEND
   - types/index.ts, api/index.ts module, pages/<feature>/<Page>.tsx, App.tsx route,
     roles.ts allowedRoutes, AdminLayout nav item.

6. VERIFY
   - dotnet build (backend) + npx tsc --noEmit (frontend); report results.

**Acceptance criteria:** <bullet list of observable, testable outcomes>
**Stubbed/Deferred:** <anything intentionally left for a later slice — state it explicitly>
```

---

## 6. Cross-cutting non-negotiables (apply to every module)

- **Tenant isolation:** filter by `ICurrentUser.SchoolId` on every read/write; `SuperAdmin`
  may cross tenants explicitly. Never trust a client-supplied `SchoolId` without an authz check.
- **AuthZ:** prefer fine-grained `PermissionModule` permissions for new modules over role string
  checks; enforce in handlers, not just UI.
- **Money & state:** payments/fees/payroll must be idempotent, auditable, and never lose a
  paise — use explicit status enums and ledger rows, not in-place mutation of balances.
- **PII & DPDP Act 2023:** minimise, encrypt sensitive identifiers (Aadhaar), record consent,
  support data-subject access/erasure; keep an audit trail.
- **Soft delete + audit:** `IsDeleted` query filters everywhere; capture who/when on mutations.
- **i18n:** user-facing strings translatable; report cards & comms support regional languages.
- **Accessibility:** semantic, keyboard-navigable, WCAG-minded; CWSN accommodations modeled.
- **Performance:** paginate lists (reuse existing pagination), index `SchoolId` + common filters,
  cache hot reads via `ICacheService`.
- **Honesty:** report build/test results truthfully; never claim a deferred piece is done.

---

## 7. First run

If the user hasn't named a module, recommend **A1. Academic Structure** (everything depends on
it) and, once confirmed, ship its first slice: `AcademicYear + Term + Class/Grade(+Stage) +
Section + Subject` CRUD with tenant scoping and an admin management page — then stop and report.
