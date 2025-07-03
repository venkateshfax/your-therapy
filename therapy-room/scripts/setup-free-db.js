#!/usr/bin/env node

/**
 * TherapyRoom Free Database Setup Script
 * This script helps you set up a free PostgreSQL database for your TherapyRoom app
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 TherapyRoom Free Database Setup');
console.log('=====================================\n');

console.log('Choose a FREE database provider:\n');
console.log('1. 🐘 Supabase (Recommended) - Free PostgreSQL with 500MB storage');
console.log('2. 🚂 Railway - Free PostgreSQL with 1GB storage');
console.log('3. 🌍 Neon - Free PostgreSQL with 3GB storage');
console.log('4. ⚡ PlanetScale - Free MySQL (requires schema changes)');

console.log('\n📋 RECOMMENDED SETUP STEPS:');
console.log('==============================\n');

console.log('🔥 OPTION 1: Supabase (Easiest & Free Forever)');
console.log('1. Go to https://supabase.com');
console.log('2. Sign up for free account');
console.log('3. Create new project');
console.log('4. Go to Settings > Database');
console.log('5. Copy the connection string');
console.log('6. Update your .env file with DATABASE_URL');

console.log('\n🔥 OPTION 2: Railway (Great for beginners)');
console.log('1. Go to https://railway.app');
console.log('2. Sign up with GitHub');
console.log('3. Create new project');
console.log('4. Add PostgreSQL service');
console.log('5. Copy connection string from Variables tab');

console.log('\n🔥 OPTION 3: Neon (Generous free tier)');
console.log('1. Go to https://neon.tech');
console.log('2. Sign up for free');
console.log('3. Create database');
console.log('4. Copy connection string');

console.log('\n📝 Your .env file should look like this:');
console.log('=====================================');

const envExample = `
# Database (replace with your connection string)
DATABASE_URL="postgresql://username:password@host:5432/database"

# Authentication (generate a random 32-character string)
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional - OpenAI for better AI responses
OPENAI_API_KEY="your-openai-key-optional"

# Optional - Email service
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# App settings
APP_NAME="TherapyRoom"
APP_URL="http://localhost:3000"
`;

console.log(envExample);

console.log('\n🚀 After setting up your database:');
console.log('=====================================');
console.log('1. Update your .env file with the DATABASE_URL');
console.log('2. Run: npm run db:generate');
console.log('3. Run: npm run db:push');
console.log('4. Run: npm run dev');
console.log('5. Open http://localhost:3000');

console.log('\n🎉 Ready to deploy to Vercel:');
console.log('==============================');
console.log('1. Run: vercel login');
console.log('2. Run: vercel');
console.log('3. Add environment variables in Vercel dashboard');
console.log('4. Visit your live app!');

// Generate a random secret for NEXTAUTH_SECRET
const generateSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

console.log('\n🔐 Generated NEXTAUTH_SECRET for you:');
console.log('=====================================');
console.log(generateSecret());
console.log('\n⚠️  Copy this secret to your .env file!');

console.log('\n📚 Need help? Check these links:');
console.log('================================');
console.log('• Supabase: https://supabase.com/docs/guides/database');
console.log('• Railway: https://docs.railway.app/databases/postgresql');
console.log('• Neon: https://neon.tech/docs/get-started-with-neon');
console.log('• Vercel: https://vercel.com/docs/concepts/projects/environment-variables');

console.log('\n✨ Your TherapyRoom app will be live and helping users in minutes!');