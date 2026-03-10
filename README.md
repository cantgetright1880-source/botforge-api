# BotForge API

Backend API for BotForge chatbot platform.

## Deploy to Vercel

1. **Push to GitHub:**
```bash
cd botforge-api
git init
git add .
git commit -m "BotForge API"
gh repo create botforge-api --public
git push origin main
```

2. **Deploy on Vercel:**
- Go to https://vercel.com
- Import the repo
- Add environment variables:
  - `SUPABASE_URL` = https://gbrokctvkftmatyrlueq.supabase.co
  - `SUPABASE_SERVICE_ROLE_KEY` = (your key from Supabase)
  - `STRIPE_SECRET_KEY` = (your Stripe secret key)
  - `STRIPE_WEBHOOK_SECRET` = (create in Stripe dashboard)

3. **Deploy!**

## API Endpoints

### POST /api/chat
Chat with bots (Anna, Max, Chloe, Viva)

```json
{
  "botId": "anna",
  "message": "What are your prices?",
  "userId": "user123",
  "conversationId": "conv-123"
}
```

### POST /api/leads
Capture leads from chat or forms

```json
{
  "name": "John",
  "email": "john@example.com",
  "business": "Acme Inc",
  "message": "Interested in Professional plan",
  "tierInterest": "professional"
}
```

### POST /api/webhook
Stripe webhook for payment events

## Supabase Tables

Already created:
- customers
- conversations
- leads
- subscriptions
