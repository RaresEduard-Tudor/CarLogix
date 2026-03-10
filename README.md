# CarLogix

**CarLogix** is a full-stack car maintenance and diagnostics platform with a Spring Boot REST API, React web dashboard, OBD-II MCP server, and a React Native mobile scanner app.

## Live Deployments

| Service | URL |
|---------|-----|
| Web App | https://carlogix-app.vercel.app |
| Backend API | https://carlogix-w2y7.onrender.com |
| Android APK | [GitHub Releases](https://github.com/RaresEduard-Tudor/CarLogix/releases) |

## Architecture

```
┌─────────────────┐       ┌──────────────────────┐      ┌──────────────┐
│  React Frontend │──────▶│  Spring Boot API      │─────▶│  PostgreSQL  │
│  (Vite / MUI)   │       │  (JWT Auth, REST)     │      │  (4 tables)  │
└─────────────────┘       └──────────┬────────────┘      └──────────────┘
                                     │
                                ┌────▼────────┐
                                │  SQLite DB  │
                                │  (OBD-II    │
                                │   DTC codes)│
                                └─────────────┘

┌─────────────────┐       ┌──────────────────────┐
│  MCP Server     │──────▶│  Same SQLite DB      │
│  (Python/stdio) │       │  (128 DTC codes)     │
└─────────────────┘       └──────────────────────┘

┌─────────────────┐
│  OBDScanner App │  React Native + Bluetooth (Android)
│  (Mobile)       │  Connects to ELM327 adapters
└─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Material-UI 7, React Router 7 |
| Backend | Spring Boot 3.4, Java 21, Hibernate, Spring Security |
| Database | PostgreSQL 16 (users, vehicles, diagnostic_logs, maintenance_records) |
| OBD-II Lookup | SQLite (128 DTC codes), auto-populates diagnostics |
| Auth | JWT (HS512, 24h expiry, BCrypt passwords) |
| MCP Server | Python 3.13, MCP SDK 1.26, 5 tools |
| Mobile | React Native 0.81, Expo SDK 54, Bluetooth Classic |
| CI/CD | GitHub Actions (backend tests, frontend lint, Docker build, Android APK releases) |
| Infrastructure | Docker Compose, Nginx |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ and Yarn
- Java 21 (for local backend dev)
- Python 3.10+ (for MCP server)

### Run with Docker (recommended)

```bash
git clone https://github.com/RaresEduard-Tudor/CarLogix.git
cd CarLogix

# Create .env (see .env.example)
cp .env.example .env

# Build and start all services
docker compose up -d

# Services:
#   PostgreSQL  → localhost:5432
#   Spring Boot → localhost:8080
#   React (prod)→ localhost:3000
```

### Run in dev mode

```bash
# Start backend services
docker compose up postgres carlogix-api -d

# Start frontend with hot reload
yarn install
yarn dev
# Open http://localhost:5173
```

### Dev with Docker (full stack hot reload)

```bash
docker compose --profile dev up -d
# React dev server → localhost:5173
# API              → localhost:8080
```

## API Endpoints

All endpoints except auth require `Authorization: Bearer <token>` header.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account (email, password, displayName) |
| POST | `/api/auth/login` | Login, returns JWT token |

### Vehicles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/vehicles` | List user's vehicles |
| POST | `/api/vehicles` | Add vehicle |
| PUT | `/api/vehicles/{id}` | Update vehicle |
| DELETE | `/api/vehicles/{id}` | Soft-delete vehicle |

### Maintenance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/maintenance` | List all user's maintenance records |
| GET | `/api/maintenance/vehicle/{id}` | Records for a specific vehicle |
| POST | `/api/maintenance` | Create maintenance record |
| PUT | `/api/maintenance/{id}` | Update maintenance record |
| DELETE | `/api/maintenance/{id}` | Delete maintenance record |

### Diagnostics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/diagnostics` | List all user's diagnostic logs |
| GET | `/api/diagnostics/vehicle/{id}` | Diagnostics for a specific vehicle |
| POST | `/api/diagnostics` | Create diagnostic (auto-populates OBD-II definition) |
| PATCH | `/api/diagnostics/{id}/resolve` | Mark diagnostic as resolved |

### User Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile (displayName) |
| PUT | `/api/users/me/password` | Change password |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{"status": "UP"}` |

## OBD-II MCP Server

The MCP server provides AI-accessible tools for looking up Diagnostic Trouble Codes.

### Configuration

Add to your VS Code MCP settings (`.vscode/mcp.json`):

```json
{
  "servers": {
    "obd2-mechanic": {
      "type": "stdio",
      "command": "${workspaceFolder}/.venv/bin/python",
      "args": ["${workspaceFolder}/server.py"]
    }
  }
}
```

### Setup

```bash
python -m venv .venv
.venv/bin/pip install mcp
python build_obd2_db.py    # Build/rebuild the SQLite database
```

### Available Tools

| Tool | Description |
|------|-------------|
| `lookup_dtc` | Look up a single DTC code (e.g. P0420) |
| `search_dtc` | Search codes by keyword (e.g. "catalytic") |
| `diagnose_multiple` | Look up multiple codes at once |
| `list_codes_by_category` | List all codes in Powertrain/Body/Chassis/Network |
| `get_severity_summary` | Summary of codes by severity level |

## Database Schema

```sql
users
  ├── id (BIGSERIAL PK)
  ├── email (UNIQUE, NOT NULL)
  ├── password (BCrypt hash)
  ├── display_name
  ├── role (USER | ADMIN)
  ├── created_at
  └── last_login_at

vehicles
  ├── id (BIGSERIAL PK)
  ├── user_id (FK → users, CASCADE)
  ├── vin, make, model, year, color
  ├── current_mileage, license_plate
  ├── active (soft delete flag)
  ├── created_at
  └── updated_at

maintenance_records
  ├── id (BIGSERIAL PK)
  ├── vehicle_id (FK → vehicles, CASCADE)
  ├── service_type, description
  ├── mileage, service_date, cost
  ├── location, notes
  ├── reminder_mileage_interval
  ├── reminder_time_interval, reminder_time_unit
  ├── created_at
  └── updated_at

diagnostic_logs
  ├── id (BIGSERIAL PK)
  ├── vehicle_id (FK → vehicles, CASCADE)
  ├── error_code (e.g. P0420)
  ├── definition (auto-populated from SQLite)
  ├── suggested_fix (auto-populated from SQLite)
  ├── status (ACTIVE | RESOLVED)
  ├── mileage
  ├── created_at
  └── resolved_at
```

## Project Structure

```
CarLogix/
├── backend/                      # Spring Boot backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/carlogix/
│       ├── CarLogixApplication.java
│       ├── config/               # SecurityConfig, CorsConfig
│       ├── controller/           # Auth, Vehicle, Diagnostic, Maintenance, User, Health
│       ├── dto/                  # Request/Response objects
│       ├── exception/            # Global error handling
│       ├── model/                # JPA entities
│       ├── repository/           # Spring Data JPA
│       ├── security/             # JWT provider, auth filter
│       └── service/              # Business logic, OBD2 lookup
├── src/                          # React frontend
│   ├── App.jsx
│   ├── components/               # DashboardLayout
│   ├── pages/                    # Dashboard, Cars, Maintenance, ErrorCodes, Profile, Settings
│   ├── hooks/                    # useCarLogixApi (REST client hook)
│   ├── services/                 # apiService (HTTP client)
│   └── contexts/                 # Settings, Theme
├── OBDScanner/                   # React Native mobile app
│   ├── src/screens/              # Login, CarSelection, OBDScanner
│   ├── src/obd/                  # Bluetooth & OBD protocol
│   └── android/                  # Native Android project
├── server.py                     # OBD-II MCP server
├── build_obd2_db.py              # SQLite database builder
├── obd2_codes.db                 # 128 DTC codes
├── docker-compose.yml            # Full stack Docker Compose
├── Dockerfile                    # Frontend production image
├── nginx.conf                    # SPA routing + API proxy
├── .github/workflows/
│   ├── ci.yml                    # CI pipeline (tests, lint, Docker build)
│   └── android-release.yml       # Android APK build on tag push
└── .env.example                  # Environment variable template
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `carlogix` |
| `DB_USERNAME` | Database user | `carlogix` |
| `DB_PASSWORD` | Database password | `carlogix` |
| `JWT_SECRET` | JWT signing secret (min 256-bit) | — |
| `OBD2_DB_PATH` | Path to SQLite OBD-II database | `./obd2_codes.db` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173,http://localhost:3000` |
| `VITE_API_BASE_URL` | Backend URL for frontend | `http://localhost:8080` |

## Mobile App (OBDScanner)

The mobile app connects to real ELM327 Bluetooth OBD-II adapters on Android.

### Setup

```bash
cd OBDScanner
yarn install
yarn expo prebuild --clean
yarn expo run:android
```

### Usage

1. Plug ELM327 adapter into car's OBD-II port
2. Turn on car ignition
3. Open app, log in with your CarLogix account (same credentials as the web app)
4. Select your vehicle
5. Connect to Bluetooth adapter (default PIN: 1234)
6. Scan for error codes

The app connects to the production backend (`https://carlogix-w2y7.onrender.com`) in release builds, and to your local Docker backend in development.

### Pre-built APK

Download from [GitHub Releases](https://github.com/RaresEduard-Tudor/CarLogix/releases).

APKs are automatically built and published when a version tag is pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
# → GitHub Actions builds the APK and creates a release
```

## Commands

### Frontend
```bash
yarn dev          # Dev server (port 5173)
yarn build        # Production build
yarn preview      # Preview production build
yarn lint         # ESLint
```

### Backend
```bash
cd backend
mvn spring-boot:run                # Run locally (needs PostgreSQL)
mvn clean package -DskipTests      # Build JAR
```

### Docker
```bash
docker compose up -d                    # Production
docker compose --profile dev up -d      # Development
docker compose down                     # Stop all
docker compose logs carlogix-api -f     # API logs
```

## License

MIT
