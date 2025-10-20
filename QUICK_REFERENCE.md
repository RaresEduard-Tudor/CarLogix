# CarLogix Quick Reference Guide

## 🚀 Quick Start Commands

### Web Application (Development)
```bash
cd /path/to/CarLogix
yarn install
yarn dev
# Open http://localhost:5173
```

### Web Application (Docker)
```bash
cd /path/to/CarLogix

# Production
docker-compose up --build carlogix-web
# Open http://localhost:3000

# Development with hot reload
docker-compose -f docker-compose.dev.yml up
# Open http://localhost:5173
```

### Mobile App (Android)
```bash
cd /path/to/CarLogix/OBDScanner
yarn install
yarn start
# Scan QR code with Expo Go or dev build
```

## 📦 Deployment to Render

### Step 1: Prepare
```bash
# Ensure .env has all Firebase credentials
# Ensure code is committed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://dashboard.render.com
2. New + → Web Service
3. Connect GitHub repo: `RaresEduard-Tudor/CarLogix`
4. Configure:
   - **Name**: carlogix
   - **Runtime**: Docker
   - **Dockerfile Path**: Dockerfile
   - **Instance**: Free or Starter ($7/mo)

### Step 3: Environment Variables
Add in Render dashboard:
```
VITE_FIREBASE_API_KEY=<your-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-id>
VITE_FIREBASE_APP_ID=<your-app-id>
VITE_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
VITE_USE_FIREBASE_PROD=true
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for build (2-3 minutes)
- Access at: `https://carlogix.onrender.com`

### Step 5: Update Firebase
1. Firebase Console → Authentication → Settings
2. Add authorized domain: `carlogix.onrender.com`

## 🔄 Continuous Deployment
```bash
# Any push to main triggers auto-deploy
git add .
git commit -m "Update feature"
git push origin main
# Render automatically builds and deploys
```

## 🐛 Common Issues & Fixes

### Docker: Port Already in Use
```bash
# Stop running containers
docker-compose down

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Change 3000 to 8080
```

### Docker: Build Fails
```bash
# Clear cache and rebuild
docker-compose build --no-cache carlogix-web
docker-compose up carlogix-web
```

### Render: Build Fails
- Check environment variables are set correctly
- Clear build cache in Render dashboard
- Check logs for specific errors

### Mobile: Can't Connect to Dev Server
```bash
# Use tunnel mode (already configured)
cd OBDScanner
yarn start
# Make sure phone is connected to internet
```

### WSL2: ADB Not Working
**Solution 1: Use Windows ADB**
```cmd
# From Windows PowerShell
cd \\wsl$\Ubuntu\home\<user>\projects\CarLogix\OBDScanner\android\app\build\outputs\apk
adb install app-debug.apk
```

**Solution 2: Wireless Debugging**
```bash
# In WSL2
adb connect <phone-ip>:<port>
adb install app-debug.apk
```

## 📁 Project Structure

```
CarLogix/
├── src/                 # Web app source
├── OBDScanner/         # Mobile app
├── Dockerfile          # Production Docker
├── docker-compose.yml  # Docker orchestration
├── .env               # Environment variables (DO NOT COMMIT)
└── firebase.json      # Firebase config
```

## 🔗 Important Links

- **Main README**: [README.md](README.md)
- **Docker Guide**: [DOCKER_README.md](DOCKER_README.md)
- **Render Deployment**: [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- **Firebase Setup**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Mobile App**: [OBDScanner/README.md](OBDScanner/README.md)

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CarLogix System                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐         ┌─────────────────┐        │
│  │   Web App       │         │  Mobile App     │        │
│  │   (React)       │◄────────┤  (React Native) │        │
│  │   Port: 3000    │  Sync   │  Android        │        │
│  └────────┬────────┘         └────────┬────────┘        │
│           │                           │                  │
│           │         Firebase          │                  │
│           └───────────┬───────────────┘                  │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │   Firestore     │                         │
│              │   Authentication│                         │
│              │   Storage       │                         │
│              └─────────────────┘                         │
│                                                           │
│  Production:                                              │
│  ┌─────────────────┐                                     │
│  │   Render.com    │                                     │
│  │   Docker        │                                     │
│  │   Nginx         │                                     │
│  └─────────────────┘                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Development Workflow

1. **Local Development**
   ```bash
   # Web: yarn dev
   # Mobile: yarn start (in OBDScanner/)
   ```

2. **Test with Docker**
   ```bash
   docker-compose up --build carlogix-web
   ```

3. **Commit & Push**
   ```bash
   git add .
   git commit -m "Feature: description"
   git push origin main
   ```

4. **Deploy** (Automatic on Render)
   - Triggered by push to main
   - Build time: ~2-3 minutes
   - Zero-downtime deployment

## 📝 Environment Variables

### Required for Web App
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Optional Flags
```env
VITE_USE_FIREBASE_EMULATORS=false  # Use local emulators
VITE_USE_FIREBASE_PROD=true        # Use production Firebase
```

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Firebase keys are set as Render environment variables
- [ ] Render domain added to Firebase authorized domains
- [ ] Firebase security rules are configured
- [ ] HTTPS enabled (automatic on Render)

## 💡 Pro Tips

**Docker:**
- Use `-d` flag for background: `docker-compose up -d`
- View logs: `docker-compose logs -f carlogix-web`
- Shell access: `docker exec -it carlogix-web sh`

**Git:**
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0"`
- Push tags: `git push origin --tags`

**Render:**
- Free tier sleeps after 15 min inactivity
- Starter plan ($7/mo) = always on + faster
- Custom domains = free SSL included

**Mobile:**
- Use tunnel mode for remote development
- EAS Build for easier APK distribution
- Test on real device, not emulator (Bluetooth)

## 📞 Support

- **Documentation**: Check README files
- **Issues**: GitHub Issues
- **Render Support**: community.render.com
- **Firebase**: firebase.google.com/support

---

**Last Updated**: October 2025
