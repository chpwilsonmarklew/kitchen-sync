# ☑️ DEPLOYMENT CHECKLIST

## Your 15-Minute Deployment Journey

### 📋 Pre-Flight Check (1 min)
- [ ] Have an email address ready
- [ ] Have a Google account
- [ ] Open this checklist on your phone/computer

### 🔧 Step 1: Supabase (3 min)
- [ ] Go to https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign up (GitHub or email)
- [ ] Create project "calendar-share"
- [ ] Wait for setup (~2 min)
- [ ] Go to SQL Editor
- [ ] Copy contents of `supabase-schema.sql`
- [ ] Paste and Run
- [ ] Go to Settings → API
- [ ] Copy Project URL: _______________________
- [ ] Copy anon key: _______________________

### 🔧 Step 2: Google Calendar API (5 min)
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project "Calendar Share"
- [ ] Go to API Library
- [ ] Search "Google Calendar API"
- [ ] Click ENABLE
- [ ] Go to Credentials
- [ ] Create OAuth client ID
- [ ] Configure consent screen (if needed)
  - [ ] Choose External
  - [ ] Add app name and emails
- [ ] Set application type: Web
- [ ] Add authorized origins:
  - [ ] http://localhost:3000
  - [ ] https://calendar-share.vercel.app
- [ ] Add redirect URIs:
  - [ ] http://localhost:3000/connect-calendar
  - [ ] https://calendar-share.vercel.app/connect-calendar
- [ ] Copy Client ID: _______________________

### 🔧 Step 3: Vercel Deployment (5 min)
- [ ] Go to https://vercel.com
- [ ] Sign up/login
- [ ] Click "New Project"
- [ ] Choose deployment method:
  - [ ] Option A: Upload folder directly
  - [ ] Option B: Import from GitHub
- [ ] Add environment variables:
  - [ ] REACT_APP_SUPABASE_URL = (your value)
  - [ ] REACT_APP_SUPABASE_ANON_KEY = (your value)
  - [ ] REACT_APP_GOOGLE_CLIENT_ID = (your value)
- [ ] Click Deploy
- [ ] Wait for build (~2-3 min)
- [ ] Copy your app URL: _______________________

### 🔧 Step 4: Final Configuration (2 min)
- [ ] Go back to Google Console
- [ ] Edit OAuth client
- [ ] Update URLs with your Vercel URL
- [ ] Save changes

### ✅ Testing (2 min)
- [ ] Visit your app URL
- [ ] Create an account
- [ ] Verify you can log in
- [ ] Click "Connect Google Calendar"
- [ ] Verify OAuth flow works
- [ ] Copy your share link

### 💝 Share with Partner
- [ ] Send app URL to your wife
- [ ] Send her these instructions:
  - [ ] Sign up with email
  - [ ] Connect Google Calendar
  - [ ] Share her link with you
- [ ] Exchange share links
- [ ] Test viewing each other's calendars

### 🎉 Victory Lap
- [ ] Both accounts created
- [ ] Both calendars connected
- [ ] Share links exchanged
- [ ] Can see shared calendar view
- [ ] High-five yourself! 🙌

## 📱 Save These URLs

Your App: _______________________
Supabase Dashboard: https://app.supabase.com
Google Console: https://console.cloud.google.com
Vercel Dashboard: https://vercel.com/dashboard

## 🚨 Quick Fixes

**Can't log in?**
- [ ] Check Supabase URL includes https://
- [ ] Verify anon key is copied completely
- [ ] Clear browser cache

**Google Calendar won't connect?**
- [ ] Verify redirect URIs match exactly
- [ ] Include trailing /connect-calendar
- [ ] Try incognito/private browser

**Page looks broken?**
- [ ] Wait 5 minutes for deploy to finish
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check all env variables set in Vercel

## 🏁 YOU DID IT!

Time started: _______
Time finished: _______
Total time: _______ minutes

Celebrate! You've deployed a real web app! 🎊
