# CarLogix

**CarLogix** is a car maintenance and diagnostics platform with a Spring Boot REST API backend, React web dashboard, OBD-II MCP server, and a React Native mobile scanner app.

## Architecture

```
┌─────────────────┐       ┌──────────────────────┐      ┌──────────────┐
│  React Frontend │────▶  |  Spring Boot API     │────▶│  PostgreSQL │
│  (Vite / MUI)   │       │  (JWT Auth, REST)     │     │  (3 tables)  │
└─────────────────┘       └──────────┬───────────-┘     └──────────────┘
                                   │
                              ┌────▼────────┐
                              │  SQLite DB   │
                              │  (OBD-II     │
                              │   DTC codes) │
                              └─────────────┘

┌─────────────────┐     ┌──────────────────────┐
│  MCP Server     │────▶│  Same SQLite DB       │
│  (Python/stdio) │     │  (128 DTC codes)      │
└─────────────────┘     └───────────────────────┘

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
| Database | PostgreSQL 16 (users, vehicles, diagnostic_logs) |
| OBD-II Lookup | SQLite (128 DTC codes), auto-populates diagnostics |
| Auth | JWT (HS512, 24h expiry, BCrypt passwords) |
| MCP Server | Python 3.13, MCP SDK 1.26, 5 tools |
| Mobile | React Native 0.81, Expo SDK 54, Bluetooth Classic |
| Infrastructure | Docker Compose, Nginx, multi-stage builds |

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

# Create .env (see .env.example or configure your own)
cp .env.example .env

# Build and start all services
docker compose -f docker-compose.new.yml up -d

# Services:
#   PostgreSQL  → localhost:5432
#   Spring Boot → localhost:8080
#   React (prod)→ localhost:3000
```

### Run in dev mode

```bash
# Start backend services
docker compose -f docker-compose.new.yml up postgres carlogix-api -d

# Start frontend with hot reload
yarn install
yarn dev
# Open http://localhost:5173
```

### Dev with Docker (full stack hot reload)

```bash
docker compose -f docker-compose.new.yml --profile dev up -d
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

### Diagnostics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/diagnostics` | List all user's diagnostic logs |
| GET | `/api/diagnostics/vehicle/{id}` | Diagnostics for a specific vehicle |
| POST | `/api/diagnostics` | Create diagnostic (auto-populates OBD-II definition) |
| PATCH | `/api/diagnostics/{id}/resolve` | Mark diagnostic as resolved |

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
│       ├── controller/           # Auth, Vehicle, Diagnostic, Health
│       ├── dto/                  # Request/Response objects
│       ├── exception/            # Global error handling
│       ├── model/                # JPA entities
│       ├── repository/           # Spring Data JPA
│       ├── security/             # JWT provider, auth filter
│       └── service/              # Business logic, OBD2 lookup
├── src/                          # React frontend
│   ├── App.jsx
│   ├── components/               # DashboardLayout
│   ├── pages/                    # Dashboard, Cars, Maintenance, etc.
│   ├── hooks/                    # useCarLogixApi (REST), useFirebaseCarLogix (legacy)
│   ├── services/                 # apiService (REST client)
│   ├── contexts/                 # Settings, Theme
│   └── config/                   # Firebase config (legacy)
├── OBDScanner/                   # React Native mobile app
│   ├── src/screens/              # Login, CarSelection, OBDScanner
│   ├── src/obd/                  # Bluetooth & OBD protocol
│   └── android/                  # Native Android project
├── server.py                     # OBD-II MCP server
├── build_obd2_db.py              # SQLite database builder
├── obd2_codes.db                 # 128 DTC codes
├── docker-compose.new.yml        # Full stack Docker Compose
├── Dockerfile                    # Frontend production image
├── nginx.conf                    # SPA routing config
└── .env                          # Environment variables (not committed)
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
3. Open app, log in with your CarLogix account
4. Select your vehicle
5. Connect to Bluetooth adapter (default PIN: 1234)
6. Scan for error codes

### Pre-built APK

