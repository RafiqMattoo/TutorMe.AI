# VidyaAI — Admin Panel MVP

> AI-powered School Management Platform
> Built by **CodeStrix Software Solutions Pvt. Ltd.** · Code · Create · Conquer

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│              React 18 + TypeScript + Vite + Tailwind            │
│  ┌───────────┐ ┌─────────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Dashboard │ │Users module │ │ Content  │ │   Settings    │  │
│  └───────────┘ └─────────────┘ └──────────┘ └───────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / JWT
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY                                │
│         .NET 8 · JWT Auth · Rate Limiting · Swagger             │
└────────────────────────┬────────────────────────────────────────┘
                         │ MediatR CQRS
┌────────────────────────▼────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│     CQRS Commands + Queries · MediatR · FluentValidation        │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────┐ ┌───────────┐  │
│  │UserSvc   │ │ ContentSvc   │ │AnalyticsSvc │ │ NotifSvc  │  │
│  └──────────┘ └──────────────┘ └─────────────┘ └───────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    DOMAIN LAYER                                 │
│       Entities · Domain Events · Aggregates · Interfaces        │
│  ┌─────────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────┐  │
│  │User aggregate│ │ Article  │ │ Subscription │ │Analytics │  │
│  └─────────────┘ └───────────┘ └──────────────┘ └──────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                            │
│       EF Core 8 · PostgreSQL · Repository Pattern · Outbox      │
└──────────┬──────────────────┬──────────────────┬───────────────┘
           │                  │                  │
    ┌──────▼──────┐   ┌───────▼──────┐   ┌──────▼──────┐
    │ PostgreSQL  │   │    Redis     │   │  Blob / S3  │
    │ Primary DB  │   │Cache+Session │   │Media + Files│
    └─────────────┘   └─────────────┘   └─────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  CROSS-CUTTING CONCERNS                         │
│   Serilog · OpenTelemetry · Global Exceptions · RBAC Policies  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐   ┌────────────────────────────────┐
│    BACKGROUND JOBS       │   │        AUTH SERVICE            │
│ Hangfire · Email · Rpt   │   │ JWT · Refresh · RBAC · 2FA    │
└──────────────────────────┘   └────────────────────────────────┘
```

---

## CQRS Request Pipeline

```
HTTP Request
    │
    ▼
Controller  →  ISender.Send(Command/Query)
    │
    ▼
MediatR Pipeline
    ├── LoggingBehavior        (all requests + timing)
    ├── ValidationBehavior     (FluentValidation)
    └── PerformanceBehavior    (warns >500ms)
    │
    ▼
Command/QueryHandler  →  AppDbContext  →  PostgreSQL
    │
    ▼
Response DTO  →  Controller  →  HTTP 200/201/204
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Recharts |
| API | .NET 8, C# 12, JWT, Swagger, Serilog |
| Application | MediatR CQRS, FluentValidation, Pipeline Behaviors |
| Domain | Clean Architecture, Domain Events |
| Infrastructure | EF Core 8, PostgreSQL, Repository Pattern |
| DevOps | Docker, Docker Compose |

---

## Project Structure

```
VidyaAI/
├── backend/
│   ├── VidyaAI.Domain/          Entities, Enums, Events, Interfaces
│   ├── VidyaAI.Application/     CQRS Commands+Queries, DTOs, Behaviors, Interfaces
│   ├── VidyaAI.Infrastructure/  AppDbContext, JwtService, CurrentUserService
│   └── VidyaAI.API/             Controllers (MediatR dispatch), Middleware
└── frontend/src/
    ├── api/          Axios client + typed API functions
    ├── components/   AdminLayout, StatCard, Table, Modal, PageHeader etc.
    ├── pages/        Dashboard, Schools, Users, Articles, ArticleForm, Categories, Login
    ├── store/        Zustand auth store
    └── types/        TypeScript interfaces
```

---

## Quick Start

**Prerequisites:** .NET 8 SDK, Node.js 18+, PostgreSQL 16

```bash
# 1. Create DB
psql -U postgres -c "CREATE DATABASE vidyaai;"

# 2. Update connection string in backend/VidyaAI.API/appsettings.json

# 3. Run API (auto-migrates on startup)
cd backend/VidyaAI.API && dotnet run
# http://localhost:5000  |  Swagger: http://localhost:5000/swagger

# 4. Run frontend
cd frontend && npm install && npm run dev
# http://localhost:5173
```

**Default login:** `admin@vidyaai.com` / `Admin@123`

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |
| GET | /api/dashboard/stats | KPIs + analytics |
| GET/POST | /api/schools | List / Create schools |
| GET/PUT/DELETE | /api/schools/{id} | School CRUD |
| GET/POST | /api/users | List / Create users |
| PATCH | /api/users/{id}/toggle-active | Enable/disable user |
| GET/POST | /api/articles | List / Create articles |
| GET/PUT/DELETE | /api/articles/{id} | Article CRUD |
| POST | /api/articles/{id}/publish | Publish article |
| POST | /api/articles/{id}/unpublish | Unpublish article |
| GET/POST/PUT/DELETE | /api/categories | Category CRUD |

---

## RBAC

| Role | Schools | Users | Articles |
|------|---------|-------|----------|
| SuperAdmin | Full CRUD | All | All |
| SchoolAdmin | View own | Own school | Own school |
| Teacher | — | — | Create/Edit own |

---

*Developed by CodeStrix Software Solutions Pvt. Ltd. — Srinagar, J&K*
