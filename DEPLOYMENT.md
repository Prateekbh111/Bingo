# Deployment Guide: Vercel + Railway

This guide walks you through deploying the Bingo application to Vercel (frontend) and Railway (WebSocket server).

## Prerequisites

- GitHub account (for connecting repositories)
- Vercel account (free tier available)
- Railway account (free tier with $5/month credit)
- Existing Prisma Postgres database (DATABASE_URL)

## Architecture

- **Frontend (Next.js)**: Deployed on Vercel
- **WebSocket Server**: Deployed on Railway
- **Database**: Existing Prisma Postgres (no changes needed)

## CI/CD Pipeline

**Important**: The GitHub Actions workflow (`.github/workflows/deploy.yml`) has been updated:
- ✅ Removed EC2 deployment steps
- ✅ Removed Docker Hub build/push steps
- ✅ Now runs linting and tests only
- ✅ Vercel and Railway handle deployments automatically via GitHub integration

**No action needed**: Once you connect your GitHub repo to Vercel and Railway, they will automatically deploy on every push to `main`.

## Step 1: Deploy WebSocket Server to Railway

### 1.1 Create Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository and select the `Bingo` repository
5. Railway will auto-detect the project and enable automatic deployments

### 1.2 Configure Railway Service

1. Railway should detect `apps/ws` as the service root
2. If not, go to Settings → Source → Root Directory and set to `apps/ws`
3. Railway will use the `railway.toml` configuration at the root

### 1.3 Set Environment Variables in Railway

Go to the service → Variables tab and add:

```
DATABASE_URL=your_existing_postgres_url
NEXTAUTH_SECRET=your_nextauth_secret (must match Vercel)
NODE_ENV=production
PORT=8080 (Railway auto-sets this, but you can specify)
```

**Note**: Railway automatically sets `PORT` - your code will use it automatically.

### 1.4 Deploy and Get Public URL

1. Railway will automatically deploy when you push to your main branch
2. Once deployed, go to Settings → Networking
3. Generate a public domain (e.g., `your-app.up.railway.app`)
4. Copy the public URL - you'll need this for `NEXT_PUBLIC_WEB_SOCKET_URL`

**Important**: The WebSocket URL format will be:
- For HTTP: `ws://your-app.up.railway.app`
- For HTTPS (recommended): `wss://your-app.up.railway.app`

Railway provides HTTPS automatically, so use `wss://` in production.

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will detect it's a Next.js project
5. **Enable automatic deployments** (default) - Vercel will deploy on every push to `main`

### 2.2 Configure Vercel Project Settings

In Project Settings → General:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `apps/web`
- **Build Command**: Leave default (Vercel handles monorepo)
- **Output Directory**: `.next` (default)
- **Install Command**: Leave default

The `vercel.json` file at the root will handle the monorepo configuration.

### 2.3 Set Environment Variables in Vercel

Go to Settings → Environment Variables and add:

```
DATABASE_URL=your_existing_postgres_url
NEXTAUTH_URL=https://your-vercel-app.vercel.app (update after first deploy)
NEXTAUTH_SECRET=your_nextauth_secret (must match Railway)
NEXT_PUBLIC_WEB_SOCKET_URL=wss://your-railway-app.up.railway.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=production
```

**Important Notes**:
- `NEXT_PUBLIC_WEB_SOCKET_URL` should use `wss://` protocol for production
- `NEXTAUTH_URL` should be your Vercel deployment URL (update after first deploy)
- `NEXTAUTH_SECRET` must be the same value in both Vercel and Railway

### 2.4 Deploy

1. Click "Deploy"
2. After first deployment, update `NEXTAUTH_URL` with your actual Vercel URL
3. Redeploy if needed

## Step 3: Update OAuth Redirect URLs

If you're using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client
3. Add your Vercel URL to authorized redirect URIs:
   - `https://your-vercel-app.vercel.app/api/auth/callback/google`

## Step 4: Testing

### 4.1 Test WebSocket Connection

1. Open your Vercel-deployed frontend
2. Log in
3. Open browser DevTools → Network tab
4. Look for WebSocket connections to your Railway URL
5. Verify connection is successful (status 101 Switching Protocols)

### 4.2 Test Game Functionality

1. Create a game or join a game
2. Verify real-time updates work
3. Test friend requests and messaging
4. Check that database operations work correctly

## Step 5: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and OAuth redirect URLs

### Railway Custom Domain

1. Go to Railway Service → Settings → Networking
2. Add custom domain
3. Update DNS records
4. Update `NEXT_PUBLIC_WEB_SOCKET_URL` in Vercel to use custom domain

## Troubleshooting

### WebSocket Connection Fails

- Verify `NEXT_PUBLIC_WEB_SOCKET_URL` uses correct protocol (`wss://` for HTTPS)
- Check Railway service is running and accessible
- Verify `NEXTAUTH_SECRET` matches in both platforms
- Check Railway logs for connection errors

### Build Failures

**Vercel**:
- Ensure Prisma client is generated during build
- Check that all dependencies are in `package.json`
- Verify monorepo structure is correct

**Railway**:
- Check that Prisma client generation runs in build script
- Verify `DATABASE_URL` is set correctly
- Check Railway build logs for errors

### Database Connection Issues

- Verify `DATABASE_URL` is correct in both platforms
- Check database allows connections from Vercel/Railway IPs
- Ensure database is accessible (not behind firewall)

## Cost Optimization

- **Vercel**: Free tier includes unlimited personal projects, 100GB bandwidth/month
- **Railway**: Free tier includes $5 credit/month (~500 hours of runtime)
- Monitor Railway usage to stay within free tier limits

## Rollback Plan

If issues occur:

1. Keep EC2 instance running until migration is verified
2. Test thoroughly on new platforms
3. Update DNS gradually (use staging environment first)
4. Monitor error logs and user feedback
5. Shut down EC2 only after confirming everything works

## Support

For issues:
- Vercel: [Vercel Documentation](https://vercel.com/docs)
- Railway: [Railway Documentation](https://docs.railway.app)

