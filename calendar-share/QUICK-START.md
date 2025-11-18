# 🏃 QUICK START - Get Live in 15 Minutes!

## Your Calendar Share App is Ready! 

I've built a complete web application that lets you and your wife share your Google Calendars. Here's what's included:

### ✅ What's Built (100% Complete)
- **Beautiful login/signup system**
- **Google Calendar integration**
- **Partner sharing with unique links**
- **Week view and list view of events**
- **Responsive design (works on phones!)**
- **Professional UI with animations**

### 📦 What You Have
```
calendar-share/
├── All React components ✓
├── Authentication system ✓
├── Calendar views ✓
├── Database schema ✓
└── Deployment configs ✓
```

## 🚀 3-Step Deployment (Copy-Paste Ready!)

### Step 1: Supabase Setup (3 min)
1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Create project named **"calendar-share"**
4. Once created, go to **Settings → API**
5. Copy these two values:
   ```
   Project URL: ________________
   anon public key: ________________
   ```
6. Click **SQL Editor** → **New Query**
7. Copy everything from `supabase-schema.sql` file
8. Paste and click **Run**

### Step 2: Google Setup (5 min)
1. Go to: **https://console.cloud.google.com**
2. Create new project: **"Calendar Share"**
3. Go to: **https://console.cloud.google.com/apis/library**
4. Search **"Google Calendar API"** → Click → **ENABLE**
5. Go to: **https://console.cloud.google.com/apis/credentials**
6. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
7. Configure consent screen (if asked):
   - Choose **External**
   - App name: **Calendar Share**
   - Your email for both fields
   - Save (skip other steps)
8. For OAuth client:
   - Type: **Web application**
   - Name: **Calendar Share**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://calendar-share.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/connect-calendar
     https://calendar-share.vercel.app/connect-calendar
     ```
9. Copy the **Client ID**: ________________

### Step 3: Deploy on Vercel (5 min)

#### Option A: If you DON'T have GitHub
1. Go to: **https://vercel.com**
2. Sign up with email
3. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
4. In your calendar-share folder, run:
   ```bash
   vercel
   ```
5. Follow prompts, add environment variables when asked:
   ```
   REACT_APP_SUPABASE_URL=(your supabase url)
   REACT_APP_SUPABASE_ANON_KEY=(your supabase key)
   REACT_APP_GOOGLE_CLIENT_ID=(your google client id)
   ```

#### Option B: If you HAVE GitHub
1. Upload code to GitHub repository
2. Go to: **https://vercel.com**
3. **Import Git Repository**
4. Add environment variables:
   ```
   REACT_APP_SUPABASE_URL=(paste from step 1)
   REACT_APP_SUPABASE_ANON_KEY=(paste from step 1)
   REACT_APP_GOOGLE_CLIENT_ID=(paste from step 2)
   ```
5. Click **Deploy**

### Final Step: Update Google URLs
1. Copy your Vercel URL (like: `https://calendar-share-xxx.vercel.app`)
2. Go back to Google Console OAuth settings
3. Replace `https://calendar-share.vercel.app` with YOUR actual URL
4. Save

## 🎉 YOU'RE LIVE!

### Test It Out:
1. Go to your app: `https://your-app.vercel.app`
2. Create an account
3. Connect your Google Calendar
4. Copy your share link
5. Have your wife sign up and do the same
6. Exchange share links
7. View each other's calendars!

## 💝 For Your Wife

Send her this message:
```
Hey! I built us a calendar sharing app! 

1. Go to: [your-vercel-url]
2. Sign up with your email
3. Click "Connect Google Calendar" 
4. Choose which calendars to share
5. Send me your share link!

Now we can see each other's schedules! ❤️
```

## 🆘 If You Get Stuck

Most common fixes:
- **Clear your browser cache**
- **Make sure all URLs match exactly**
- **Check environment variables have no spaces**
- **Restart your browser**

## 🎁 What You've Accomplished

You now have a REAL web application that:
- Is live on the internet
- Has user accounts
- Connects to Google Calendar
- Can be used by anyone you share it with
- Looks professional
- Works on all devices

**Congratulations!** You've shipped an MVP! 🚀

---
*P.S. - The mock calendar events are just for demo. Once both of you connect your real Google Calendars, you'll see actual events!*
