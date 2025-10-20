# Self-Hosting & GitHub Releases Strategy

## 🎯 Your Setup (Recommended)

For personal use, you don't need external hosting at all!

## 📦 Distribution Method

### Mobile App: GitHub Releases
### Web App: Run Locally (or self-host if needed)
### Backend: Firebase (free tier)

---

## 📱 Mobile App: GitHub Releases

### Setup Once:

1. **Build Production APK:**
   ```bash
   cd OBDScanner
   
   # Login to EAS
   eas login
   
   # Build APK
   eas build --platform android --profile production
   ```

2. **Create GitHub Release:**
   ```bash
   # Tag your version
   git tag -a v1.0.0 -m "First release"
   git push origin v1.0.0
   
   # Go to: https://github.com/RaresEduard-Tudor/CarLogix/releases
   # Click "Create a new release"
   # Upload the APK file
   # Write release notes
   # Publish
   ```

3. **Share the Link:**
   - Send link to: `https://github.com/RaresEduard-Tudor/CarLogix/releases`
   - Users download APK
   - Install on Android device

### Future Updates:

```bash
# Make changes to code
git add .
git commit -m "Add new feature"
git push

# Build new APK
cd OBDScanner
eas build --platform android --profile production

# Create new release
git tag -a v1.1.0 -m "Update with new features"
git push origin v1.1.0

# Upload new APK to GitHub Releases
```

---

## 🌐 Web App: Local Development (Easiest)

### Daily Usage:

```bash
cd CarLogix
yarn dev
# Open http://localhost:5173
```

**Pros:**
- ✅ No hosting needed
- ✅ Always latest code
- ✅ No deployment hassle
- ✅ Free

**Cons:**
- ❌ Only accessible on your computer
- ❌ Must run `yarn dev` each time

---

## 🏠 Web App: Self-Hosting (Optional)

If you want 24/7 access without running `yarn dev`:

### Option 1: Run on Your Computer

```bash
# Build once
yarn build

# Serve with simple HTTP server
npx serve -s dist -p 3000

# Access at: http://localhost:3000
# Or from other devices: http://YOUR_LOCAL_IP:3000
```

### Option 2: Home Server / Raspberry Pi

**Setup:**
```bash
# On your server/Pi
git clone https://github.com/RaresEduard-Tudor/CarLogix.git
cd CarLogix

# Using Docker
docker-compose up -d carlogix-web

# Access at: http://SERVER_IP:3000
```

**Expose to Internet (Optional):**
1. Set up port forwarding on router (port 3000)
2. Use Dynamic DNS (DuckDNS.org - free)
3. Access from anywhere: `https://your-subdomain.duckdns.org`

### Option 3: VPS ($5/month)

**Providers:**
- DigitalOcean ($6/month)
- Linode ($5/month)
- Vultr ($5/month)

**Setup:**
```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone and run
git clone https://github.com/RaresEduard-Tudor/CarLogix.git
cd CarLogix
docker-compose up -d carlogix-web

# Access at: http://YOUR_VPS_IP:3000
```

---

## 🔄 How It All Works Together

### Your Development Flow:

```
┌─────────────────────────────────────────────┐
│  1. Development                              │
│     - Edit code locally                      │
│     - Test with: yarn dev                    │
│     - Test mobile: yarn expo start --tunnel  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. Commit & Push                            │
│     - git add .                              │
│     - git commit -m "message"                │
│     - git push origin main                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. Build Mobile (when ready for release)    │
│     - eas build --platform android           │
│     - Create GitHub Release                  │
│     - Upload APK                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. Users Download                           │
│     - Download APK from GitHub               │
│     - Install on phone                       │
│     - Open web app (local or hosted)         │
│     - Both connect to Firebase               │
└─────────────────────────────────────────────┘
```

### Daily Usage (For You):

**Web App:**
```bash
yarn dev
# Or just use the deployed version if self-hosted
```

**Mobile App:**
```bash
# For development/testing new features
yarn expo start --host tunnel

# For regular use
# Just open the installed APK on your phone
# It connects to Firebase directly
```

---

## 🔥 Firebase Setup (Backend)

Both apps connect to Firebase - no separate hosting needed!

**What Firebase Provides:**
- Authentication (user login)
- Firestore (database)
- Storage (file uploads)
- Free tier: 50k reads/day, 20k writes/day

**Cost:** $0 for personal use (well within free tier)

---

## 💰 Cost Comparison

| Option | Cost | Best For |
|--------|------|----------|
| Local Dev (`yarn dev`) | Free | Solo development |
| Self-host (your PC) | Free | Personal use, always-on PC |
| Raspberry Pi | ~$50 once | Home server enthusiast |
| VPS | $5-10/mo | Multiple users, 24/7 access |
| Render.com | Free/$7/mo | Easy deployment, no maintenance |
| Firebase | Free | Backend (all options) |

---

## 📋 Recommended Setup for Your Use Case

Since you said you just download APK and run with tunnel:

### Best Setup:

1. **Mobile App:**
   ```bash
   # Development/testing
   yarn expo start --host tunnel
   
   # Production release (when stable)
   eas build → Upload to GitHub Releases
   ```

2. **Web App:**
   ```bash
   # Just run locally when needed
   yarn dev
   
   # Or build once and serve
   yarn build
   npx serve -s dist
   ```

3. **Backend:**
   - Firebase (already set up)
   - No additional hosting needed

### Why This Works:
- ✅ Zero hosting costs
- ✅ Full control
- ✅ Easy updates (just git push)
- ✅ Both apps share Firebase backend
- ✅ Tunnel mode works from anywhere
- ✅ APK on GitHub for easy distribution

---

## 🚀 Quick Commands

### Build & Release Mobile App:
```bash
cd OBDScanner
eas build --platform android --profile production

# After build completes
git tag -a v1.0.0 -m "Release 1.0"
git push origin v1.0.0
# Upload APK to GitHub Releases page
```

### Run Web App Locally:
```bash
cd CarLogix
yarn dev  # Development mode
# or
yarn build && npx serve -s dist  # Production mode
```

### Run Mobile App for Testing:
```bash
cd OBDScanner
yarn expo start --host tunnel
```

---

## 📝 Next Steps

1. **Integrate Error Codes** (as discussed)
   - Add Firebase to mobile app
   - Add login screen
   - Save scanned codes to Firestore
   - Display in web app

2. **First Release**
   - Build APK
   - Create GitHub Release
   - Test installation

3. **Iterate**
   - Make improvements
   - Push to GitHub
   - Build new APK when major updates

**Want me to start implementing the error codes integration?** 🚀
