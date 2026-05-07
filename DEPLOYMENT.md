# 🚀 CraveBite Deployment Guide

This guide provides step-by-step instructions for deploying CraveBite to production using **Render** (backend + PostgreSQL) and **Vercel** (frontend).

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with your repository
- ✅ Render account (free tier available)
- ✅ Vercel account (free tier available)
- ✅ All code changes committed and pushed to GitHub

---

## 🗄️ Part 1: Deploy PostgreSQL Database on Render

### Step 1.1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `cravebite-db` (or your preferred name)
   - **Database**: `food_delivery`
   - **User**: `food_delivery_user` (auto-generated)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 14 or higher
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. Wait for database to be provisioned (2-3 minutes)

### Step 1.2: Get Database Connection Details

After creation, you'll see:
- **Internal Database URL**: For connecting from Render services
- **External Database URL**: For connecting from your local machine
- **PSQL Command**: For direct database access

**Copy the External Database URL** - you'll need it for the next step.

Format: `postgresql://user:password@host:port/database`

### Step 1.3: Load Database Schema and Seed Data

Open your terminal and run:

```bash
# Load schema
psql "YOUR_EXTERNAL_DATABASE_URL" -f backend/db/schema.sql

# Load seed data
psql "YOUR_EXTERNAL_DATABASE_URL" -f backend/db/seed.sql
```

**Verify the data loaded:**
```bash
psql "YOUR_EXTERNAL_DATABASE_URL" -c "SELECT COUNT(*) FROM restaurants;"
```

You should see `20` restaurants.

---

## 🔧 Part 2: Deploy Backend API on Render

### Step 2.1: Create Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `cravebite-api`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### Step 2.2: Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render default) |
| `DATABASE_URL` | Your **Internal Database URL** from Step 1.2 |
| `JWT_SECRET` | Generate a strong random string (32+ characters) |
| `REFRESH_TOKEN_SECRET` | Generate another strong random string |
| `JWT_EXPIRES_IN` | `1h` |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` |

**To generate secure secrets:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use online generator: https://randomkeygen.com/
```

### Step 2.3: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://cravebite-api.onrender.com`

### Step 2.4: Verify Backend is Working

Test the API:
```bash
curl https://cravebite-api.onrender.com/api/restaurants
```

You should see JSON with restaurant data.

**⚠️ Important Notes:**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading to paid tier for production use

---

## 🎨 Part 3: Deploy Frontend on Vercel

### Step 3.1: Prepare Frontend for Deployment

1. Make sure your frontend code is pushed to GitHub
2. Ensure `frontend/.env.example` exists (already created)

### Step 3.2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3.3: Add Environment Variable

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cravebite-api.onrender.com/api` |

**Replace with your actual Render backend URL from Step 2.3**

### Step 3.4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://cravebite.vercel.app`

### Step 3.5: Test the Deployment

1. Open your Vercel URL in a browser
2. Navigate to the restaurants page
3. Try logging in with demo credentials:
   - **Customer**: `rahul@example.com` / `password123`
   - **Admin**: `admin@cravebite.com` / `admin123`
4. Test placing an order

---

## 🔍 Part 4: Post-Deployment Verification

### 4.1: Check All Features

- [ ] Landing page loads correctly
- [ ] Restaurant list displays (may take 30-60s on first load if backend was sleeping)
- [ ] Restaurant details page works
- [ ] Login/Register works
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Order tracking works
- [ ] Admin dashboard loads
- [ ] Admin can view orders, users, and stats

### 4.2: Monitor Backend Logs

In Render Dashboard:
1. Go to your backend service
2. Click **"Logs"** tab
3. Watch for any errors

### 4.3: Check Database Connections

