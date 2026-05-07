# 🚀 START DEPLOYMENT - CraveBite

**All code is ready and pushed to GitHub!** Follow this guide to deploy in 30 minutes.

---

## ✅ Pre-Deployment Checklist

- [x] All code changes committed and pushed
- [x] Color scheme updated (amber/orange)
- [x] Landing page content updated
- [x] Redis made optional
- [x] Menu items loading correctly
- [x] Text readable in light/dark mode
- [ ] Ready to deploy!

---

## 🎯 DEPLOYMENT STEPS

### 📍 **PHASE 1: Database (5 minutes)**

#### 1. Create PostgreSQL on Render

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `cravebite-db`
   - Database: `food_delivery`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning

#### 2. Copy Database URLs

After creation, you'll see two URLs:
- **Internal Database URL** - For backend service (starts with `postgresql://`)
- **External Database URL** - For loading data (starts with `postgresql://`)

**📋 Copy BOTH URLs and save them!**

#### 3. Load Schema and Data

Open your terminal and run:

```bash
# Replace YOUR_EXTERNAL_URL with the External Database URL from Render
psql "YOUR_EXTERNAL_URL" -f backend/db/schema.sql
psql "YOUR_EXTERNAL_URL" -f backend/db/seed.sql
```

**Verify data loaded:**
```bash
psql "YOUR_EXTERNAL_URL" -c "SELECT COUNT(*) FROM restaurants;"
# Should show: 20
```

✅ **Database Ready!**

---

### 📍 **PHASE 2: Backend API (10 minutes)**

#### 1. Create Web Service on Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** and authorize
3. Select your repository: `cravebite`
4. Settings:
   - Name: `cravebite-api`
   - Region: **Same as database**
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**

#### 2. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **EXACTLY**:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Paste Internal Database URL from Phase 1]
JWT_SECRET=[Generate below]
REFRESH_TOKEN_SECRET=[Generate below]
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Generate Secrets:**
```bash
# Run this twice to get two different secrets
openssl rand -base64 32
```

Or use: https://randomkeygen.com/ (use "Fort Knox Passwords")

#### 3. Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for "Server listening on port"
4. **Copy your backend URL**: `https://cravebite-api-XXXX.onrender.com`

#### 4. Test Backend

```bash
# Replace with your actual backend URL
curl https://YOUR-BACKEND-URL.onrender.com/api/restaurants
```

Should return JSON with restaurants.

✅ **Backend Ready!**

---

### 📍 **PHASE 3: Frontend (5 minutes)**

