# 🚀 Netlify Deployment Guide

## ✅ **Pre-Deployment Checklist:**

1. **✅ Environment Variables**: Already added to `.env.local`
2. **✅ Database Schema**: Already applied to Supabase
3. **✅ Authentication**: Updated to use Supabase
4. **✅ Build Configuration**: `netlify.toml` created

## 🚀 **Step 1: Prepare for Deployment**

### **1.1 Commit All Changes**
```bash
git add .
git commit -m "Prepare for Netlify deployment - Supabase auth integration"
git push origin main
```

### **1.2 Verify Build Works Locally**
```bash
npm run build
```
This should complete without errors.

## 🚀 **Step 2: Deploy to Netlify**

### **Option A: Deploy via Netlify UI (Recommended)**

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New site from Git"**
4. **Choose GitHub** and select your repository
5. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

### **Option B: Deploy via Netlify CLI**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## 🔧 **Step 3: Configure Environment Variables**

### **3.1 Add Environment Variables in Netlify**

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

### **3.2 Redeploy After Adding Variables**

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

## 🔐 **Step 4: Configure Supabase Authentication**

### **4.1 Update Supabase Auth Settings**

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Settings**
3. Update **Site URL** to your Netlify URL:
   ```
   https://your-site-name.netlify.app
   ```
4. Add **Redirect URLs**:
   ```
   https://your-site-name.netlify.app/auth/callback
   https://your-site-name.netlify.app/dashboard
   ```

### **4.2 Test Authentication**

1. Visit your deployed site
2. Try signing up a new user
3. Check Supabase Dashboard → **Authentication** → **Users**

## 🎯 **Step 5: Verify Everything Works**

### **5.1 Test Core Features**
- ✅ **Home page loads**
- ✅ **Navigation works**
- ✅ **Theme toggle works**
- ✅ **User registration**
- ✅ **User login**
- ✅ **User logout**

### **5.2 Test AI Features**
- ✅ **File upload**
- ✅ **Text input**
- ✅ **Flashcard generation**
- ✅ **Quiz generation**

## 🔧 **Troubleshooting**

### **If Build Fails:**
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### **If Environment Variables Don't Work:**
- Redeploy after adding variables
- Check variable names are correct
- Verify no extra spaces in values

### **If Authentication Doesn't Work:**
- Verify Supabase URL and keys are correct
- Check redirect URLs in Supabase settings
- Ensure site URL is updated in Supabase

### **If AI Features Don't Work:**
- Verify Google Gemini API key is set
- Check API key has proper permissions
- Test API key separately

## 🎉 **Benefits of This Approach:**

1. **✅ Production URL**: Real domain for auth configuration
2. **✅ No Localhost Issues**: Proper redirect URLs
3. **✅ Easy Testing**: Live site for testing
4. **✅ CI/CD Ready**: Automatic deployments
5. **✅ Scalable**: Handles traffic spikes

## 🚀 **Next Steps After Deployment:**

1. **Test all features** on the live site
2. **Configure custom domain** (optional)
3. **Set up monitoring** (optional)
4. **Configure analytics** (optional)

---

**Ready to deploy? Let's get your SWIFTCARDS app live! 🚀** 