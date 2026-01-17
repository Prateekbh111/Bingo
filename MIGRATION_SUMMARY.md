# Migration Summary: AWS EC2 → Vercel + Railway

## Changes Made

### 1. Configuration Files Created

- **`vercel.json`**: Vercel deployment configuration for monorepo
  - Root directory: `apps/web`
  - Build command includes Prisma client generation
  - Handles monorepo structure

- **`railway.toml`**: Railway deployment configuration
  - Builds WebSocket server from `apps/ws`
  - Configures start command and health checks

- **`DEPLOYMENT.md`**: Comprehensive deployment guide
  - Step-by-step instructions for both platforms
  - Environment variable setup
  - Troubleshooting tips

### 2. Code Changes

#### `apps/ws/src/index.ts`
- ✅ Updated to use `process.env.PORT` (Railway's auto-assigned port)
- ✅ Falls back to `WS_PORT` for local development
- ✅ Updated to use `NEXTAUTH_SECRET` from environment variables (was hardcoded)
- ✅ Improved error handling in token validation

#### `apps/ws/package.json`
- ✅ Updated build script to generate Prisma client before TypeScript compilation
- ✅ Build command: `cd ../../packages/db && npm run db:generate && cd ../../apps/ws && tsc -b`

### 3. No Changes Needed

The following files work as-is:
- `apps/web/next.config.mjs` - Already handles `NEXT_PUBLIC_WEB_SOCKET_URL`
- `apps/web/src/context/WebSocketProvider.tsx` - Uses environment variable correctly
- All API routes - Already use `NEXT_PUBLIC_WEB_SOCKET_URL` correctly

## Next Steps

### 1. Deploy WebSocket Server to Railway

1. Go to [Railway](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set root directory to `apps/ws` (or Railway will auto-detect)
4. Set environment variables:
   - `DATABASE_URL` - Your existing Postgres URL
   - `NEXTAUTH_SECRET` - Must match Vercel
   - `NODE_ENV=production`
5. Deploy and get the public URL (e.g., `your-app.up.railway.app`)
6. Note the WebSocket URL format: `wss://your-app.up.railway.app` (use `wss://` for HTTPS)

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and create a new project
2. Connect your GitHub repository
3. Configure:
   - Root Directory: `apps/web`
   - Framework: Next.js (auto-detected)
   - Build settings are handled by `vercel.json`
4. Set environment variables:
   - `DATABASE_URL` - Your existing Postgres URL
   - `NEXTAUTH_URL` - Your Vercel URL (update after first deploy)
   - `NEXTAUTH_SECRET` - Must match Railway
   - `NEXT_PUBLIC_WEB_SOCKET_URL` - `wss://your-railway-app.up.railway.app`
   - `GOOGLE_CLIENT_ID` - Your OAuth credentials
   - `GOOGLE_CLIENT_SECRET` - Your OAuth credentials
   - `NODE_ENV=production`
5. Deploy

### 3. Update OAuth Redirect URLs

Update your Google OAuth app to include:
- `https://your-vercel-app.vercel.app/api/auth/callback/google`

### 4. Test

1. Test WebSocket connection in browser DevTools
2. Test game functionality
3. Test friend requests and messaging
4. Verify database operations

## Important Notes

- **NEXTAUTH_SECRET**: Must be identical in both Vercel and Railway
- **WebSocket Protocol**: Use `wss://` (secure WebSocket) for production
- **Database**: No changes needed - both services use the same `DATABASE_URL`
- **Cost**: Both platforms offer free tiers that should cover your needs

## Rollback

Keep your EC2 instance running until you've verified everything works:
1. Deploy to new platforms
2. Test thoroughly
3. Update DNS/domains if using custom domains
4. Monitor for 24-48 hours
5. Shut down EC2 only after confirming success

## Files Modified

- ✅ `vercel.json` (new)
- ✅ `railway.toml` (new)
- ✅ `apps/ws/src/index.ts` (modified)
- ✅ `apps/ws/package.json` (modified)
- ✅ `.github/workflows/deploy.yml` (modified - removed EC2 deployment)
- ✅ `DEPLOYMENT.md` (new)
- ✅ `MIGRATION_SUMMARY.md` (this file)

## CI/CD Pipeline Changes

The GitHub Actions workflow has been updated:
- **Removed**: EC2 SSH deployment steps
- **Removed**: Docker Hub build and push steps
- **Removed**: Environment variable extraction from EC2
- **Kept**: Linting and testing steps (now runs on PRs and pushes)
- **Note**: Vercel and Railway automatically deploy from GitHub, so no manual deployment steps are needed in CI/CD

### Cleanup GitHub Secrets (Optional)

After migration is complete, you can remove these unused secrets from GitHub Settings → Secrets and variables → Actions:
- `EC2_KEY` (SSH private key)
- `EC2_USER` (EC2 username)
- `EC2_HOST` (EC2 hostname)
- `DOCKER_USERNAME` (if not used elsewhere)
- `DOCKER_PASSWORD` (if not used elsewhere)

**Keep**: Any secrets used by other workflows or projects.

## Support

For detailed deployment instructions, see `DEPLOYMENT.md`.

For issues:
- Vercel: [docs.vercel.com](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