```bash
# Connect to your production database
psql "YOUR_EXTERNAL_DATABASE_URL"

# Check tables
\dt

# Check restaurant count
SELECT COUNT(*) FROM restaurants;

# Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

---

## 🐛 Common Deployment Issues & Fixes

### Issue 1: Backend Returns 500 Error

**Symptoms:** Frontend shows "Failed to load restaurants"

**Causes & Fixes:**
1. **Database not connected**
   - Check `DATABASE_URL` in Render environment variables
   - Ensure it's the **Internal Database URL**
   - Verify database has schema and seed data loaded

2. **Missing environment variables**
   - Check all required env vars are set in Render
   - Especially `JWT_SECRET` and `REFRESH_TOKEN_SECRET`

3. **Build failed**
   - Check Render logs for build errors
   - Ensure `backend/package.json` has correct scripts

**Fix:**
```bash
# Re-deploy backend
# In Render Dashboard → Your Service → Manual Deploy → Deploy latest commit
```

### Issue 2: Frontend Shows CORS Error

**Symptoms:** Browser console shows CORS policy error

**Cause:** Backend CORS not configured for frontend domain

**Fix:**
Update `backend/src/app.ts`:
```typescript
app.use(cors({
  origin: ['https://cravebite.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

Then redeploy backend.

### Issue 3: Frontend API Calls Go to Localhost

**Symptoms:** Network tab shows requests to `localhost:5001`

**Cause:** `VITE_API_URL` not set correctly in Vercel

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy frontend

### Issue 4: Backend Sleeps on Free Tier

**Symptoms:** First request takes 30-60 seconds

**Cause:** Render free tier services sleep after 15 minutes of inactivity

**Solutions:**
1. **Upgrade to paid tier** ($7/month) - Recommended for production
2. **Use a ping service** to keep backend awake:
   - [UptimeRobot](https://uptimerobot.com/) (free)
   - [Cron-job.org](https://cron-job.org/) (free)
   - Set to ping your backend every 10 minutes

### Issue 5: Database Connection Pool Exhausted

**Symptoms:** "too many clients" error in logs

**Cause:** Too many concurrent connections

**Fix:**
Update `backend/src/config/db.ts`:
```typescript
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Limit connections for free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Issue 6: Images Not Loading

**Symptoms:** Restaurant/food images show broken

**Cause:** Unsplash URLs may be blocked or rate-limited

**Fix:**
1. Use your own image hosting (Cloudinary, AWS S3)
2. Or update seed data with different image URLs

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords in seed data
- [ ] Use strong, unique JWT secrets (32+ characters)
- [ ] Enable HTTPS only (Vercel and Render do this automatically)
- [ ] Set up proper CORS origins (not `*`)
- [ ] Review and limit API rate limits
- [ ] Set up database backups (Render paid tier)
- [ ] Add monitoring (Sentry, LogRocket, etc.)
- [ ] Review and remove any console.log statements
- [ ] Set up proper error logging
- [ ] Add environment-specific configs

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring

1. **Backend Monitoring (Render)**
   - Enable email alerts for service failures
   - Monitor response times in Render dashboard
   - Set up log aggregation (Papertrail, Logtail)

2. **Frontend Monitoring (Vercel)**
   - Enable Vercel Analytics (free)
   - Set up error tracking (Sentry)
   - Monitor Core Web Vitals

3. **Database Monitoring (Render)**
   - Monitor connection count
   - Check query performance
   - Set up automated backups (paid tier)

### Regular Maintenance

- **Weekly**: Check error logs
- **Monthly**: Review database size and performance
- **Quarterly**: Update dependencies and security patches

---

## 💰 Cost Breakdown

### Free Tier (Development/Testing)
- **Render PostgreSQL**: Free (1GB storage, shared CPU)
- **Render Web Service**: Free (512MB RAM, sleeps after 15min)
- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Total**: $0/month

### Production Tier (Recommended)
- **Render PostgreSQL**: $7/month (256MB RAM, 1GB storage)
- **Render Web Service**: $7/month (512MB RAM, always on)
- **Vercel Pro**: $20/month (1TB bandwidth, better performance)
- **Total**: $34/month

---

## 🎯 Next Steps After Deployment

1. **Custom Domain**
   - Add custom domain in Vercel settings
   - Update CORS in backend to include custom domain

2. **SSL Certificate**
   - Vercel provides automatic SSL
   - Render provides automatic SSL

3. **Email Service**
   - Set up SendGrid or AWS SES for OTP emails
   - Update auth service to send real emails

4. **Payment Integration**
   - Integrate Razorpay or Stripe
   - Update payment flow in frontend and backend

5. **Analytics**
   - Add Google Analytics
   - Set up conversion tracking

6. **SEO**
   - Add meta tags
   - Create sitemap
   - Submit to Google Search Console

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is deployed correctly:

### Pre-Deployment
- [ ] All code changes committed and pushed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` files created for documentation
- [ ] Database schema and seed files are ready
- [ ] All dependencies are in `package.json`

### Database Deployment
- [ ] PostgreSQL database created on Render
- [ ] Schema loaded successfully
- [ ] Seed data loaded successfully
- [ ] Database connection tested

### Backend Deployment
- [ ] Web service created on Render
- [ ] All environment variables set
- [ ] Build completed successfully
- [ ] Service is running
- [ ] API endpoints tested and working

### Frontend Deployment
- [ ] Project imported to Vercel
- [ ] `VITE_API_URL` environment variable set
- [ ] Build completed successfully
- [ ] Site is live and accessible
- [ ] All pages load correctly

### Post-Deployment
- [ ] All features tested end-to-end
- [ ] Login/Register works
- [ ] Orders can be placed
- [ ] Admin dashboard accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance is acceptable

---

**🎉 Congratulations! Your CraveBite app is now live!**

Share your deployment URL and start getting users! 🚀
