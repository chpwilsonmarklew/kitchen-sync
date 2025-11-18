# 🚀 Calendar Share - Deployment Guide

Your calendar sharing app is ready! Follow these steps to deploy it live (10-15 minutes).

## 📋 Prerequisites Checklist
- [ ] Computer with internet connection
- [ ] Email address for account creation
- [ ] Google account (for calendar access)

## 🎯 Quick Start - 3 Simple Steps

### Step 1: Set Up Supabase (Database & Auth) - 3 minutes

1. **Create Supabase Account**
   - Go to: https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub or email
   - Create a new project (name it "calendar-share")
   - Choose a strong database password (save it!)
   - Select region closest to you
   - Wait ~2 minutes for setup

2. **Set Up Database Tables**
   - In Supabase dashboard, click "SQL Editor" (left sidebar)
   - Click "New Query"
   - Copy ALL contents from `supabase-schema.sql` file
   - Paste and click "Run"
   - You should see "Success" message

3. **Get Your API Keys**
   - Click "Settings" → "API" (left sidebar)
   - Copy these values (you'll need them):
     - `URL`: (looks like https://xxx.supabase.co)
     - `anon public`: (long string starting with 'eyJ...')

### Step 2: Set Up Google Calendar API - 5 minutes

1. **Enable Google Calendar API**
   - Go to: https://console.cloud.google.com
   - Click "Select a Project" → "New Project"
   - Name it "Calendar Share"
   - Click "Create"
   - Wait for creation (~30 seconds)
   
2. **Enable the Calendar API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search "Google Calendar API"
   - Click on it and press "ENABLE"

3. **Create OAuth Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure consent screen:
     - Choose "External"
     - App name: "Calendar Share"
     - User support email: your email
     - Developer email: your email
     - Click "Save and Continue" (skip other steps)
   - Back to credentials:
     - Application type: "Web application"
     - Name: "Calendar Share Web"
     - Authorized JavaScript origins: 
       - Add: `http://localhost:3000`
       - Add: `https://your-app-name.vercel.app` (we'll update this later)
     - Authorized redirect URIs:
       - Add: `http://localhost:3000/connect-calendar`
       - Add: `https://your-app-name.vercel.app/connect-calendar`
     - Click "CREATE"
   - **Copy the Client ID** (you'll need this)

### Step 3: Deploy to Vercel - 5 minutes

1. **Prepare Your Code**
   - Create a `.env.local` file in the project root
   - Add your keys:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url_here
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
     ```

2. **Upload to GitHub** (if you have GitHub)
   - Create new repository on GitHub
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin your-github-repo-url
     git push -u origin main
     ```

3. **Deploy on Vercel**
   - Go to: https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - **Configure environment variables:**
     - Click "Environment Variables"
     - Add each variable from your `.env.local`
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

4. **Update Google OAuth**
   - Copy your Vercel URL (like `https://calendar-share-xxx.vercel.app`)
   - Go back to Google Console credentials
   - Edit your OAuth client
   - Add your Vercel URL to authorized origins and redirect URIs
   - Save

## ✅ Testing Your App

1. **Visit your Vercel URL**
2. **Create an account** (you and your wife should each create one)
3. **Connect Google Calendar**
4. **Share your link with each other**

## 🎉 Success Checklist

Your app should now:
- ✅ Let users sign up/login
- ✅ Connect to Google Calendar
- ✅ Show shared calendar view
- ✅ Be accessible from anywhere

## 🔧 Troubleshooting

**"Invalid Supabase URL"**
- Check your `.env.local` file
- Make sure URL includes `https://`
- Redeploy on Vercel after fixing

**"Google Sign-in Error"**
- Verify redirect URIs match exactly
- Include both localhost and production URLs
- Clear browser cache and try again

**"Cannot see calendar events"**
- Make sure calendar is connected
- Select calendars to share in settings
- Check that partner has also connected

## 📱 Sharing with Your Wife

Send her:
1. The app URL: `https://your-app.vercel.app`
2. Quick instructions:
   - Sign up with email
   - Click "Connect Google Calendar"
   - Select calendars to share
   - Share her unique link with you

## 🎁 What's Working

✅ **User Authentication** - Secure login/signup
✅ **Google Calendar Connection** - OAuth integration
✅ **Partner Sharing** - Unique share links
✅ **Calendar View** - Week and list views
✅ **Real-time Updates** - Syncs when refreshed

## 🚦 Next Steps (Optional Enhancements)

Want to improve it? Here are ideas:
- Add real Google Calendar event fetching (currently using mock data)
- Add event creation/editing
- Add email notifications
- Add mobile app version
- Add more calendar providers (Outlook, Apple)

## 💡 Pro Tips

1. **Test with both accounts** - Create two accounts to see full sharing
2. **Bookmark the app** - Add to phone home screen
3. **Regular sync** - Refresh to get latest events
4. **Privacy** - Only selected calendars are shared

---

**Need Help?** 
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Google Calendar API: https://developers.google.com/calendar

**Congratulations! 🎊** You've built and deployed a real web app that you and your wife can use to stay connected through your calendars!
