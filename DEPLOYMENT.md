# 🚀 SWIFTCARDS - Netlify Deployment Guide

## Prerequisites

1. **GitHub Repository**: Ensure your project is pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Environment Variables**: Set up your environment variables in Netlify

## Deployment Steps

### 1. Connect to GitHub

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Select your SWIFTCARDS repository

### 2. Configure Build Settings

**Build command**: `npm run build`
**Publish directory**: `out`
**Node version**: 18 (or higher)

### 3. Environment Variables

Add these environment variables in Netlify:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NODE_ENV=production
```

### 4. Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be live at `https://your-site-name.netlify.app`

## Post-Deployment

### 1. Custom Domain (Optional)
- Go to Site settings > Domain management
- Add your custom domain
- Configure DNS settings

### 2. Environment Variables
- Go to Site settings > Environment variables
- Add all required environment variables
- Redeploy if needed

### 3. Function Configuration
- If using API routes, they'll be automatically deployed
- Check Netlify Functions for serverless functions

## Troubleshooting

### Build Errors
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Runtime Errors
- Check browser console for client-side errors
- Check Netlify function logs for server-side errors
- Verify API endpoints are working

## Local Testing

Before deploying, test locally:

```bash
npm run build
npm run start
```

## Important Notes

- **Environment Variables**: Never commit `.env.local` to Git
- **API Keys**: Use Netlify's environment variable system
- **Database**: Ensure MongoDB Atlas allows connections from Netlify
- **CORS**: Configure if needed for external API calls

## Support

For issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors 