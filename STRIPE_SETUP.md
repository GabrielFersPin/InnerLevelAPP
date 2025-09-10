# 🔧 Stripe Setup Guide

## The Issue
The payment system shows "Payment system is currently unavailable" because Stripe is not configured in your server.

## Quick Fix

### 1. Create Environment File
Create a file called `.env` in your `server/` directory with this content:

```bash
# Server Configuration
FRONTEND_URL=http://localhost:5176
MONTHLY_GENERATION_LIMIT=8
MAX_TOKENS_PER_REQUEST=2000

# OpenAI API (replace with your actual key)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration (replace with your actual keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PRICE_ID=price_your_stripe_price_id_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Get Stripe Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/apikeys
2. **Copy Secret Key**: Replace `sk_test_your_stripe_secret_key_here` with your actual secret key
3. **Create a Product**: 
   - Go to Products → Add Product
   - Name: "InnerLevel Premium"
   - Price: $9.99/month
   - Copy the Price ID and replace `price_your_stripe_price_id_here`

### 3. Restart Server
After creating the `.env` file, restart your server:

```bash
cd server
npm run dev
```

You should see:
```
✅ Stripe configured
```

### 4. Test Payment
1. Go to your app and try to generate cards until you hit the limit
2. Click "Upgrade to Premium"
3. You should be redirected to Stripe checkout

## Alternative: Test Mode
If you don't want to set up Stripe right now, you can test the payment success page directly:

Visit: `http://localhost:5176/payment/success?session_id=test_session`

## Troubleshooting

### Still getting "Payment system unavailable"?
1. Check that `.env` file exists in `server/` directory
2. Verify Stripe keys are correct (start with `sk_test_`)
3. Restart the server after adding the `.env` file
4. Check server console for error messages

### Server not starting?
1. Make sure you're in the `server/` directory
2. Run `npm install` if you haven't already
3. Check that all required packages are installed

## Production Setup
For production, you'll need:
- Real Stripe keys (not test keys)
- Webhook endpoint configured
- HTTPS URLs for success/cancel pages
- Environment variables set on your hosting platform
