# 🚀 Deployment Guide for InnerLevel App

## Environment Variables Setup

### Frontend Environment Variables (.env)
Create a `.env` file in your project root:

```bash
# Frontend URLs
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://your-api-domain.com

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Environment Variables (.env in server folder)
Create a `.env` file in your `server/` folder:

```bash
# Server Configuration
FRONTEND_URL=https://your-domain.com
MONTHLY_GENERATION_LIMIT=8
MAX_TOKENS_PER_REQUEST=2000

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Deployment Steps

### 1. Frontend Deployment (Vercel/Netlify)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - `VITE_APP_URL` = `https://your-app.vercel.app`
   - `VITE_API_URL` = `https://your-api-domain.com`
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 2. Backend Deployment (Railway/Heroku/DigitalOcean)

1. **Deploy your server:**
   ```bash
   cd server
   # Deploy using your preferred platform
   ```

2. **Set environment variables:**
   - `FRONTEND_URL` = `https://your-app.vercel.app`
   - `OPENAI_API_KEY` = your OpenAI API key
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_PRICE_ID` = your Stripe price ID
   - `STRIPE_WEBHOOK_SECRET` = your Stripe webhook secret

### 3. Update Stripe Configuration

1. **Update Stripe Checkout URLs:**
   - Success URL: `https://your-domain.com/payment/success`
   - Cancel URL: `https://your-domain.com/ai-card-generator`

2. **Update Stripe Webhook URL:**
   - Webhook URL: `https://your-api-domain.com/stripe-webhook`

## Route Configuration

The app now uses React Router with these routes:

- **Main App**: `https://your-domain.com/`
- **Payment Success**: `https://your-domain.com/payment/success`

## Environment Detection

The app automatically detects the environment:

- **Development**: Uses `localhost:5176` and `localhost:5000`
- **Production**: Uses your configured domain URLs

## Testing After Deployment

1. **Test main app**: Visit `https://your-domain.com/`
2. **Test payment flow**: Complete a test payment
3. **Test payment success**: Visit `https://your-domain.com/payment/success`
4. **Test API calls**: Generate some AI cards

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows your frontend domain
2. **API Not Found**: Check that `VITE_API_URL` points to your deployed backend
3. **Payment Redirects**: Verify Stripe URLs use HTTPS in production
4. **Environment Variables**: Ensure all required variables are set

### Debug Commands:

```bash
# Check if environment variables are loaded
console.log(import.meta.env.VITE_APP_URL)

# Test API connection
curl https://your-api-domain.com/health
```

## Security Notes

- Never commit `.env` files to version control
- Use HTTPS in production
- Set up proper CORS policies
- Use environment-specific API keys
- Enable Stripe webhook signature verification

## Support

If you encounter issues during deployment, check:
1. Environment variables are correctly set
2. URLs use HTTPS in production
3. CORS is properly configured
4. All services (Supabase, OpenAI, Stripe) are accessible
