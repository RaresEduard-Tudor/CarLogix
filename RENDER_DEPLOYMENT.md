# Deploying CarLogix to Render

This guide will help you deploy the CarLogix web application to Render.com.

## Prerequisites

- Render account (sign up at https://render.com)
- GitHub repository with your code
- Firebase project credentials

## Deployment Options

### Option 1: Deploy with Dockerfile (Recommended)

Render will automatically detect and use the Dockerfile in your repository.

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Docker configuration for deployment"
git push origin main
```

#### Step 2: Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `carlogix` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (uses root)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`

   **Instance Type:**
   - **Free** (for testing) or **Starter** ($7/month for better performance)

#### Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_USE_FIREBASE_EMULATORS=false
VITE_USE_FIREBASE_PROD=true
```

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Pull your code from GitHub
   - Build the Docker image
   - Deploy the container
   - Provide a public URL

Your app will be available at: `https://carlogix.onrender.com` (or your chosen name)

---

### Option 2: Deploy Without Docker (Static Site)

If you prefer not to use Docker, you can deploy as a static site:

#### Step 1: Update Build Settings

In Render dashboard:
- **Build Command**: `yarn install && yarn build`
- **Publish Directory**: `dist`

#### Step 2: Add Build Environment Variables

Same Firebase variables as above.

#### Step 3: Deploy

Render will build and serve your static files.

---

## Post-Deployment Steps

### 1. Update Firebase Configuration

Add your Render domain to Firebase:

1. Go to Firebase Console → Authentication → Settings
2. Under **Authorized domains**, add:
   ```
   your-app-name.onrender.com
   ```

### 2. Test Your Deployment

Visit your Render URL and test:
- ✅ Login functionality
- ✅ Car management
- ✅ Maintenance tracking
- ✅ Error code scanning

### 3. Configure Custom Domain (Optional)

In Render dashboard:
1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `app.carlogix.com`)
3. Update DNS records as instructed
4. Render provides free SSL certificates

---

## Automatic Deployments

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically.

---

## Monitoring & Logs

### View Logs
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time deployment and runtime logs

### Health Checks
The Dockerfile includes a health check endpoint at `/health`

Render automatically monitors this endpoint.

---

## Troubleshooting

### Build Fails

**Check environment variables:**
```bash
# In Render dashboard, verify all VITE_ variables are set
```

**Clear build cache:**
1. Go to **Settings** → **Build & Deploy**
2. Click **"Clear build cache & deploy"**

### App Not Loading

**Check logs:**
- Look for JavaScript errors
- Verify Firebase configuration
- Check CORS settings in Firebase

**Verify Nginx config:**
- The Dockerfile uses custom `nginx.conf`
- Ensures proper SPA routing

### Performance Issues

**Upgrade instance type:**
- Free tier has limited resources
- Consider **Starter** plan for production

**Enable caching:**
- Already configured in `nginx.conf`
- Static assets cached for 1 year

---

## Render vs Other Platforms

| Feature | Render | Heroku | Vercel | Netlify |
|---------|--------|--------|--------|---------|
| Docker Support | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Free Tier | ✅ Yes* | ❌ No | ✅ Yes | ✅ Yes |
| Auto SSL | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Custom Domains | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Build Time | ~2-3 min | ~2-4 min | ~1 min | ~1 min |

*Free tier spins down after inactivity (slower cold starts)

---

## Cost Estimation

### Free Tier
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 30 sec cold start time
- Good for: Testing, demos

### Starter ($7/month)
- ✅ Always on
- ✅ Fast response times
- ✅ 0.5 GB RAM
- Good for: Production apps, small teams

### Pro ($25/month)
- ✅ 2 GB RAM
- ✅ Better performance
- Good for: High traffic apps

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` to Git
- ✅ Use Render's environment variable manager
- ✅ Rotate Firebase keys regularly

### 2. CORS Configuration
Update Firebase to only allow your domain:
```javascript
// In Firebase Console → Settings
Authorized domains: your-app.onrender.com
```

### 3. Enable Firebase App Check
Protect your Firebase resources:
1. Go to Firebase Console → App Check
2. Register your web app
3. Add reCAPTCHA v3

---

## Scaling

### Horizontal Scaling
Render supports multiple instances:
1. Go to **Settings** → **Scaling**
2. Increase instance count
3. Render handles load balancing

### Database Considerations
- Firebase scales automatically
- Consider Firestore query limits
- Monitor Firebase usage in console

---

## Backup Strategy

### Automated Backups
Since data is in Firebase:
1. Enable Firestore automatic backups
2. Use Firebase export:
   ```bash
   gcloud firestore export gs://your-bucket
   ```

### Code Backups
- GitHub is your source of truth
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Production release"
  git push origin v1.0.0
  ```

---

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test thoroughly
3. ✅ Configure custom domain
4. ✅ Set up monitoring
5. ✅ Document your deployment
6. ✅ Share with users!

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: Report bugs in your repository

---

**Your CarLogix app is now live! 🚀**
