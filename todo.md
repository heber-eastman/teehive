# Teehive Development Checklist

A comprehensive checklist for implementing Teehive v1, organized by phase, chunk, and individual tasks. Mark each task as completed when done.

---

## Phase 1: Project Foundation

### Chunk 1.1: Monorepo Initialization

- [x]  Create a new GitHub repository and clone it locally.
- [x]  Create directories: `backend/`, `mobile/`, `shared/`, `scripts/`, `.github/`, `docs/`.
- [x]  Run `npm init -y` at root and add workspaces:
    
    ```json
    "workspaces": ["backend", "mobile", "shared"]
    
    ```
    
- [x]  Create empty `package.json` in `backend/` and `mobile/`.
- [x]  Commit the initial project structure.

### Chunk 1.2: Workspace & Dependency Setup

- [x]  Verify `workspaces` config in root `package.json`.
- [x]  Add or initialize `shared/` package for common TypeScript types (if needed).
- [x]  Install in `backend/`: `typescript`, `prisma`, `@prisma/client`, `express`, `ts-node-dev`, `@types/express`.
- [x]  Install in `mobile/`: `expo`, `react-native-paper`, `dotenv`, `expo-constants`.
- [x]  Run `npm install` at root and confirm all workspaces install correctly.

### Chunk 1.3: CI/CD Workflow Scaffold

- [x]  Create `.github/workflows/backend.yml` placeholder with job: checkout + install.
- [x]  Create `.github/workflows/mobile.yml` placeholder.
- [x]  Push to `main` and verify Actions trigger workflows.
- [x]  Commit CI/CD skeleton.

---

## Phase 2: Backend Core

### Chunk 2.1: Prisma Schema & Migrations

- [x]  In `backend/`, install `prisma` & `@prisma/client`.
- [x]  Add `prisma/schema.prisma` with models `TeeTime`, `UploadLog`.
- [x]  Create `.env.development` with `DATABASE_URL`.
- [x]  Run `npx prisma migrate dev --name init`.
- [x]  Verify tables exist in PostgreSQL.
- [x]  Commit Prisma schema and migration files.

### Chunk 2.2: Express Server Entrypoint

- [x]  Install `typescript`, `ts-node-dev`, `express`, `@types/express` in `backend/`.
- [x]  Create `backend/src/index.ts`:
    - Initialize Express app.
    - Import and connect Prisma client.
- [x]  Add scripts in `backend/package.json`:
    
    ```json
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc"
    
    ```
    
- [x]  Commit entrypoint code.

### Chunk 2.3: Database Connection & Health Endpoint

- [x]  In `src/index.ts`, define `GET /health` returning `200 { status: 'ok' }`.
- [x]  Install `supertest`, `@types/supertest`.
- [x]  Write Jest test `backend/tests/health.test.ts` using `supertest`.
- [x]  Ensure test passes.
- [x]  Commit health endpoint and tests.

---

## Phase 3: Admin Dashboard

### Chunk 3.1: Google OAuth Integration

- [x]  Install `passport`, `passport-google-oauth20`, `express-session`, `@types/passport-google-oauth20`.
- [x]  Configure `express-session` (TTL=7 days, HttpOnly, Secure, SameSite=Lax).
- [x]  In `src/auth.ts`, set up Passport Google strategy with callback `/auth/google/callback`.
- [x]  In `src/index.ts`, mount session and auth routes.
- [x]  Write E2E test `backend/tests/auth.test.ts` mocking OAuth callback.
- [x]  Commit OAuth integration code.
- [x]  **Fix and improve backend test setup and mocks for authentication and Prisma; all backend tests passing (May 2024).**

### Chunk 3.2: Environment Variables & Configuration

