# 🚀 Deploying TherapyRoom to Vercel

This guide will walk you through deploying the TherapyRoom application to Vercel with a PostgreSQL database.

## Prerequisites

- ✅ Vercel CLI installed globally (`npm install -g vercel`)
- ✅ GitHub/GitLab account for code repository
- ✅ Vercel account (free tier available)

## Step 1: Set Up Vercel Postgres Database

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Create a new project**
   ```bash
   vercel --prod
   ```

3. **Add Vercel Postgres**
   - Go to your project dashboard on [vercel.com](https://vercel.com)
   - Navigate to the "Storage" tab
   - Click "Create Database" → "Postgres"
   - Choose a name for your database
   - Select your preferred region

4. **Get Database URLs**
   - After creating the database, go to the "Settings" tab
   - Copy the `DATABASE_URL` and `DIRECT_URL` (if available)

## Step 2: Configure Environment Variables

1. **In Vercel Dashboard**
   - Go to your project → Settings → Environment Variables
   - Add the following variables:

   ```bash
   # Required
   DATABASE_URL=your-postgres-connection-string
   DIRECT_URL=your-postgres-direct-connection-string
   NEXTAUTH_SECRET=your-32-character-secret-key
   NEXTAUTH_URL=https://your-app-name.vercel.app

   # Optional - for AI features
   OPENAI_API_KEY=your-openai-api-key

   # Optional - for email features
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # Application
   APP_NAME=TherapyRoom
   APP_URL=https://your-app-name.vercel.app
   ```

2. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Deploy to Vercel

### Option A: CLI Deployment

1. **Initialize Vercel project**
   ```bash
   vercel
   ```

2. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option B: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure build settings (auto-detected)
   - Add environment variables
   - Deploy

## Step 4: Run Database Migrations

After deployment, run the database migration:

1. **In Vercel Dashboard**
   - Go to your project → Functions
   - Find any API function and open its logs
   - Or use Vercel CLI:

   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Alternative: Create migration script**
   Create an API endpoint at `/api/migrate` for one-time setup:
   ```typescript
   // pages/api/migrate.ts (temporary)
   import { prisma } from '@/lib/db'
   
   export default async function handler(req, res) {
     try {
       await prisma.$executeRaw`
         -- Your SQL migration here
       `
       res.json({ success: true })
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
   }
   ```

## Step 5: Verify Deployment

1. **Test the application**
   - Visit your Vercel URL
   - Register a new account
   - Start a therapy session
   - Verify AI responses work

2. **Check logs**
   ```bash
   vercel logs
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` is correctly set
   - Check if database is in the same region as your function

2. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding variables

3. **Build Errors**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are installed

4. **API Function Timeouts**
   - Increase function timeout in `vercel.json`
   - Optimize database queries

### Performance Optimization

1. **Database Connection Pooling**
   ```typescript
   // Add to prisma client
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
   })
   ```

2. **Edge Functions**
   - Consider using Edge Runtime for faster responses
   - Add `export const runtime = 'edge'` to API routes

## Security Checklist

- ✅ Environment variables are secure
- ✅ Database is not publicly accessible
- ✅ HTTPS is enforced
- ✅ Sensitive data is not in logs
- ✅ CORS is properly configured

## Post-Deployment

1. **Set up monitoring**
   - Configure Vercel Analytics
   - Set up error tracking

2. **Configure custom domain** (optional)
   - Add your domain in Vercel dashboard
   - Update `NEXTAUTH_URL` and `APP_URL`

3. **Set up email service**
   - Configure SMTP credentials
   - Test welcome emails

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review application logs
3. Test database connectivity
4. Verify environment variables

---

**Deployment URL**: https://your-app-name.vercel.app

🎉 **Congratulations!** Your TherapyRoom application is now live and ready to help users with their mental wellness journey.