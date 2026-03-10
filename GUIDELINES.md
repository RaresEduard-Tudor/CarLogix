# CarLogix Development Guidelines

## Code Organization

### Backend (Spring Boot)

```
backend/src/main/java/com/carlogix/
├── config/          # Spring configuration beans (Security, CORS)
├── controller/      # REST endpoints — thin, delegates to services
├── dto/             # Request/response objects — never expose entities directly
├── exception/       # Custom exceptions + GlobalExceptionHandler
├── model/           # JPA entities — database table mappings
├── repository/      # Spring Data JPA interfaces
├── security/        # JWT provider, authentication filter
└── service/         # Business logic — all domain rules live here
```

**Rules:**
- Controllers validate input via `@Valid` and delegate to services. No business logic in controllers.
- Services own all business logic. One service per domain aggregate (Auth, Vehicle, Diagnostic).
- DTOs are used for all API input/output. JPA entities never appear in controller method signatures.
- Repositories contain only Spring Data JPA query methods. No `@Query` unless necessary.
- Exceptions are thrown from services and caught by `GlobalExceptionHandler`.

### Frontend (React)

```
src/
├── components/      # Reusable UI components
├── pages/           # Route-level page components
├── hooks/           # Custom hooks (useCarLogixApi is the primary data hook)
├── services/        # API client (apiService.js)
├── contexts/        # React Context providers (Settings, Theme)
├── config/          # Configuration files
├── data/            # Static data files
└── utils/           # Utility functions
```

**Rules:**
- All API calls go through `apiService.js`. Pages and hooks never call `fetch` directly.
- `useCarLogixApi` is the single hook for all backend data. Pages consume it, not raw API calls.
- Pages are routed components that compose UI from components and consume hooks.
- Contexts are for cross-cutting concerns only (theme, settings). Not for domain data.

## API Design

### Conventions

- Base path: `/api`
- Auth endpoints: `/api/auth/*` (public)
- Resource endpoints: `/api/{resource}` (authenticated)
- Use plural nouns: `/api/vehicles`, `/api/diagnostics`
- Use HTTP methods correctly: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)
- Return proper status codes: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict)

### Authentication

- JWT tokens in `Authorization: Bearer <token>` header
- Tokens expire after 24 hours
- Passwords hashed with BCrypt
- All endpoints except `/api/auth/**` and `/api/health` require authentication
- User context available via `@AuthenticationPrincipal User user` in controllers

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "status": 404,
  "timestamp": "2026-03-10T10:00:00Z"
}
```

### Validation

- Use Bean Validation annotations on DTOs (`@NotBlank`, `@Email`, `@Pattern`, etc.)
- OBD-II codes must match pattern: `^[PBCU][0-9A-F]{4}$`
- Validation errors return 400 with field-level messages

## Database

### PostgreSQL

- Schema managed via SQL migration files in `backend/src/main/resources/db/migration/`
- File naming: `V{number}__{description}.sql` (double underscore)
- Never modify existing migration files. Create new ones for schema changes.
- Use `BIGSERIAL` for primary keys
- Use `ON DELETE CASCADE` for foreign keys where parent deletion should remove children
- Add indexes for frequently queried foreign keys and filter columns
- Hibernate set to `validate` mode — it checks schema but never modifies it

### SQLite (OBD-II codes)

- Read-only database at `obd2_codes.db`
- Rebuild with: `python build_obd2_db.py`
- Table `dtc_codes`: `code`, `description`, `suggested_fix`, `category`, `severity`
- Queried by `Obd2LookupService` when creating diagnostic logs
- Same database is used by the MCP server (`server.py`)

## Security

### Must Do
- Never commit `.env` files
- Never log passwords, tokens, or secrets
- Always validate user ownership before returning/modifying resources (multi-tenant isolation)
- Use parameterized queries (JPA handles this — never concatenate SQL strings)
- Validate all user input at the API boundary
- Use HTTPS in production

### JWT Secret
- Must be at least 256 bits (32 bytes) for HS512
- Set via `JWT_SECRET` environment variable
- Generate with: `python -c "import secrets; print(secrets.token_urlsafe(48))"`

### CORS
- Configured via `CORS_ORIGINS` environment variable
- Only allow specific origins, never `*` in production

## Docker

### Services (docker-compose.yml)

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `postgres` | carlogix-db | 5432 | PostgreSQL 16 database |
| `carlogix-api` | carlogix-api | 8080 | Spring Boot backend |
| `carlogix-web` | carlogix-web | 3000 | Nginx + built React app |
| `carlogix-dev` | carlogix-dev | 5173 | Vite dev server (dev profile only) |

### Build

- Backend: multi-stage Docker build (JDK for build, JRE for runtime)
- Frontend: multi-stage Docker build (Node for build, Nginx for serving)
- `backend/obd2_codes.db` is copied into the backend image at build time (`COPY obd2_codes.db /data/obd2_codes.db`). This allows deployment to platforms without persistent disk (e.g. Render free tier). To update DTC codes: rebuild the DB, copy to `backend/`, commit, and redeploy.

## MCP Server

### Adding New Tools

Add new tools in `server.py` using the `@mcp.tool()` decorator:

```python
@mcp.tool()
def my_new_tool(param: str) -> str:
    """Tool description shown to the AI.

    Args:
        param: Parameter description.

    Returns:
        What the tool returns.
    """
    # Implementation
    return "result"