- [x]  Install `dotenv` and configure environment variables loading
- [x]  Create `.env` file with required variables:
    - DATABASE_URL
    - SESSION_SECRET
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - PORT
- [x]  Create `.env.development` for test environment
- [x]  Fix environment variables loading in `index.ts`
- [x]  Configure Google OAuth credentials
- [x]  Set up database connection
- [x]  Write and pass tests for environment configuration
- [x]  Commit all configuration changes

### Chunk 3.3: CSV Parsing & Validation Pipeline

- [x]  Install `csv-parse`.
- [x]  Create `src/utils/csvParser.ts` with streaming parser:
    - Validate columns: `name`, `age`, `email`, `isActive`
    - Track valid rows and skipped count
    - Handle type validation and custom validation rules
- [x]  Write unit tests `backend/tests/csv-parse.test.ts` for valid & invalid CSV
- [x]  Add test endpoint `/api/test/csv-upload` for CSV file uploads
- [x]  Create test page `public/test-csv.html` for browser testing
- [x]  Add sample CSV data for testing
- [x]  Commit parser, tests, and test utilities

### Chunk 3.4: Replace-All Transaction & UploadLog

- [x]  Create `src/services/uploadService.ts`:
    - Begin Prisma transaction.
    - Delete all `tee_times`.
    - Bulk insert valid rows.
    - Create `UploadLog` record (with uploadedBy, totalRecords, validRecords, skippedRecords).
- [x]  Write integration test `backend/tests/upload-transaction.test.ts`.
- [x]  Commit service, migration, and tests.

---

## Phase 4: Public API & Key

### Chunk 4.1: `/v1/public/api-key` Endpoint

- [x]  In `src/routes/public.ts`, add `GET /v1/public/api-key` returning `{ apiKey }`.
- [x]  Write Jest test `backend/tests/apiKey.test.ts`.
- [x]  Commit public key endpoint.

### Chunk 4.2: Static API-Key Storage & Rotation Logic

- [x]  Extend `schema.prisma` with `ApiKey` model; run migration.
- [x]  Create `scripts/rotateApiKey.ts` for random 32-char key generation & upsert.
- [x]  Write test `backend/tests/rotateApiKey.test.ts`.
- [x]  Commit rotation script and tests.

### Chunk 4.3: API-Key Middleware

- [x]  Implement `src/middleware/apiKeyAuth.ts` to validate `Authorization` header.
- [x]  Apply middleware to `/v1/tee-times`.
- [x]  Write unit tests `backend/tests/authMiddleware.test.ts`.
- [x]  Commit middleware and tests.

---

## Phase 5: Mobile App Core

### Chunk 5.1: Expo Scaffold with RN Paper

- [x]  Run `expo init mobile --template blank --npm`.
- [x]  Install `react-native-paper` & peer deps.
- [x]  Update `App.tsx` to render a Paper Button.
- [x]  Write Jest test `mobile/__tests__/App.test.tsx`.
- [x]  Commit scaffold and test.

### Chunk 5.2: Environment Config via `.env`

- [x]  Install `dotenv` & `expo-constants`.
- [x]  Create `mobile/config.ts` loading `API_BASE_URL`, `BOOTSTRAP_PATH`.
- [x]  Write test `mobile/__tests__/config.test.ts`.
- [x]  Commit config utility and tests.

### Chunk 5.3: Tee Times List Screen (Mock Data)

- [x]  Create `mobile/screens/TeeTimesList.tsx` with React Native Paper `FlatList`.
- [x]  Format date/time as "Mon, Jun 1 • 2:30 PM".
- [x]  Style course name bold, price right-aligned, subtitle spots/holes.
- [x]  Write snapshot test `mobile/__tests__/TeeTimesList.test.tsx`.
- [x]  Commit component and test.

---

## Phase 6: Integration & Wiring

### Chunk 6.1: Fetch Bootstrap Key & Cache Logic

- [x]  Install `@react-native-async-storage/async-storage`.
- [x]  Create `mobile/hooks/useApiKey.ts` to fetch and cache key, retry on 401.
- [x]  Write test `mobile/__tests__/useApiKey.test.ts`.
- [x]  Commit hook and tests.

