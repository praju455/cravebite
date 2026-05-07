# ⚡ Quick Deployment Checklist

Use this checklist to deploy CraveBite in under 30 minutes!

---

## 🎯 Phase 1: Database Setup (5 minutes)

### 1. Create PostgreSQL on Render
- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `cravebite-db`
- [ ] Database: `food_delivery`
- [ ] Click "Create Database"
- [ ] **Copy the External Database URL**

### 2. Load Data
```bash
# In your terminal
psql "YOUR_EXTERNAL_DATABASE_URL" -f backend/db/schema.sql
psql "YOUR_EXTERNAL_DATABASE_URL" -f backend/db/seed.sql
```

### 3. Verify
```bash
psql "YOUR_EXTERNAL_DATABASE_URL" -c "SELECT COUNT(*) FROM restaurants;"
# Should return: 20
```

✅ **Database Ready!**

---

## 🔧 Phase 2: Backend Deployment (10 minutes)

### 1. Create Web Service on Render
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repo
- [ ] Name: `cravebite-api`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`

### 2. Add Environment Variables

Copy these exactly:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Use Internal Database URL from Phase 1]
JWT_SECRET=[Generate: openssl rand -base64 32]
REFRESH_TOKEN_SECRET=[Generate: openssl rand -base64 32]
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

**To generate secrets:**
```bash
openssl rand -base64 32
```

### 3. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] **Copy your backend URL**: `https://cravebite-api.onrender.com`

### 4. Test
```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/restaurants
# Should return JSON with restaurants
```

✅ **Backend Ready!**

---

## 🎨 Phase 3: Frontend Deployment (5 minutes)

### 1. Deploy to Vercel
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repo
- [ ] Framework: `Vite`
- [ ] Root Directory: `frontend`

### 2. Add Environment Variable

```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

**Replace with your actual backend URL from Phase 2**

### 3. Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-5 minutes
- [ ] **Your app is live!** 🎉

✅ **Frontend Ready!**

---

## ✅ Phase 4: Final Testing (5 minutes)

### Test These Features:
- [ ] Open your Vercel URL
- [ ] Landing page loads with amber/orange colors
- [ ] Click "Explore Restaurants"
- [ ] Restaurants load (may take 30-60s first time)
- [ ] Click on a restaurant
- [ ] Add items to cart
- [ ] Login: `rahul@example.com` / `password123`
- [ ] Place an order
- [ ] Admin login: `admin@cravebite.com` / `admin123`
- [ ] View dashboard

---

## 🚨 Quick Troubleshooting

### Backend Returns 500
```bash
# Check Render logs
# Verify DATABASE_URL is the Internal URL
# Ensure all env vars are set
```

### Frontend Shows Localhost Error
```bash
# In Vercel: Settings → Environment Variables
# Update VITE_API_URL to your Render backend URL
# Redeploy
```

### Restaurants Not Loading
```bash
# Wait 60 seconds (backend waking up from sleep)
# Check backend logs in Render
# Verify database has data:
psql "YOUR_DB_URL" -c "SELECT COUNT(*) FROM restaurants;"
```

---

## 📊 Your Deployment URLs

Fill these in as you deploy:

- **Database**: `postgresql://...` (from Render)
- **Backend**: `https://__________.onrender.com`
- **Frontend**: `https://__________.vercel.app`

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Add in Vercel settings
   - Update CORS in backend

2. **Upgrade to Paid** (Recommended for production)
   - Render: $7/month (no sleep)
   - Vercel: $20/month (better performance)

3. **Monitoring**
   - Enable Vercel Analytics
   - Set up Sentry for errors
   - Monitor Render logs

---

## 💡 Pro Tips

- **Free Tier Sleep**: Backend sleeps after 15min. First request takes 30-60s.
- **Keep Awake**: Use UptimeRobot to ping every 10 minutes (free)
- **Database Backups**: Upgrade to Render paid tier for automated backups
- **Performance**: Consider upgrading both services for production use

---

**🎉 Deployment Complete!**

Your CraveBite app is now live and ready for users!

For detailed troubleshooting, see `DEPLOYMENT.md`