#### 1. Deploy to Vercel

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `cravebite` repository
5. Settings:
   - Framework Preset: `Vite` (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

#### 2. Add Environment Variable

In **"Environment Variables"** section:

```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

**⚠️ Replace with your actual backend URL from Phase 2!**

#### 3. Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-5 minutes
3. **Your app is live!** 🎉

You'll get a URL like: `https://cravebite-XXXX.vercel.app`

✅ **Frontend Ready!**

---

### 📍 **PHASE 4: Testing (5 minutes)**

#### Test These Features:

1. **Landing Page**
   - [ ] Opens correctly
   - [ ] Amber/orange colors showing
   - [ ] "Explore Restaurants" button works

2. **Restaurants Page**
   - [ ] Restaurants load (may take 30-60s first time)
   - [ ] Can click on a restaurant
   - [ ] Menu items load correctly
   - [ ] Text readable in light/dark mode

3. **User Flow**
   - [ ] Can register: Click "Login" → "Sign up"
   - [ ] Can login: `rahul@example.com` / `password123`
   - [ ] Can add items to cart
   - [ ] Can place order

4. **Admin Flow**
   - [ ] Admin login works: `admin@cravebite.com` / `admin123`
   - [ ] Dashboard loads
   - [ ] Can see orders, users, stats

✅ **All Features Working!**

---

## 🐛 TROUBLESHOOTING

### Issue: Backend Returns 500 Error

**Check:**
1. Render logs: Dashboard → Your Service → Logs
2. Verify `DATABASE_URL` is the **Internal** URL
3. Ensure all environment variables are set

**Fix:**
```bash
# Verify database has data
psql "YOUR_EXTERNAL_URL" -c "SELECT COUNT(*) FROM restaurants;"
```

### Issue: Frontend Shows "Failed to load restaurants"

**Check:**
1. Backend is running (check Render dashboard)
2. `VITE_API_URL` is correct in Vercel
3. Wait 60 seconds (backend waking up from sleep)

**Fix:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to correct backend URL
3. Redeploy: Deployments → Latest → Redeploy

### Issue: CORS Error in Browser Console

**Fix:**
Update `backend/src/app.ts`:
```typescript
app.use(cors({
  origin: ['https://YOUR-VERCEL-URL.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

Then redeploy backend on Render.

### Issue: Backend Slow on First Request

**This is normal!** Free tier services sleep after 15 minutes.
- First request takes 30-60 seconds
- Subsequent requests are fast
- Upgrade to paid tier ($7/month) for always-on service

---

## 💰 COST BREAKDOWN

### Free Tier (Perfect for Testing)
- PostgreSQL: Free (1GB storage)
- Backend: Free (sleeps after 15min)
- Frontend: Free (100GB bandwidth)
- **Total: $0/month**

### Production Tier (Recommended)
- PostgreSQL: $7/month (always-on, backups)
- Backend: $7/month (always-on, 512MB RAM)
- Frontend: $20/month (Vercel Pro)
- **Total: $34/month**

---

## 🎯 AFTER DEPLOYMENT

### 1. Update CORS (Important!)

In `backend/src/app.ts`, update:
```typescript
app.use(cors({
  origin: [
    'https://YOUR-VERCEL-URL.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Commit and push, Render will auto-deploy.

### 2. Custom Domain (Optional)

**Vercel:**
1. Settings → Domains → Add Domain
2. Follow DNS instructions

**Update Backend CORS:**
Add your custom domain to the CORS origins list.

### 3. Keep Backend Awake (Free Tier)

Use **UptimeRobot** (free):
1. Sign up: https://uptimerobot.com/
2. Add monitor: Your backend URL
3. Check interval: 10 minutes
4. Prevents backend from sleeping

### 4. Monitor Your App

**Vercel Analytics:**
- Enable in Vercel Dashboard (free)
- Track page views and performance

**Render Logs:**
- Check regularly for errors
- Set up email alerts

---

## 📊 YOUR DEPLOYMENT URLS

Fill these in as you deploy:

```
Database (External): postgresql://...
Database (Internal): postgresql://...
Backend URL: https://__________.onrender.com
Frontend URL: https://__________.vercel.app
```

---

## 🎉 SUCCESS CHECKLIST

After deployment, verify:

- [ ] Landing page loads with amber/orange colors
- [ ] Restaurants page shows 20 restaurants
- [ ] Can click restaurant and see menu items
- [ ] Text readable in both light/dark modes
- [ ] Can register and login
- [ ] Can add items to cart
- [ ] Can place orders
- [ ] Admin dashboard works
- [ ] No console errors
- [ ] Mobile responsive

---

## 📞 NEED HELP?

### Check These First:
1. **Render Logs**: Dashboard → Service → Logs
2. **Vercel Logs**: Dashboard → Project → Deployments → View Function Logs
3. **Browser Console**: F12 → Console tab

### Common Solutions:
- **500 Error**: Check DATABASE_URL and environment variables
- **CORS Error**: Update backend CORS settings
- **Slow Loading**: Normal on free tier, wait 60 seconds
- **No Data**: Re-run seed.sql on database

### Documentation:
- Full Guide: `DEPLOYMENT.md` in your repo
- Quick Guide: `QUICK-DEPLOY.md` in your repo
- Changes: `CHANGES-SUMMARY.md` in your repo

---

## 🚀 READY TO DEPLOY?

**Your app is 100% ready!** Just follow the steps above.

**Estimated Time:** 30 minutes
**Difficulty:** Easy (copy-paste commands)
**Cost:** Free (or $34/month for production)

---

**🎯 START NOW: Go to Phase 1 and begin deployment!**

Good luck! Your CraveBite app is going live! 🍕🚀
