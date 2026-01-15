# Copilot Instructions for Spotify Custom Recommendations (Spotimagic)

## Project Overview
This represents a full-stack application ("Spotimagic") consisting of a React frontend and a Node.js/Express backend. The application integrates with the Spotify API to provide custom recommendations, statistics, and playlist management.

## Architecture

### Monorepo Structure
- **Root**: Contains server configuration, Docker setup, and global scripts.
- **Client** (`/client`): React application (Create React App).
- **Server** (`/server`): Node.js Express application logic.

### Backend (Server)
- **Framework**: Express.js.
- **Database**: Sequelize ORM supporting SQLite (Test/Dev) and Postgres (Production).
  - Models located in `server/database`.
  - Relation definitions in `server/database/index.js`.
- **Authentication**: Session-based using `express-session` backed by Sequelize, plus manual cookie handling for specific flows.
- **Spotify Integration**: Custom wrappers in `server/users`, `server/spotifyapi`.
- **Background Tasks**: 
  - Essential logic for data syncing resides in `server/tasks/`.
  - Triggered via the `/tasks` endpoint (defined in `server/index.js`), which executes logic in `server/pages/automaticTasks.js`.
  - **Pattern**: The `/tasks` endpoint checks *all* users, refreshes tokens if needed, and runs hourly/daily maintenance.

### Frontend (Client)
- **Framework**: React 18 with Material UI (@mui).
- **API Communication**: 
  - Centralized request handling in `client/src/API/Request.js`.
  - `GetRequest` handles 401 errors by triggering a page reload (auth re-flow).
- **State Management**: React Context API (`client/src/context`).

## Development Workflows

### Running the Project
- **Production**: `node server/index.js` serves the API *and* the static React build (`client/build`).
- **Tests**: 
  - Server: `npm test` (uses Jest).
  - Client: `cd client && npm test`.

### Key Conventions
- **API Routes**: Located in `server/routes`. The main entry is `server/routes/api.js`.
- **Caching**: 
  - Custom in-memory caching in `server/routes/api.js` for playlists and user data.
  - Redis is NOT used; beware of memory implications when scaling.
- **Environment**:
  - `process.env.DATABASE_URL` controls DB connection.
  - `process.env.PRODUCTION === "test"` switches to SQLite.

## Critical Files
- `server/pages/automaticTasks.js`: Orchestrator for data syncing. Modify this when changing how frequency of updates works.
- `server/database/index.js`: Single source of truth for Model initialization and Associations.
- `client/src/API/Request.js`: Wrapper for `fetch`. Use this for all client-side network calls.