```

### Adding New DTC Codes

Add entries to the `DTC_CODES` list in `build_obd2_db.py` and re-run:

```bash
python build_obd2_db.py
```

Format: `("CODE", "Description", "Suggested fix text")`

## Data Storage Conventions

### Units
- **Mileage is always stored in miles** in the database (both `vehicles.current_mileage` and `maintenance_records.mileage`).
- The frontend normalizes user input to miles before saving: if `distanceUnit` is `kilometers`, divide by `1.60934` before the API call.
- `formatDistance()` in `SettingsContext` converts miles → km for display when the user's setting is `kilometers`.

### Currency
- **Costs are always stored in USD** in the database.
- The frontend normalizes user input to USD before saving: divide by the selected currency's exchange rate before the API call.
- `formatCurrency()` in `SettingsContext` converts USD → local currency for display.
- Exchange rates are hardcoded mock values — not live rates.

## Git Workflow

### Branch Naming
- `feature/short-description` — new features
- `fix/short-description` — bug fixes
- `refactor/short-description` — code restructuring

### Commit Messages
- Use imperative mood: "Add vehicle endpoint" not "Added vehicle endpoint"
- Keep first line under 72 characters
- Reference issue numbers when applicable

### What Not to Commit
- `.env` files (use `.env.example` as template)
- `backend/target/` (Maven build output)
- `.venv/` (Python virtual environment)
- `/obd2_codes.db` (root-level generated file — rebuild with `build_obd2_db.py`; note `backend/obd2_codes.db` **is** committed as it's bundled into the Docker image)
- `node_modules/`
- IDE-specific files (`.idea/`, `.vscode/` except `mcp.json` and `extensions.json`)

## Testing

### Backend
```bash
cd backend
mvn test                    # Run all tests
mvn test -pl :carlogix-backend -Dtest=AuthServiceTest   # Single test class
```

### Frontend
```bash
yarn lint                   # ESLint checks
```

## CI/CD

### Continuous Integration (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`:

1. **Backend tests** — `mvn test` with an ephemeral PostgreSQL service container
2. **Frontend lint** — `yarn install && yarn lint`
3. **Docker build** — Verifies `docker compose build` succeeds

### Android APK Releases (`.github/workflows/android-release.yml`)

Triggered when a version tag (`v*`) is pushed:

1. Checks out the repository
2. Sets up JDK 17 and Node.js 20
3. Installs JS dependencies in `OBDScanner/`
4. Builds an Android release APK via Gradle
5. Creates a GitHub Release with the APK attached

**Publishing a release:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

The APK will appear at [GitHub Releases](https://github.com/RaresEduard-Tudor/CarLogix/releases).

### Manual API Testing
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test1234!","displayName":"Test"}'

# Login (save token)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test1234!"}' | python -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Use token
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/vehicles
```
