# 🔑 Supabase Service Role Key Setup

## 🚨 **Critical Issue: Missing Service Role Key**

The upload functionality is failing because we need the **Supabase Service Role Key** to bypass Row-Level Security (RLS) policies.

## 🔧 **Step-by-Step Fix:**

### **Step 1: Get Your Service Role Key**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to API Settings:**
   - Go to **Settings** → **API**
   - Look for **Project API keys** section

3. **Copy the Service Role Key:**
   - Find **service_role** key (starts with `eyJ...`)
   - **⚠️ Keep this secret** - it has admin privileges

### **Step 2: Add to Netlify Environment Variables**

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/
   - Select your **swiftcardss** site

2. **Add Environment Variable:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your service role key from Step 1

### **Step 3: Trigger New Deploy**

1. **Go to Deploys tab**
2. **Click "Trigger deploy"** → **Deploy site**
3. **Wait for build to complete**

## 🔍 **Alternative Solution: Disable RLS**

If you prefer not to use the service role key, you can disable RLS:

### **Option 1: Disable RLS for Testing**

Run this SQL in your Supabase SQL Editor:

```sql
-- Disable RLS temporarily for testing
ALTER TABLE decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;
```

### **Option 2: Fix RLS Policies**

Run this SQL to fix the RLS policies:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own decks" ON decks;
DROP POLICY IF EXISTS "Users can insert cards to their decks" ON cards;

-- Create simpler policies
CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert cards to their decks" ON cards
  FOR INSERT WITH CHECK (true);
```

## 🎯 **Expected Results:**

After adding the service role key:
- ✅ **Upload functionality works**
- ✅ **Text processing works**
- ✅ **No more RLS policy violations**
- ✅ **Database operations succeed**

## 🔧 **Quick Test:**

After the deploy, test:
1. **Database connection**: `https://swiftcardss.netlify.app/api/test-db`
2. **Upload functionality**: Try uploading a file
3. **Text processing**: Try pasting text

## 🚀 **Recommended Approach:**

**Use the Service Role Key** (Option 1) as it's more secure and follows best practices.

---

**Add the service role key to Netlify and the upload should work! 🚀** 