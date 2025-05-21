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

- [ ]  Run `expo init mobile --template blank --npm`.
- [ ]  Install `react-native-paper` & peer deps.
- [ ]  Update `App.tsx` to render a Paper Button.
- [ ]  Write Jest test `mobile/__tests__/App.test.tsx`.
- [ ]  Commit scaffold and test.

### Chunk 5.2: Environment Config via `.env`

- [ ]  Install `dotenv` & `expo-constants`.
- [ ]  Create `mobile/config.ts` loading `API_BASE_URL`, `BOOTSTRAP_PATH`.
- [ ]  Write test `mobile/__tests__/config.test.ts`.
- [ ]  Commit config utility and tests.

### Chunk 5.3: Tee Times List Screen (Mock Data)

- [ ]  Create `mobile/screens/TeeTimesList.tsx` with React Native Paper `FlatList`.
- [ ]  Format date/time as "Mon, Jun 1 • 2:30 PM".
- [ ]  Style course name bold, price right-aligned, subtitle spots/holes.
- [ ]  Write snapshot test `mobile/__tests__/TeeTimesList.test.tsx`.
- [ ]  Commit component and test.

---

## Phase 6: Integration & Wiring

### Chunk 6.1: Fetch Bootstrap Key & Cache Logic

- [ ]  Install `@react-native-async-storage/async-storage`.
- [ ]  Create `mobile/hooks/useApiKey.ts` to fetch and cache key, retry on 401.
- [ ]  Write test `mobile/__tests__/useApiKey.test.ts`.
- [ ]  Commit hook and tests.

### Chunk 6.2: Fetch & Display Tee Times

- [ ]  Implement `mobile/hooks/useTeeTimes.ts` using `useApiKey()`.
- [ ]  Create `mobile/components/TeeTimesContainer.tsx` for fetching and rendering.
- [ ]  Write test `mobile/__tests__/useTeeTimes.test.ts`.
- [ ]  Commit hook, container, and test.

### Chunk 6.3: Error & Empty States

- [ ]  Update `TeeTimesContainer` to show error message on fetch failure.
- [ ]  Display "No tee times available right now." for empty lists.
- [ ]  Write tests for both states.
- [ ]  Commit updates and tests.

---

## Phase 7: Testing & Quality

### Chunk 7.1: Backend Jest Tests

- [ ]  Add `backend/jest.config.js` for TypeScript.
- [ ]  Add tests for CSV parser, auth middleware, health endpoint.
- [ ]  Set coverage threshold to 80%.
- [ ]  Commit Jest config and tests.

### Chunk 7.2: Mobile Jest Tests

- [ ]  Add `mobile/jest.config.js` with React Native preset.
- [ ]  Write tests: App smoke, TeeTimesList, config hook.
- [ ]  Ensure mobile tests run on CI.
- [ ]  Commit Jest config and tests.

### Chunk 7.3: ESLint & Prettier + Pre-commit Hooks

- [ ]  Install `eslint`, `prettier`, `eslint-config-prettier`, `eslint-config-recommended`.
- [ ]  Create `.eslintrc.js` and `.prettierrc`.
- [ ]  Install `husky` and `lint-staged`.
- [ ]  Configure `.husky/pre-commit` for lint-staged running `eslint --fix` and `prettier --write`.
- [ ]  Commit linting/formatting setup.

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
