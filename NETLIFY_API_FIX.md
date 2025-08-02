# 🚨 Netlify API Routes Fix

## ❌ **Current Problem:**
- API routes returning 404 on Netlify
- Upload functionality not working
- `/api/test-env/` and `/api/hello/` not accessible

## 🔍 **Root Cause:**
Netlify is not properly handling Next.js API routes. This is a common issue when deploying Next.js apps with API routes to Netlify.

## 🔧 **Solution Steps:**

### **Step 1: Verify Netlify Plugin Installation**

Check if `@netlify/plugin-nextjs` is installed:
```bash
npm list @netlify/plugin-nextjs
```

If not installed:
```bash
npm install @netlify/plugin-nextjs --save-dev --legacy-peer-deps
```

### **Step 2: Update Netlify Configuration**

**Current `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### **Step 3: Alternative Configuration**

If the above doesn't work, try this simpler configuration:

**Alternative `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### **Step 4: Check Netlify Dashboard**

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/
   - Select your **swiftcardss** site

2. **Check Build Settings:**
   - Go to **Site settings** → **Build & deploy**
   - Verify:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
     - **Node version**: 18

3. **Check Functions:**
   - Go to **Functions** tab
   - Look for any API route functions
   - Check for any errors

### **Step 5: Manual Deploy Trigger**

1. **Trigger a fresh deploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait for build to complete

2. **Check build logs:**
   - Click on the latest deploy
   - Look for any errors in the build process
   - Check if API routes are being built

### **Step 6: Test API Routes**

After deployment, test these endpoints:

1. **Simple test:**
   - Visit: `https://swiftcardss.netlify.app/api/hello`
   - Should return JSON response

2. **Environment test:**
   - Visit: `https://swiftcardss.netlify.app/api/test-env`
   - Should show environment variables status

### **Step 7: Set Environment Variables**

If API routes work but environment variables are missing:

1. **Go to Environment Variables:**
   - Site settings → **Environment variables**

2. **Add these variables:**
   ```
   GOOGLE_GENERATIVE_AI_API_KEY = your_google_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

3. **Trigger new deploy after adding variables**

## 🚀 **Deployment Commands:**

```bash
# Commit and push changes
git add .
git commit -m "Fix Netlify API routes configuration"
git push origin main

# Check if plugin is installed
npm list @netlify/plugin-nextjs

# Install plugin if missing
npm install @netlify/plugin-nextjs --save-dev --legacy-peer-deps
```

## 🔍 **Debugging Steps:**

1. **Check if API routes work locally:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/hello
   ```

2. **Check Netlify build logs:**
   - Look for any errors during build
   - Check if API routes are being processed

3. **Check Netlify Functions:**
   - Go to Functions tab in Netlify dashboard
   - Look for API route functions

4. **Test with curl:**
   ```bash
   curl https://swiftcardss.netlify.app/api/hello
   ```

## 🎯 **Expected Results:**

After fixing:
- ✅ **API routes accessible**: `/api/hello` returns JSON
- ✅ **Environment variables**: `/api/test-env` shows correct values
- ✅ **Upload functionality**: File uploads work
- ✅ **Database storage**: Data saved to Supabase

## 🔧 **If Still Not Working:**

1. **Try Vercel instead:**
   - Vercel has better Next.js support
   - Deploy to Vercel for testing

2. **Check Next.js version:**
   - Ensure Next.js 15 is compatible with Netlify

3. **Contact Netlify support:**
   - If all else fails, contact Netlify support

---

**Follow these steps to fix the API routes issue! 🚀** 