Download from [GitHub Releases](https://github.com/RaresEduard-Tudor/CarLogix/releases).

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
docker compose -f docker-compose.new.yml up -d                    # Production
docker compose -f docker-compose.new.yml --profile dev up -d      # Development
docker compose -f docker-compose.new.yml down                     # Stop all
docker compose -f docker-compose.new.yml logs carlogix-api -f     # API logs
```

## License

MIT

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- Firebase account (for backend)
- Docker (optional, for containerized deployment)

### Web Application Setup

1. **Clone the repository:**
```bash
git clone https://github.com/RaresEduard-Tudor/CarLogix.git
cd CarLogix
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Configure Firebase:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Firebase credentials
nano .env
```

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase configuration.

4. **Start the development server:**
```bash
yarn dev
```

5. **Open [http://localhost:5173](http://localhost:5173) in your browser**

### Mobile App Setup

See [OBDScanner/README.md](OBDScanner/README.md) for Android app setup instructions.

### Docker Deployment (Optional)

See [DOCKER_README.md](DOCKER_README.md) for containerized deployment.

**Quick start with Docker:**
```bash
# Production build
docker-compose up --build carlogix-web

# Development with hot reload
docker-compose -f docker-compose.dev.yml up
```

### Available Scripts

#### Web App
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

#### Mobile App (in OBDScanner directory)
- `yarn start` - Start Expo dev server with tunnel
- `yarn android` - Build and run on Android
- `yarn prebuild` - Generate native code

## Usage 📱

### Web Application

1. **Create Account**: Register with email/password or use social login
2. **Add a Car**: Go to "My Cars" and add your vehicle details
3. **Log Maintenance**: Navigate to "Maintenance" to add service records
4. **Scan for Errors**: Use the "Error Codes" page (mock data on web)
5. **View Dashboard**: Check the overview of your maintenance data
6. **Access Anywhere**: Your data syncs across all devices

### Mobile App

1. **Install Development Build**: Follow OBDScanner/README.md
2. **Enable Bluetooth**: Turn on Bluetooth on your Android device
3. **Connect OBD Adapter**: Plug ELM327 adapter into your car's OBD-II port
4. **Pair Device**: Scan and connect to your Bluetooth OBD adapter
5. **Read Codes**: Scan for real diagnostic trouble codes from your vehicle
6. **Clear Codes**: Clear error codes directly from the app

## Project Structure 📁

```
CarLogix/
├── src/                      # Web application source
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React Context providers
│   ├── services/           # Firebase service layer
│   ├── config/             # Configuration files
│   └── utils/              # Utility functions
├── OBDScanner/              # React Native mobile app
│   ├── src/
│   │   ├── screens/        # Mobile screens
│   │   └── obd/            # OBD-II service layer
│   └── android/            # Android native code
├── public/                  # Static assets
├── scripts/                 # Database setup scripts
├── Dockerfile              # Production Docker image
├── docker-compose.yml      # Docker orchestration
├── nginx.conf              # Nginx configuration
└── firebase.json           # Firebase configuration
```

## Deployment �

### Render.com (Recommended)
See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete deployment guide.

**Quick deploy:**
1. Push code to GitHub
2. Create Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

### Docker
See [DOCKER_README.md](DOCKER_README.md) for Docker deployment.

### Firebase Hosting (Alternative)
```bash
firebase deploy --only hosting
```

## Roadmap 🗺️

### Current Status ✅
- ✅ Firebase Authentication
- ✅ Firestore database
- ✅ Real-time data sync
- ✅ User profiles
- ✅ React Native mobile app
- ✅ Real OBD-II integration
- ✅ Docker containerization

### In Progress 🚧
- 🚧 Push notifications
- 🚧 Offline support for mobile
- 🚧 PDF export for service records

### Future Features 📋
- Multi-user car sharing
- Maintenance reminders
- Mechanic/shop integration
- Advanced analytics
- Car marketplace integration
- Integration with car manufacturer APIs
- AI-powered diagnostics

## Contributing 🤝

This is currently an MVP in development. Contributions, suggestions, and feedback are welcome!

## License 📄

MIT License - see [LICENSE](LICENSE) file for details.

---

**CarLogix** - Keeping your car's digital service notebook organized! 🚗✨
- **Export Capabilities**: Generate PDFs for mechanics or when selling

## 📋 Current Features (MVP 1)

### ✅ Completed in MVP 1
- **Mock Authentication**: Simple login system (any credentials work)
- **Car Management**: Add and manage vehicle profiles (brand, model, year, VIN)
- **Maintenance Tracking**: Record service history with dates, costs, and notes
- **Error Code Scanner**: Mock OBD-II scanner with sample diagnostic codes
- **Dashboard Overview**: Visual summary of maintenance and error data
- **Responsive Design**: Works on desktop and mobile browsers

### 🔮 Coming in Future MVPs
- **Real Authentication**: Firebase-based user accounts
- **Cloud Sync**: Real-time data synchronization
- **Mobile App**: Android companion for OBD-II scanning
- **PDF Export**: Generate maintenance reports
- **Maintenance Reminders**: Mileage and date-based alerts
- **Real OBD-II Integration**: Connect to actual diagnostic adapters

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Hooks (local state for MVP)
- **Development**: Vite dev server with hot reload

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaresEduard-Tudor/CarLogix.git
   cd CarLogix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Login
- **Email**: Any email (e.g., `demo@carlogix.com`)
- **Password**: Any password (e.g., `demo123`)

## 📱 How to Use

### 1. Login
Use any email/password combination to access the demo.

### 2. Add Your Car
- Navigate to "My Cars"
- Click "Add Car" 
- Fill in vehicle details (brand, model, year, VIN, etc.)

### 3. Track Maintenance
- Go to "Maintenance" section
- Add service records with dates, costs, and notes
- View complete service history

### 4. Scan for Errors
- Visit "Error Codes" section
- Select your car and click "Start Scan"
- View mock diagnostic trouble codes

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── DashboardLayout.jsx
├── pages/              # Main application pages
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CarsPage.jsx
│   ├── MaintenancePage.jsx
│   └── ErrorCodesPage.jsx
├── hooks/              # Custom React hooks
│   └── useCarLogix.js
├── data/               # Mock data and sample content
│   └── mockData.js
└── App.jsx             # Main application component
```

## 🎯 MVP Roadmap

### MVP 1: Digital Notebook ✅ (Current)
- Local-only data storage
- Mock authentication
- Basic CRUD operations
- Mock OBD-II scanner

### MVP 2: Cloud Integration (Next)
- Firebase authentication
- Firestore database
- Real-time data sync
- User accounts

### MVP 3: Mobile Companion
- React Native app
- Real OBD-II integration
- Push notifications
- Cross-platform sync

### MVP 4: Advanced Features
- PDF export functionality
- Maintenance reminders
- Multi-user car sharing
- Analytics and insights

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Extend the `useCarLogix` hook for new data operations
4. Update the main `App.jsx` routing logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚧 Known Limitations (MVP 1)

- Data is stored locally (no cloud sync)
- Mock authentication (no real user accounts)
- Mock OBD-II scanner (no real diagnostic capability)
- No PDF export functionality
- No maintenance reminders

These limitations will be addressed in future MVP releases.

---

**Made with ❤️ for car enthusiasts who want to keep their vehicles running smoothly!**

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