### Chunk 6.2: Fetch & Display Tee Times (Completed: 2024-03-20)

- [x]  Implement `mobile/hooks/useTeeTimes.ts` using `useApiKey()`.
- [x]  Create `mobile/components/TeeTimesContainer.tsx` for fetching and rendering.
- [x]  Write test `mobile/__tests__/useTeeTimes.test.ts`.
- [x]  Commit hook, container, and test.

### Chunk 6.3: Error & Empty States

- [x]  Update `TeeTimesContainer` to show error message on fetch failure.
- [x]  Display "No tee times available right now." for empty lists.
- [x]  Write tests for both states.
- [x]  Commit updates and tests.

---

## Phase 7: Testing & Quality

### Chunk 7.1: Code Quality & Standards

- [x] Install ESLint and Prettier in the monorepo
- [x] Configure ESLint for TypeScript and React Native
- [x] Set up Prettier for consistent code formatting
- [x] Add lint and format scripts to package.json
- [ ] Add pre-commit hooks for linting and formatting
- [ ] Configure VS Code settings for consistent development experience

### Chunk 7.2: Mobile Jest Tests

- [x] Configure Jest for React Native using jest-expo
- [x] Write smoke test for App component
- [x] Create snapshot test for TeeTimesList component
- [x] Test configuration hook with proper mocks
- [x] Update CI workflow to run mobile tests
- [ ] Add more component tests for error states
- [ ] Add integration tests for API interactions

### Chunk 7.3: Backend Test Improvements

- [x] Fix Prisma client mocking in tests
- [x] Improve authentication middleware tests
- [x] Update test setup for better isolation
- [ ] Add more integration tests for API endpoints
- [ ] Add performance tests for CSV upload
- [ ] Improve test coverage reporting

### Chunk 7.4: Documentation

- [ ] Create API documentation using OpenAPI/Swagger
- [ ] Add setup instructions in README.md
- [ ] Document environment variables
- [ ] Add contribution guidelines
- [ ] Create architecture diagrams
- [ ] Document testing strategy

### Chunk 7.5: Security & Performance

- [ ] Implement rate limiting for API endpoints
- [ ] Add request validation middleware
- [ ] Set up security headers
- [ ] Implement caching strategy
- [ ] Add performance monitoring
- [ ] Set up error tracking

### Chunk 7.6: Deployment & DevOps

- [ ] Set up production environment
- [ ] Configure database backups
- [ ] Set up monitoring and alerting
- [ ] Create deployment documentation
- [ ] Configure staging environment
- [ ] Set up automated database migrations

---

## Phase 8: CI/CD & Delivery

### Chunk 8.1: Backend GitHub Action

- [ ]  In `.github/workflows/backend.yml`:
    - Set trigger on `push` to `main`, runner `ubuntu-latest`.
    - Steps: checkout, install, test, build Docker, deploy (Railway), `prisma migrate deploy`.
- [ ]  Commit workflow file.

### Chunk 8.2: Mobile GitHub Action

- [ ]  In `.github/workflows/mobile.yml`:
    - Trigger on `push` to `main`, runner `macos-latest`.
    - Steps: checkout, install, test, Fastlane match, Fastlane build, upload IPA/APK artifacts.
- [ ]  Commit workflow file.

### Chunk 8.3: Fastlane Match Integration

- [ ]  Add `Fastfile` under `.github/fastlane` with lanes for iOS & Android signing via `match`.
- [ ]  Reference GitHub Actions secrets `MATCH_GIT_TOKEN`, `FASTLANE_MATCH_PASSWORD`.
- [ ]  Write minimal script/test to confirm `fastlane match` success.
- [ ]  Commit Fastlane configuration and test.

---

**Completion of all items** will deliver a fully functional Teehive v1 prototype.
