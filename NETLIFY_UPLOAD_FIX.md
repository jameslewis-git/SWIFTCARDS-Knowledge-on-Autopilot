# 🚀 Netlify Upload Fix Guide

## ❌ **Problem Identified:**
- ✅ **Localhost**: Upload works perfectly
- ❌ **Netlify**: Upload fails with "Upload failed" error
- ❌ **Supabase**: No data being saved to database

## 🔍 **Root Causes:**

### **1. Environment Variables Missing**
- Netlify doesn't have access to your local `.env.local` file
- Missing `GOOGLE_GENERATIVE_AI_API_KEY`
- Missing `NEXT_PUBLIC_SUPABASE_URL`
- Missing `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **2. API Route Issues**
- Netlify may have different API route handling
- File size limits on Netlify
- Timeout issues with AI generation

### **3. CORS/Network Issues**
- Cross-origin requests may be blocked
- Authentication token issues

## 🔧 **Step-by-Step Fix:**

### **Step 1: Set Environment Variables in Netlify**

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/
   - Select your SWIFTCARDS site

2. **Navigate to Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**

3. **Add These Variables:**
   ```
   GOOGLE_GENERATIVE_AI_API_KEY = your_google_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

4. **Get Your Values:**
   - **Google Gemini API Key**: https://makersuite.google.com/app/apikey
   - **Supabase URL**: Your Supabase project dashboard → Settings → API
   - **Supabase Anon Key**: Same location as URL

### **Step 2: Update Netlify Configuration**

**Update `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "app/api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### **Step 3: Add API Route Debugging**

**Update `app/api/upload/process/route.ts`:**
```typescript
export async function POST(request: NextRequest) {
  console.log("🚀 Upload API called")
  
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log("🔑 Auth header:", authHeader ? "Present" : "Missing")
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ Unauthorized - No valid auth header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    console.log("🔑 Token length:", token.length)
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    console.log("👤 User verification:", user ? "Success" : "Failed", error)
    
    if (error || !user) {
      console.log("❌ User verification failed:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.email)

    const formData = await request.formData()
    const file = formData.get("file") as File
    const deckName = formData.get("deckName") as string
    const tags = formData.get("tags") as string

    console.log("📁 File received:", file?.name, file?.size, file?.type)
    console.log("📝 Deck name:", deckName)
    console.log("🏷️ Tags:", tags)

    if (!file) {
      console.log("❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (Netlify limit: 50MB)
    if (file.size > 50 * 1024 * 1024) {
      console.log("❌ File too large:", file.size)
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
    }

    console.log("🔄 Starting content extraction...")
    
    // Extract content based on file type
    let extractedContent = ""

    if (file.type === "application/pdf") {
      extractedContent = await extractPDFContent(file)
    } else if (file.type.startsWith("image/")) {
      extractedContent = await extractImageContent(file)
    } else if (file.type.startsWith("video/")) {
      extractedContent = await extractVideoContent(file)
    } else if (file.type.startsWith("text/")) {
      extractedContent = await file.text()
    } else {
      console.log("❌ Unsupported file type:", file.type)
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    console.log("📄 Content extracted, length:", extractedContent.length)

    // Generate flashcards using AI
    console.log("🤖 Starting AI generation...")
    const cards = await generateFlashcards(extractedContent)
    console.log("✅ AI generation complete, cards:", cards.length)

    // Save to database using Supabase
    console.log("💾 Saving to database...")
    
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        name: deckName || file.name,
        description: `Generated from ${file.name}`,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (deckError) {
      console.error("❌ Database error:", deckError)
      return NextResponse.json({ error: "Failed to save deck" }, { status: 500 })
    }

    console.log("✅ Deck saved:", deck.id)

    // Save cards to the cards table
    const cardsToInsert = cards.map((card: any) => ({
      deck_id: deck.id,
      front: card.question,
      back: card.answer,
      created_at: new Date().toISOString(),
    }))

    const { error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert)

    if (cardsError) {
      console.error("❌ Cards insertion error:", cardsError)
      // Try to delete the deck if cards insertion failed
      await supabase.from('decks').delete().eq('id', deck.id)
      return NextResponse.json({ error: "Failed to save cards" }, { status: 500 })
    }

    console.log("✅ Cards saved successfully")

    return NextResponse.json({
      deckId: deck.id,
      cards: cards.length,
      message: "Flashcards generated successfully",
    })
  } catch (error) {
    console.error("💥 Upload processing error:", error)
    return NextResponse.json({ 
      error: "Failed to process file",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
```

### **Step 4: Check Netlify Function Logs**

1. **Go to Netlify Dashboard:**
   - Site → **Functions** tab
   - Look for any error logs

2. **Check Build Logs:**
   - Site → **Deploys** → Click on latest deploy
   - Look for any build errors

### **Step 5: Test Environment Variables**

**Add this test API route:**
```typescript
// app/api/test-env/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    googleKeyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
```

**Test it:**
- Visit: `https://your-site.netlify.app/api/test-env`
- Should show all variables are present

## 🚀 **Deployment Steps:**

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Add comprehensive upload debugging and Netlify fixes"
   git push origin main
   ```

2. **Set environment variables in Netlify**

3. **Trigger a new deploy**

4. **Test the upload functionality**

## 🔍 **Debugging Checklist:**

- [ ] **Environment variables set in Netlify**
- [ ] **API routes accessible** (test `/api/test-env`)
- [ ] **Authentication working** (check user login)
- [ ] **File upload reaching API** (check logs)
- [ ] **AI generation working** (check Google API key)
- [ ] **Database connection working** (check Supabase)
- [ ] **No CORS issues** (check network tab)

## 🎯 **Expected Results:**

After fixing:
- ✅ **File uploads work on Netlify**
- ✅ **Flashcards generated successfully**
- ✅ **Data saved to Supabase**
- ✅ **No more "Upload failed" errors**

---

**Follow these steps and the upload should work on Netlify! 🚀** 