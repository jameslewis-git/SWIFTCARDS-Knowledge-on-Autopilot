# 🚀 Supabase Setup Guide for SWIFTCARDS

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `swiftcards-app`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your API Keys

1. Go to your project dashboard
2. Click "Settings" → "API"
3. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Environment Variables

Add these to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep existing variables
MONGODB_URI=mongodb://localhost:27017/swiftcards
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 4: Set Up Database Schema

1. Go to your Supabase dashboard
2. Click "SQL Editor"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the schema

## Step 5: Configure Authentication

1. Go to "Authentication" → "Settings"
2. Configure email templates (optional)
3. Set up redirect URLs:
   - Add: `http://localhost:3000/auth/callback`
   - Add: `https://your-domain.netlify.app/auth/callback`

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Check Supabase dashboard → "Authentication" → "Users"
4. Check "Table Editor" to see if data is being created

## Step 7: Deploy to Production

When deploying to Netlify, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Add your domain to Supabase Auth settings
2. **RLS Policies**: Make sure Row Level Security is enabled
3. **API Key Issues**: Verify your anon key is correct
4. **Database Connection**: Check if schema was applied correctly

### Useful Supabase Dashboard Sections:

- **Authentication** → **Users**: See registered users
- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **API**: View API documentation
- **Settings** → **API**: Get your keys

## Next Steps

After setup:
1. Test user registration/login
2. Test flashcard creation
3. Test data persistence
4. Deploy to Netlify
5. Configure custom domain 