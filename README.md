# Sports Leagues Explorer

A responsive Vue 3 application for browsing sports leagues and viewing their season badges. It was built as a frontend home assignment using [TheSportsDB](https://www.thesportsdb.com/) API.

## Features

- Browse the leagues returned by TheSportsDB.
- Search leagues by name and filter them by sport.
- Preserve filters in the URL so they survive page reloads and browser navigation.
- Open a dedicated league route using its ID and a readable slug.
- View and lazily load the available season badges for a selected league.
- Cache league and season responses in Pinia to avoid repeated API requests during the session.
- Display responsive skeleton states while league and badge data loads.
- Use local league logos when the list endpoint does not provide artwork.
- Animate forward and backward route navigation with reduced-motion support.

## Getting Started

### Requirements

- Node.js `^22.18.0` or `>=24.12.0`, as defined in `package.json`
- npm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Commands

```bash
npm run dev        # Start the development server
npm run build      # Type-check and create a production build
npm run preview    # Preview the production build
npm run type-check # Run the Vue TypeScript checker
npm run format     # Format source files with Prettier
```

## Technology

- Vue 3 and TypeScript
- Pinia for application state and in-memory caching
- Vue Router for filters, detail routes, and navigation transitions
- Vite for development and production builds
- SCSS for component and global styles

## Project Structure

```text
src/
├── components/  # Filters, league cards, lists, and loading states
├── router/      # Application routes
├── stores/      # API requests, filters, selection, and cache state
├── styles/      # Global styles and design tokens
├── types/       # TheSportsDB response types
└── views/       # Home and league detail views
```

## API Usage

The application uses the two endpoints provided by the assignment:

```text
GET https://www.thesportsdb.com/api/v1/json/3/all_leagues.php
GET https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=<league-id>
```

Search and sport filtering happen locally. The free v1 API does not provide a league-name search endpoint, and its league filtering endpoint returns a limited subset. Filtering the already-loaded list keeps interactions immediate and avoids unnecessary requests against the free API rate limit.

The current `all_leagues.php` response does not include `strLeagueAlternate` or league artwork. The UI supports `strLeagueAlternate` when present, while a local name-to-logo map supplies artwork for the leagues returned by the assignment endpoint.

## Design Decisions

### Pinia as an in-memory cache

The league store records whether the league request completed successfully. The season store keeps a dictionary keyed by league ID. Revisiting a league reads its seasons from Pinia instead of calling the API again. Successful empty responses are also cached, while failed requests remain retryable.

The cache intentionally lasts only for the current application session. Persistence and expiration would add complexity that is unnecessary for the assignment's small, infrequently changing dataset.

### URL-backed filters

The search query and selected sport are synchronized with Vue Router query parameters. This makes filtered views reloadable and compatible with browser back and forward navigation while keeping the filtering logic in one store.

### League detail route

League cards navigate to `/league/:id/:slug`. Navigation state carries the selected object for an immediate transition, while the league ID provides a fallback when the detail URL is loaded directly.

### Loading feedback

League and season lists use skeleton cards rather than a global spinner, keeping the final layout stable while requests are in progress. A short artificial delay is intentionally retained so these states remain visible during review and demonstration.

### Local artwork

The assignment's league-list endpoint does not return logos. A small local mapping provides consistent artwork without adding one lookup request per league. Season images still come from TheSportsDB and use native lazy loading.

## AI-Assisted Development

OpenAI Codex was used as a pair-programming and review assistant throughout the assignment. It helped with:

- Component structure and boilerplate.
- Animated the league detail route with directional route transitions.
- Local league-logo mapping.
- Skeleton loading states.
- Reviewing TypeScript types against live API responses.
- Research into TheSportsDB documentation and free-tier behavior.
- Some CSS styling and responsive layout code.
- Drafting this README from the implemented behavior and recorded decisions.

I remained responsible for the core technical decisions, including Pinia state management, API integration, caching, and filtering. AI helped with repetitive work, supported refactoring, and helped maintain consistency across the application.

## Trade-offs

- **Local filtering:** The free endpoint currently returns a small list, so debouncing, server-side search, pagination, and virtual scrolling would add complexity without a practical benefit.
- **Session-only cache:** Data is fetched again after a full page reload. This keeps invalidation rules simple and avoids stale persisted data.
- **Artificial loading delay:** The delay makes skeleton states easy to evaluate but would normally be removed or restricted to development before a production release.
- **Local league logos:** This avoids multiple enrichment requests but requires maintaining the mapping when the API changes its league selection.
- **No automated tests:** The implementation was kept focused on the requested behavior and manually verified within the assignment scope.

## What Could Be Better

- Add user-facing error, empty-result, and league-not-found states.
- Debounce search input for larger datasets.
- Request smaller TheSportsDB image variants where appropriate.
- Add infinite scrolling if the league list grows significantly.
- Introduce cache expiration to prevent stale data.
- Expand accessibility and responsive-device testing.
