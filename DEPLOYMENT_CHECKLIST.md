# 🚀 Deployment Checklist

## ✅ Railway Backend Setup

### Environment Variables (Railway Dashboard → Variables)
- [ ] `OPENAI_API_KEY` = `your-openai-key`
- [ ] `STRIPE_SECRET_KEY` = `your-stripe-key`
- [ ] `STRIPE_PRICE_ID` = `your-price-id` (optional)
- [ ] `FRONTEND_URL` = `https://your-vercel-app.vercel.app`
- [ ] `CLIENT_URL` = `https://your-vercel-app.vercel.app` (alternative)
- [ ] `MONTHLY_GENERATION_LIMIT` = `8`
- [ ] `MAX_TOKENS_PER_REQUEST` = `10000`
- [ ] `MONTHLY_TOKEN_LIMIT` = `100000`

### Get Your Railway URL
1. Go to [railway.app](https://railway.app)
2. Open your backend project
3. Go to **Settings → Domains**
4. Copy the URL (example: `https://innerlevel-backend.up.railway.app`)

---

## ✅ Vercel Frontend Setup

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)
- [ ] `VITE_SUPABASE_URL` = `https://gmhrfgxiylwyxodeawrt.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `sb_publishable_4EhRo3C87utDeeq9eZFFPA_kA5bd0jz`
- [ ] `VITE_API_URL` = `https://your-railway-backend.up.railway.app` ⚠️ **UPDATE THIS**
- [ ] `VITE_APP_URL` = `https://your-vercel-app.vercel.app`
- [ ] `VITE_STRIPE_PUBLIC_KEY` = `pk_test_...`

### After Setting Variables
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

---

## 🧪 Testing

### 1. Test Railway Backend
```bash
# Replace with your Railway URL
curl https://your-railway-backend.up.railway.app/health

# Should return:
# {"status":"OK","timestamp":"...","services":{...}}
```

### 2. Test Vercel Frontend
1. Open your Vercel app URL
2. Open browser console (F12)
3. Look for:
   - ✅ "User found, loading data..."
   - ✅ "OpenAI response received successfully"
   - ❌ No "ERR_CONNECTION_REFUSED" errors

### 3. Test OpenAI Integration
1. Go to the Mystic Forge page
2. Click "Forge New Cards"
3. Should see mystical messages, not connection errors

---

## 🔍 Troubleshooting

### Issue: Still seeing `localhost:5000` errors
**Solution:** Make sure you redeployed Vercel AFTER setting `VITE_API_URL`

### Issue: CORS errors
**Solution:** Check Railway `FRONTEND_URL` matches your Vercel URL exactly

### Issue: Railway backend not responding
**Solution:** Check Railway logs for errors, make sure it's deployed and running

### Issue: OpenAI quota exceeded
**Solution:** Wait until next month or upgrade plan (or contact Railway to reset)

---

## 📝 Current Setup

- **Frontend:** Vercel (https://your-app.vercel.app)
- **Backend:** Railway (https://your-backend.up.railway.app)
- **Database:** Supabase (https://gmhrfgxiylwyxodeawrt.supabase.co)
- **Payments:** Stripe
- **AI:** OpenAI GPT-4o-mini

---

## 🎯 Quick Commands

### Check Railway Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Local Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server && npm run dev
```
