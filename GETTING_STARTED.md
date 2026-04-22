# Pokemon Team Builder — Getting Started

A full-stack Pokemon team building application built on Chorus Engineering's interview stack.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the App](#running-the-app)
  - [Useful pm2 commands](#useful-pm2-commands)
  - [Running servers individually](#running-servers-individually)
- [Seeding the Database](#seeding-the-database)
- [Connecting to the Database](#connecting-to-the-database)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Design & Accessibility Decisions](#design--accessibility-decisions)
  - [Accessibility](#accessibility)
  - [Visual Design](#visual-design)
  - [Layout](#layout)
  - [Backend Architecture](#backend-architecture)
- [What Improvements Would I Make](#what-improvements-would-i-make)
  - [Accessibility](#accessibility-1)
  - [Alternative Color Palette](#alternative-color-palette)
  - [Drag-and-Drop](#drag-and-drop)
  - [Frontend Architecture](#frontend-architecture)
  - [Performance](#performance)
  - [Validation & Testing](#validation--testing)
- [Troubleshooting](#troubleshooting)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Emotion CSS-in-JS, Vite |
| Backend | NestJS 10, TypeORM 0.3 |
| Database | PostgreSQL (auto-managed via Testcontainers + Docker) |
| Monorepo | Nx 19 |
| Package Manager | pnpm 8.15.8 |
| Runtime | Node 20.14.0 LTS |

## Prerequisites

Before starting, install the following:

**1. Node (via nvm)**
```bash
# Install nvm: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
nvm install --lts
```

**2. pnpm**
```bash
npm install -g pnpm@8.15.8
```

**3. Docker**

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Colima](https://github.com/abiosoft/colima) (macOS alternative).

Make sure the Docker daemon is running before starting the app.

## Setup

**1. Clone the repo**
```bash
git clone <repo-url>
cd engineering-interview
```

**2. Configure environment variables**
```bash
cp .env.local.example .env.local
```

Open `.env.local` and update the Docker socket paths if you are using Colima or a non-standard Docker setup:

```env
# Docker Desktop (default on macOS/Windows — leave as-is)
TESTCONTAINERS_DOCKER_SOCKET=/var/run/docker.sock
DOCKER_HOST=unix:///var/run/docker.sock

# Colima (macOS alternative — update path to match your setup)
TESTCONTAINERS_DOCKER_SOCKET=/Users/<your-username>/.colima/default/docker.sock
DOCKER_HOST=unix:///Users/<your-username>/.colima/default/docker.sock
```

All other defaults (database host, port, credentials) can stay as-is for local development.

**3. Install dependencies**
```bash
pnpm install
```

## Running the App

Start both the frontend and backend together:

```bash
pm2 start
```

> If `pm2` is not found, use `pnpm pm2 start` or add `node_modules/.bin` to your `PATH`.

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000/api |

The database starts automatically inside a Docker container via Testcontainers on first boot — no manual database setup is required.

Both servers watch for file changes and reload automatically.

### Useful pm2 commands

```bash
pm2 logs       # Stream logs from all processes
pm2 stop all   # Stop all servers
pm2 delete all # Remove entries from the pm2 process list
```

### Running servers individually

```bash
# Backend only
pnpm pokemon-user-backend:serve

# Frontend only
pnpm pokemon-ui:serve
```

## Seeding the Database

After the backend has started (and the database container is running), seed Pokemon and profile data:

```bash
pnpm seed:pokemon-user-backend
```

This reads from the YAML and SQL files in `packages/pokemon-user-backend/seed-data/` and populates:
- The `pokemon` table with the first 151 Pokemon and their forms
- The `profile` table with three test profiles

**Test profile emails:** `test@pokemon.com`, `test2@pokemon.com`, `test3@pokemon.com`

## Connecting to the Database

Use any SQL client (e.g. [DataGrip](https://www.jetbrains.com/datagrip/), [TablePlus](https://tableplus.com/)) with these credentials:

| Field | Value |
|---|---|
| Host | localhost |
| Port | 5432 |
| Database | pokemon |
| Username | admin |
| Password | admin |

> The database container must be running (i.e. the backend server must be started) for connections to work.

## Running Tests

```bash
# Run tests for a specific package
nx test pokemon-user-backend
nx test pokemon-ui

# Run e2e tests
nx e2e pokemon-user-backend-e2e
nx e2e pokemon-ui-e2e
```

## Project Structure

```
packages/
  pokemon-ui/                  # React + Vite frontend
  pokemon-user-backend/        # NestJS backend
    scripts/seed-pokemons.ts   # Database seed script
    seed-data/                 # YAML and SQL seed data
  pokemon-ui-e2e/              # Playwright frontend e2e tests
  pokemon-user-backend-e2e/    # Jest backend e2e tests
ecosystem.config.js            # pm2 process configuration
.env.local.example             # Environment variable template
```

## Design & Accessibility Decisions

### Accessibility

Accessibility was treated as a first-class concern throughout the UI, not an afterthought.

- **Skip link** — A visually hidden `<a href="#main-content">Skip to main content</a>` link appears on keyboard focus, allowing keyboard-only users to bypass the profile bar and jump directly to the Pokédex.
- **ARIA landmarks** — The Pokédex and team panel are wrapped in `<section aria-label="...">` elements. The main content area uses a semantic `<main id="main-content">` element.
- **ARIA live regions** — Search result counts (`aria-live="polite"`) and error toasts (`role="alert" aria-live="assertive"`) are announced to screen readers without interrupting focus.
- **Keyboard navigation in profile tabs** — The profile tab bar implements a full roving `tabIndex` pattern with `ArrowLeft`, `ArrowRight`, `Home`, and `End` support, matching the ARIA authoring practices for tab widgets.
- **Descriptive button labels** — Every action button includes full context via `aria-label`, e.g. `"Add Bulbasaur"` or `"Remove Charizard from team"`, rather than relying solely on visible icon text.
- **Form accessibility** — The new profile input uses `aria-label` and `aria-describedby` pointing to a hidden span that describes the 32-character limit constraint.
- **Focus visibility** — A global `:focus-visible` rule applies a 2px accent-colored outline to all interactive elements, ensuring keyboard focus is always clearly visible.
- **Reduced motion** — All keyframe animations are disabled under `@media (prefers-reduced-motion: reduce)`.

### Visual Design

The UI follows a **retro CRT / Pokédex aesthetic** built entirely with Emotion CSS-in-JS:

- **Dark theme** — A near-black palette (`#0d0f14` background, `#111318` surfaces) with a red accent (`#e83a3a`) drawn from the classic Pokédex color language.
- **CRT scanline effect** — Each Pokemon card uses `::before` and `::after` pseudo-elements to render horizontal scanlines and a moving scan-beam on hover, reinforcing the retro feel without impacting readability.
- **Noise texture overlay** — A low-opacity SVG noise texture is applied to the `<body>` via a global pseudo-element, adding subtle film grain.
- **Pixel-rendered sprites** — Team slot sprites use `image-rendering: pixelated` to preserve the crisp, chunky look of the original 64px sprites at larger display sizes.
- **Staggered entry animations** — Pokemon cards animate in with a `fadeSlideIn` effect, each delayed by `index * 30ms` (capped at 400ms), so the grid populates progressively rather than all at once.
- **Display typography** — `Rajdhani` is used for headers and labels (geometric, slightly condensed — fitting the game aesthetic), with `JetBrains Mono` for body text.

### Layout

- **Responsive card grid** — Pokemon cards use `flex: 0 0 max(220px, 7dvw)`, making them scale proportionally to viewport width while maintaining a minimum usable size.
- **Team panel** — Fixed at `min(330px, 100%)` width with a 3-column CSS grid for the 6 team slots, each enforcing a `1:1` aspect ratio.
- **Overflow architecture** — Flex children use `min-height: 0` / `min-width: 0` throughout to allow independent scrolling within the Pokédex and team panels without the page itself scrolling.

### Backend Architecture

- **UUID-first external API** — All endpoints accept and return `uid` (UUID) fields rather than internal numeric `id` values. Numeric IDs exist in the database for join performance but are never exposed to clients.
- **Slot auto-assignment** — When a Pokemon is added to a team, the service finds the lowest available slot (1–6) rather than requiring the client to manage positions. This keeps the API simple and prevents gaps.
- **Idempotent team additions** — Adding a Pokemon that is already on the team returns the existing record instead of throwing an error, making the client-side logic simpler.
- **Composite unique constraint** — The `profile_pokemon` join table has a database-level `UNIQUE(profile_id, pokemon_id)` index, so duplicate entries are impossible even under concurrent requests.
- **Cascade deletes** — Deleting a profile cascades to its `ProfilePokemon` associations at the ORM level, keeping referential integrity without requiring the client to clean up.
- **Eager Pokemon loading** — `ProfilePokemon.pokemon` is marked `eager: true` in TypeORM, so team queries always return full Pokemon data in a single query rather than requiring a second round-trip.

---

## What Improvements Would I Make

### Accessibility

- **Keyboard deselection** — Currently, removing a Pokemon from your team requires navigating to the team panel and clicking the remove button on that slot. I'd add a keyboard shortcut (e.g. `Backspace` or `Delete`) that removes the focused Pokemon from the active team directly from the Pokédex card, eliminating the need to switch focus areas.
- **Screen reader audit** — The ARIA structure was built intentionally, but I haven't validated it end-to-end with an actual screen reader (VoiceOver, NVDA, or JAWS). A full audit would surface announcement ordering issues, missing context on dynamic updates, and any focus traps that aren't obvious from code review alone.
- **Color blindness and optical clarity testing** — The current palette would benefit from testing with simulation tools (e.g. Stark, Colour Contrast Analyser) across the major deficiency types — deuteranopia, protanopia, tritanopia. Beyond checking contrast ratios, I'd verify that the red accent used to indicate "on team" status isn't the sole visual differentiator, since red/green distinctions fail for a significant portion of users.

### Alternative Color Palette

While the current theme meets WCAG AA contrast ratios, I'd like to offer an alternative color palette — likely a high-contrast or color-blind-safe variant — selectable via a toggle in the UI. The dark CRT aesthetic is intentional, but it shouldn't be the only option. A lighter, higher-contrast theme with type indicators that rely on shape or pattern in addition to color would make the app more broadly usable.

### Drag-and-Drop

I'd add drag-and-drop as a first-class interaction in two places: dragging a Pokemon card from the Pokédex list directly onto a team slot, and dragging between occupied slots to reorder the team. The current click-to-add / navigate-to-remove flow works but requires more steps than necessary — drag-and-drop would make team building feel immediate and intuitive. I'd also ensure the interaction has a proper keyboard fallback (pick up / move / drop via keyboard) so it doesn't exclude users who can't use a pointer.

### Frontend Architecture

- **CSS Modules over Emotion** — Emotion's CSS-in-JS approach adds runtime overhead and scatters style logic throughout component files. I'd migrate to CSS Modules (`.module.css`)—or vanilla css using postcss preprocessor for more complex stylesheets and custom functions—co-located with their components but as plain CSS. This removes the Emotion dependency, improves IDE support (native CSS autocomplete, linting), and makes the styling layer more approachable for developers who don't know the Emotion API.
- **Semantic HTML** — Several areas currently use styled `<div>` elements where a more descriptive element would be correct — for example, the profile bar should be a `<nav>`, the team slots could be a `<ol>` (ordered list of 6 positions), and stat/detail groups could use `<dl>` (description list). True semantic elements carry implicit ARIA roles and meaning without requiring extra attributes.
- **State management** — The current component state is local and transient — switching profiles or refreshing the page resets selections. I'd introduce a lightweight global store (Zustand or React Query) to hold the active profile, current team state, and Pokédex data. This would enable: persisting the selected profile across page loads, optimistic UI updates when adding/removing Pokemon, and a single source of truth that avoids prop drilling across the Pokédex and team panels.

### Performance

- **Localize Pokemon sprites** — All Pokemon sprites are currently loaded from GitHub's raw content CDN at runtime. This creates a hard dependency on an external service and adds latency on every page load. I'd bundle the sprites as static assets (or serve them from a self-hosted CDN/S3 bucket) to eliminate that dependency, improve load times, and ensure the app works offline or in restricted network environments.
- **Frontend pagination** — The backend API already supports `limit` and `skip` query parameters on the `/pokemon` endpoint, but the frontend loads all 150 Pokemon in a single request on startup. I'd wire up the existing API support to implement either traditional pagination (page controls) or infinite scroll, reducing the initial payload and improving perceived performance — especially on slower connections.

### Validation & Testing

- **Expanded validation** — Current constraints (one Pokemon per slot, max 6 per team) are enforced at both the API and database levels, which is the right approach. I'd extend this with richer frontend feedback: showing exactly why an action is blocked (e.g. a tooltip explaining the team is full or the Pokemon is already added) rather than just disabling the button.
- **Test coverage** — The project currently has minimal test coverage. I'd prioritize: unit tests for the `ProfilePokemonService` slot assignment and duplicate-prevention logic, integration tests for the team management endpoints against a real database (not mocks), and component tests for the interactive states of `PokemonCard` (available, on-team, team-full). E2E tests for the core user flow — select a profile, add 6 Pokemon, remove one — would round this out.

---

## Troubleshooting

**`pm2` command not found**

pm2 is a dev dependency. Run `pnpm pm2 start`, or add `./node_modules/.bin` to your `PATH`:
```bash
export PATH="./node_modules/.bin:$PATH"
```

**Database container fails to start**

- Confirm Docker Desktop or Colima is running.
- Verify the `TESTCONTAINERS_DOCKER_SOCKET` and `DOCKER_HOST` values in `.env.local` match your Docker socket path.
- On Colima, run `colima status` to confirm the VM is up.

**Colima disk locked: `failed to run attach disk "colima", in use by instance "colima"`**

This fatal error means a previous Colima session did not shut down cleanly, leaving stale processes holding the VM disk lock. Colima itself will report as not running, but orphaned `limactl usernet` and `colima daemon` processes remain in the background.

Kill the stale processes:
```bash
pkill -f "colima daemon"
pkill -f "limactl usernet"
```

Verify nothing relevant is still running:
```bash
ps aux | grep -Ei "colima|limactl|qemu|vz" | grep -Ev "grep|Code Helper"
```

Then start Colima again:
```bash
colima start
```

If the error persists, do a full reset:
```bash
colima delete --force
colima start
```

**Port already in use**

Stop any existing processes on ports `3000` or `4200`, then restart:
```bash
pm2 delete all && pm2 start
```
