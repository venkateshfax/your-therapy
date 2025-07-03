# 🚀 DEPLOY THERAPYROOM FOR FREE IN 10 MINUTES

**Everything is FREE - No credit card required!**

## 🎯 STEP 1: Get Free Database (2 minutes)

### Option A: Supabase (Recommended - Forever Free)
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (free)
4. Click **"New project"**
5. Name: `therapyroom-db`
6. Password: Create a strong password
7. Region: Choose closest to you
8. Click **"Create new project"**
9. Wait 2 minutes for setup
10. Go to **Settings** → **Database**
11. Scroll to **Connection string**
12. Copy the **URI** (starts with `postgresql://`)

### Option B: Railway (Alternative)
1. Go to **https://railway.app**
2. Sign up with GitHub
3. **"New Project"** → **"Provision PostgreSQL"**
4. Copy connection string from Variables tab

## 🎯 STEP 2: Configure Your App (1 minute)

1. **Update your .env file** with the database URL:
```bash
DATABASE_URL="postgresql://your-copied-connection-string"
NEXTAUTH_SECRET="I6XD7V1P8jPHilN8u64aZ0ukkenbXsli"
NEXTAUTH_URL="http://localhost:3000"
APP_NAME="TherapyRoom"
APP_URL="http://localhost:3000"
```

2. **Set up the database**:
```bash
npm run db:generate
npm run db:push
```

3. **Test locally**:
```bash
npm run dev
```
Visit **http://localhost:3000** and register an account!

## 🎯 STEP 3: Deploy to Vercel (3 minutes)

### Option A: GitHub + Vercel (Recommended)
1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy with Vercel**:
   - Go to **https://vercel.com**
   - Sign up with GitHub (free)
   - Click **"Add New..."** → **"Project"**
   - Import your repository
   - **Environment Variables** → Add these:
   ```
   DATABASE_URL = your-supabase-connection-string
   NEXTAUTH_SECRET = I6XD7V1P8jPHilN8u64aZ0ukkenbXsli
   NEXTAUTH_URL = https://your-app-name.vercel.app
   APP_URL = https://your-app-name.vercel.app
   ```
   - Click **"Deploy"**

### Option B: Direct CLI Deploy
1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel login
vercel
```
Follow prompts, then add environment variables in dashboard.

## 🎯 STEP 4: You're Live! (1 minute)

✅ **Your app is now live at**: `https://your-app-name.vercel.app`

**Test it**:
1. Visit your live URL
2. Register a new account
3. Start a therapy session
4. Chat with the AI therapist!

## 🎯 OPTIONAL: Add OpenAI for Better AI (Free trial available)

1. Get API key from **https://platform.openai.com**
2. Add to environment variables:
```
OPENAI_API_KEY=your-openai-key
```
3. Redeploy

**Without OpenAI**: App works great with built-in intelligent responses!

## 📱 FEATURES YOU GET FOR FREE:

✅ **Beautiful responsive web app**
✅ **User registration & login**
✅ **AI-powered therapy conversations**
✅ **Session management & history**
✅ **Real-time chat interface**
✅ **Secure database storage**
✅ **HTTPS & global CDN**
✅ **Works on all devices**

## 🆘 NEED HELP?

**Common Issues**:
- **Database connection error**: Double-check your DATABASE_URL
- **Build fails**: Run `npm install` and try again
- **Environment variables**: Make sure they're added in Vercel dashboard

**Free Support**:
- Supabase: Discord community
- Vercel: GitHub discussions
- Next.js: Official docs

## 🎉 CONGRATULATIONS!

Your TherapyRoom is now helping people with their mental wellness - completely free!

**What's included**:
- 500MB database storage (Supabase)
- Unlimited page views (Vercel)
- Automatic HTTPS & global CDN
- Serverless functions for APIs
- Real-time therapy conversations

**Share your success**: Your app is ready to help real users! 🌟