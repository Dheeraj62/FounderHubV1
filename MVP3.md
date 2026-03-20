# FounderHub MVP-3 Upgrade Notes

This document describes what was added for **MVP-3** without rebuilding the app.

## Backend (.NET 10 + MongoDB)

### New MongoDB collections (created automatically by usage)

- `FeedEvents`
  - **Fields**: `Id`, `Type`, `UserId`, `ReferenceId`, `CreatedAt`
  - **Types**: `IDEA_CREATED`, `IDEA_UPDATED`, `FOUNDER_UPDATE`, `INTEREST_EVENT`, `NEW_FOUNDER`, `TRENDING_IDEA`
- `FounderUpdates`
  - **Fields**: `Id`, `FounderId`, `Content`, `CreatedAt`
- `Follows`
  - **Fields**: `Id`, `FollowerId`, `FollowingId`, `Type`, `CreatedAt`
  - **Type values**: `FOUNDER`, `INVESTOR`, `IDEA`
- `IdeaViews`
  - **Fields**: `Id`, `IdeaId`, `UserId`, `ViewedAt`

### Updated entities

- `Ideas`
  - Added: `PitchDeckUrl`, `DemoUrl`, `StartupWebsite`
- `FounderProfiles`
  - Added: `LinkedInProfileUrl`, `StartupWebsite`
- `InvestorProfiles`
  - Added: `InvestmentFirm`, `PortfolioCompanies`, `AngelListProfile`, `LinkedInVerified`, `LinkedInProfileUrl`
- `Users`
  - Added: `LinkedInVerified`, `LinkedInProfileUrl`

### New API endpoints

- **Feed**
  - `GET /api/feed?page=1&pageSize=20`
  - `GET /api/feed/following?page=1&pageSize=20`
  - `GET /api/feed/trending?limit=10`
- **Founder updates**
  - `POST /api/updates` (Founder-only)
  - `GET /api/updates/{founderId}?page=1&pageSize=20`
- **Follow system**
  - `POST /api/follow`
  - `DELETE /api/follow`
  - `GET /api/following?type=IDEA`
  - `GET /api/followers?type=FOUNDER`
- **Trending ideas**
  - `GET /api/ideas/trending?limit=10`

### Feed event generation

Feed events are emitted automatically when:

- A founder creates an idea → `IDEA_CREATED`
- A founder updates an idea or creates a new version → `IDEA_UPDATED`
- A founder posts an update → `FOUNDER_UPDATE`
- An investor expresses/updates interest → `INTEREST_EVENT` (references the `Interest.Id`)
- A founder registers → `NEW_FOUNDER`

### Security / constraints

- JWT auth is required for all feed/update/follow endpoints.
- Duplicate follows are prevented via a unique compound index.
- Duplicate interests remain prevented via existing unique compound index.
- View tracking ignores **self-views** (founder viewing their own idea).

## Frontend (Angular + Tailwind)

### New route

- `/feed` (protected via `authGuard`)

### New components

- `src/app/feed/feed-page/feed-page.component.ts`
- `src/app/feed/feed-card/feed-card.component.ts`
- `src/app/feed/feed-filter-bar/feed-filter-bar.component.ts`
- `src/app/feed/trending-widget/trending-widget.component.ts`

### New services/models

- `src/app/core/services/feed.service.ts`
- `src/app/core/models/feed.models.ts`
- `src/app/core/services/follow.service.ts`
- `src/app/core/models/follow.models.ts`
- `src/app/core/services/founder-updates.service.ts`

### Design system (Tailwind tokens + utilities)

- `frontend/tailwind.config.js` now includes:
  - **Primary** `#2563EB`
  - **Accent** `#06B6D4`
  - **Neutral** `#111827`
  - **Background** `#F9FAFB`
  - `Inter` as the default sans font
- `src/styles.css` defines reusable classes:
  - `app-card`, `app-btn-primary`, `app-btn-secondary`, `app-input`, `app-badge-*`

### Pitch deck / demo links UI

- Founder create/edit idea forms now include:
  - Pitch deck URL
  - Demo URL
  - Startup website
- Idea detail page displays these links when present.

## Run locally

### Backend

```bash
cd backend/FounderHub.Api
dotnet run
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200/`.

