#!/bin/bash

# Local Development Test Script
# This helps you test the app locally before deploying

echo "🚀 Calendar Share - Local Development Setup"
echo "==========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file with placeholder values..."
    cat > .env.local << EOF
# For local testing only - replace with real values for production
REACT_APP_SUPABASE_URL=https://placeholder.supabase.co
REACT_APP_SUPABASE_ANON_KEY=placeholder_key_for_local_testing_only
REACT_APP_GOOGLE_CLIENT_ID=placeholder_google_client_id
EOF
    echo "✅ .env.local created (with placeholders)"
    echo ""
    echo "⚠️  Note: To connect to real services, update .env.local with actual values"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Start the development server
echo "🎉 Starting the development server..."
echo "📱 The app will open at: http://localhost:3000"
echo ""
echo "👉 What you can test locally:"
echo "   - UI/UX design and navigation"
echo "   - Login/signup forms (won't work without real Supabase)"
echo "   - Calendar layouts and views"
echo "   - Responsive design"
echo ""
echo "Press Ctrl+C to stop the server"
echo "==========================================="
echo ""

npm start
