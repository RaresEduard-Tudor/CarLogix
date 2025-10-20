# CarLogix Docker Setup

This guide explains how to run CarLogix using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- `.env` file with Firebase credentials (copy from `.env.example`)

## Quick Start

### Production Build

Build and run the production-optimized container:

```bash
# Build the image
docker-compose build carlogix-web

# Run the container
docker-compose up carlogix-web

# Or build and run in one command
docker-compose up --build carlogix-web
```

The app will be available at: http://localhost:3000

### Development Mode (with hot reload)

For development with live code changes:

```bash
# Using the dev profile in main docker-compose.yml
docker-compose --profile dev up carlogix-dev

# OR using the dedicated dev compose file
docker-compose -f docker-compose.dev.yml up

# With rebuild
docker-compose -f docker-compose.dev.yml up --build
```

The dev server will be available at: http://localhost:5173

## Docker Commands

### Build

```bash
# Build production image
docker-compose build carlogix-web

# Build development image
docker-compose -f docker-compose.dev.yml build
```

### Run

```bash
# Run in foreground
docker-compose up carlogix-web

# Run in background (detached)
docker-compose up -d carlogix-web

# Stop containers
docker-compose down
```

### Logs

```bash
# View logs
docker-compose logs carlogix-web

# Follow logs
docker-compose logs -f carlogix-web
```

### Shell Access

```bash
# Access running container
docker exec -it carlogix-web sh

# For dev container
docker exec -it carlogix-dev sh
```

## Environment Variables

Make sure your `.env` file contains:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_USE_FIREBASE_EMULATORS=false
VITE_USE_FIREBASE_PROD=false
```

## Building for Different Environments

### Production

```bash
# Build with production Firebase config
docker-compose up --build carlogix-web
```

### Using Firebase Emulators

Update your `.env`:
```env
VITE_USE_FIREBASE_EMULATORS=true
```

Then rebuild:
```bash
docker-compose up --build carlogix-web
```

## Health Checks

The production container includes health checks at `/health` endpoint.

Check health status:
```bash
docker-compose ps
# or
docker inspect carlogix-web --format='{{.State.Health.Status}}'
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 3000 to 8080 or any available port
```

### Build Cache Issues

Clear Docker cache and rebuild:

```bash
docker-compose build --no-cache carlogix-web
docker-compose up carlogix-web
```

### Container Won't Start

Check logs:
```bash
docker-compose logs carlogix-web
```

Verify environment variables:
```bash
docker-compose config
```

## Production Deployment

For production deployment on a server:

1. **Copy files to server:**
   ```bash
   scp -r . user@server:/path/to/carlogix
   ```

2. **On the server:**
   ```bash
   cd /path/to/carlogix
   
   # Create .env file with production credentials
   cp .env.example .env
   nano .env  # Edit with your values
   
   # Build and run
   docker-compose up -d carlogix-web
   ```

3. **Use a reverse proxy (Nginx/Traefik) for HTTPS:**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d carlogix-web
```

## Cleanup

Remove all containers, images, and volumes:

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes too (careful - this deletes data)
docker-compose down -v
```

## Advanced: Custom Build Arguments

Override build arguments:

```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY=custom-key \
  --build-arg VITE_FIREBASE_PROJECT_ID=custom-project \
  -t carlogix-web \
  .
```
