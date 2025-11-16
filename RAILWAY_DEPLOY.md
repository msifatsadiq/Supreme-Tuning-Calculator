# Railway Deployment Guide (No GitHub Needed)

## Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway

```bash
railway login
```
This will open your browser to authenticate.

## Step 3: Initialize Project

```bash
cd /Users/sifatsadiq/Documents/Personal/Projects/demo/backend
railway init
```

When prompted:
- Project name: `supreme-tuning-backend`
- Select: "Create new project"

## Step 4: Add Environment Variables

```bash
railway variables set PORT=5001
railway variables set NODE_ENV=production
railway variables set ADMIN_EMAIL=admin@supa.com
railway variables set ADMIN_PASS=password123
railway variables set JWT_SECRET=supreme-tuning-secret-2025
railway variables set FRONTEND_URL=https://autotuningcalc.netlify.app
```

## Step 5: Deploy

```bash
railway up
```

Wait 2-3 minutes for deployment.

## Step 6: Get Your Backend URL

```bash
railway domain
```

This will give you a URL like: `https://supreme-tuning-backend.up.railway.app`

---

## Alternative: Quick Deploy Commands

```bash
# All in one:
cd backend
npm install -g @railway/cli
railway login
railway init
railway variables set PORT=5001 NODE_ENV=production ADMIN_EMAIL=admin@supa.com ADMIN_PASS=password123 JWT_SECRET=supreme-tuning-secret-2025 FRONTEND_URL=https://autotuningcalc.netlify.app
railway up
railway domain
```

---

## After Getting Backend URL:

1. Copy your Railway URL
2. Update frontend API URL
3. Rebuild and redeploy frontend

Done! 🎉
