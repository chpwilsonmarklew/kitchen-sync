# 📅 Calendar Share

A beautiful web app to share your Google Calendar with your loved one. Stay connected and synchronized no matter the distance!

![React](https://img.shields.io/badge/React-18.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green)
![Google Calendar](https://img.shields.io/badge/Google-Calendar%20API-red)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password signup with Supabase
- 📅 **Google Calendar Integration** - Connect and sync your calendars
- 👥 **Partner Sharing** - Share calendars with your significant other
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS
- 🔄 **Real-time Sync** - See updates immediately

## 🚀 Quick Deploy

See `DEPLOYMENT-GUIDE.md` for detailed step-by-step instructions.

### Prerequisites
- Supabase account (free)
- Google Cloud Console access (free)
- Vercel account (free)

### Environment Variables
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🛠️ Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your values
4. Run the development server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000

## 📁 Project Structure

```
calendar-share/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js         # Authentication
│   │   ├── Dashboard.js     # Main dashboard
│   │   ├── CalendarConnect.js # Google Calendar OAuth
│   │   └── SharedCalendar.js # Shared calendar view
│   ├── config/
│   │   └── supabase.js      # Supabase client
│   ├── App.js               # Main app component
│   ├── App.css              # Global styles
│   └── index.js             # App entry point
├── supabase-schema.sql      # Database schema
├── package.json             # Dependencies
└── DEPLOYMENT-GUIDE.md      # Deployment instructions
```

## 🎯 MVP Features (Working)

✅ User registration and login
✅ Google Calendar OAuth connection
✅ Partner invitation system
✅ Shared calendar view (week/list)
✅ Responsive mobile design
✅ Beautiful UI with animations

## 🔜 Future Enhancements

- [ ] Real event fetching from Google Calendar
- [ ] Event creation and editing
- [ ] Email notifications
- [ ] Calendar sync preferences
- [ ] Multiple calendar providers
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 💡 Usage

1. **Sign Up** - Create your account with email
2. **Connect Calendar** - Link your Google Calendar
3. **Share Link** - Send your unique link to your partner
4. **View Together** - See both calendars in one place

## 🤝 Sharing

Each user gets a unique share link:
```
https://yourapp.vercel.app/shared/your-user-id
```

Send this to your partner to start sharing calendars!

## 📝 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Authentication by Supabase
- Calendar integration via Google Calendar API
- Hosted on Vercel

---

Made with ❤️ for couples who want to stay connected
