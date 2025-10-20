# CarLogix

🚗 **CarLogix** is a digital maintenance and diagnostics companion for car owners. Replace your paper service notebook with a modern, cloud-synced solution that tracks maintenance records, error codes, and reminds you of upcoming services.

## Features ✨

### Web Application
- **Firebase Authentication** - Secure user login and registration
- **Car Management** - Add and manage multiple vehicles (brand, model, year, VIN)
- **Maintenance Tracking** - Log service records with dates, mileage, costs, and notes
- **Error Code Scanner** - Mock OBD-II scanner that returns sample diagnostic codes
- **Dashboard Overview** - Quick stats and recent activity
- **Cloud Sync** - All data synced with Firebase Firestore
- **Responsive Design** - Works on desktop, tablet, and mobile browsers

### Mobile Application (OBDScanner)
- **Real OBD-II Scanner** - Connect to ELM327 Bluetooth adapters
- **Read Diagnostic Codes** - Retrieve real DTCs from your vehicle
- **Clear Error Codes** - Clear diagnostic trouble codes
- **Bluetooth Integration** - Native Bluetooth Classic support on Android
- **Real-time Data** - View vehicle speed, RPM, and more

## Tech Stack 🛠️

### Web App
- **Frontend**: React 19 + Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v7
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Package Manager**: Yarn
- **State Management**: React Context + Hooks
- **Deployment**: Docker + Render.com

### Mobile App (Android)
- **Framework**: React Native + Expo
- **Bluetooth**: react-native-bluetooth-classic
- **Platform**: Android (Bluetooth Classic required)

## Getting Started 🚀

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
