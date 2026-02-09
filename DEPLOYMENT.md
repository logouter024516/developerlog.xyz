# 🚀 Deployment Guide

## Prerequisites

1. **GitHub Repository**: This project must be in a GitHub repository
2. **GitHub Pages**: Enable GitHub Pages in repository settings
3. **Supabase Account**: Free tier is sufficient

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com/) and create a free account
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 2: GitHub Secrets Configuration

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |
| `VITE_GITHUB_USERNAME` | Your GitHub username | ✅ Yes |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token | ⚠️ Optional* |

\* Without token: 60 requests/hour. With token: 5,000 requests/hour.

### Creating GitHub Personal Access Token (Optional)

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Select scopes:
   - ✅ `public_repo` (if using private repos)
   - No scopes needed for public repos only
4. Generate and copy the token
5. Add it as `VITE_GITHUB_TOKEN` secret

## Step 3: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

## Step 4: Deploy

Push to the `main` branch:

```bash
git add .
git commit -m "Deploy portfolio"
git push origin main
```

The GitHub Actions workflow will automatically:
1. ✅ Run ESLint checks
2. ✅ Build the project
3. ✅ Deploy to GitHub Pages

## Step 5: Access Your Site

Your portfolio will be available at:

```
https://YOUR_USERNAME.github.io/03_portfolio_web/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Local Development

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GITHUB_USERNAME=your_github_username
   VITE_GITHUB_TOKEN=your_github_token  # optional
   ```

### Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build Locally

```bash
npm run build
npm run preview
```

## Troubleshooting

### Build Fails

**Check secrets**: Ensure all required secrets are set in GitHub repository settings.

**Check logs**: Go to **Actions** tab in GitHub to see detailed build logs.

### Realtime Cursors Not Working

**Supabase configuration**: Verify your Supabase URL and anon key are correct.

**Browser console**: Check for WebSocket connection errors.

### Projects Not Loading

**GitHub rate limit**: If you see 403 errors, you've hit the rate limit. Add a GitHub token to increase the limit.

**CORS errors**: GitHub API allows CORS by default, but check browser console for issues.

### Blank Page After Deployment

**Base path**: Ensure `vite.config.ts` has the correct `base` path:
```typescript
base: process.env.NODE_ENV === 'production' ? '/03_portfolio_web/' : '/',
```

**Repository name**: The base path must match your repository name exactly.

## Performance Tips

1. **GitHub Token**: Highly recommended to avoid rate limits
2. **Supabase Free Tier**: Supports ~200 concurrent realtime connections
3. **Caching**: TanStack Query automatically caches GitHub API responses for 5 minutes

## Security Notes

- ✅ Supabase anon key is safe to expose (it's designed for client-side use)
- ✅ GitHub token with no scopes is safe for public repos
- ⚠️ Never commit `.env` file to git (already in `.gitignore`)

---

**Need help?** Check the [README.md](README.md) for more details or open an issue on GitHub.
