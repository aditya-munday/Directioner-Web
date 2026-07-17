# Directioner — Complete Setup Guide

## Prerequisites
- Supabase account (free): https://supabase.com
- Razorpay account (test mode): https://razorpay.com
- Node.js 22+ and pnpm

---

## 1. Supabase — Database & Auth

### 1a. Create a project
1. Go to https://supabase.com/dashboard → **New project**
2. Choose a region close to your users, set a strong DB password
3. Wait ~2 minutes for provisioning

### 1b. Apply the schema
1. Open your project → **SQL Editor** → **New query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** (Ctrl + Enter)
4. Verify: you should see 6 tables + 3 functions in the **Table Editor**

### 1c. Get your API keys
Go to **Settings → API**:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`
- **service_role key** (secret, never expose!) → `SUPABASE_SERVICE_ROLE_KEY`

### 1d. Get your database connection string
Go to **Settings → Database → Connection string → URI mode**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
→ `DATABASE_URL`

---

## 2. OAuth Providers (Discord + Google)

### Discord OAuth
1. Go to https://discord.com/developers/applications → **New Application**
2. Under **OAuth2 → General**:
   - Copy **Client ID** and **Client Secret**
3. Add redirect URI: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
4. In Supabase: **Authentication → Providers → Discord**
   - Paste Client ID + Secret → Save

### Google OAuth
1. Go to https://console.cloud.google.com → **APIs & Services → Credentials**
2. Create **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
4. In Supabase: **Authentication → Providers → Google**
   - Paste Client ID + Secret → Save

### Configure allowed redirect URLs
In Supabase: **Authentication → URL Configuration**:
- **Site URL**: `https://your-app.replit.app` (or your domain)
- **Redirect URLs**: add `https://your-app.replit.app/auth/callback`

---

## 3. Razorpay — Payments

### 3a. Get API keys
1. Go to https://dashboard.razorpay.com → **Settings → API Keys**
2. Generate keys (use **Test Mode** keys during development)
3. Copy **Key ID** → `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
4. Copy **Key Secret** → `RAZORPAY_KEY_SECRET`

### 3b. Set up webhook (optional but recommended)
1. Razorpay Dashboard → **Webhooks → Add new webhook**
2. URL: `https://your-api-domain.com/api/billing/webhook`
3. Secret: use your `RAZORPAY_KEY_SECRET`
4. Events: select **payment.captured**, **payment.failed**

---

## 4. Environment Variables

Add these to **Replit Secrets** (padlock icon in the sidebar):

```env
# Supabase
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...           # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service_role key (secret!)
DATABASE_URL=postgresql://...            # full connection string

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_...       # safe to expose to frontend
RAZORPAY_KEY_SECRET=...                  # server-side only!

# API Server URL (frontend needs this to reach the API)
VITE_API_URL=https://your-api.replit.app/api
```

---

## 5. Running locally with Docker

```bash
# Copy env example and fill in values
cp .env.example .env

# Build and start all services
docker compose up --build

# Frontend:  http://localhost
# API:       http://localhost:3001/api
# Database:  localhost:5432 (local postgres)
```

**Note:** The local Docker postgres is for development only. In production, use Supabase's hosted PostgreSQL.

---

## 6. Running on Replit (development)

Once secrets are set, the two workflows start automatically:
- **Frontend** (port 5000): Vite dev server with HMR
- **API Server** (port 8080): Express with live rebuild

Reload the preview pane — you should see the login page. Register an account, and demo data is seeded automatically on first sign-in.

---

## 7. Deployment checklist

- [ ] `NODE_ENV=production` set in Replit deployment env
- [ ] All 6 secrets set above
- [ ] Supabase schema applied
- [ ] OAuth redirect URLs updated to production domain
- [ ] Razorpay switched to **Live Mode** keys
- [ ] Razorpay webhook URL updated to production API URL
- [ ] `ALLOWED_ORIGIN` set to your frontend production domain
