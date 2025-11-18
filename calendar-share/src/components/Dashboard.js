import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Calendar, Link, UserPlus, LogOut, Check, X, Share2, Heart, RefreshCw } from 'lucide-react';

function Dashboard({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getProfile();
    checkCalendarConnection();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.email.split('@')[0]
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        setProfile(newProfile);
      } else {
        setProfile(data);
      }

      // Generate share link
      const link = `${window.location.origin}/shared/${session.user.id}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Error loading profile' });
    } finally {
      setLoading(false);
    }
  }

  async function checkCalendarConnection() {
    try {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (data && data.google_calendar_connected) {
        setIsConnected(true);
      }
    } catch (error) {
      console.log('No calendar connection found');
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function shareWithPartner() {
    if (!partnerEmail) {
      setMessage({ type: 'error', text: 'Please enter your partner\'s email' });
      return;
    }

    try {
      // Here we'd normally send an email invitation
      // For MVP, we'll just show the share link
      setMessage({ 
        type: 'success', 
        text: `Share link copied! Send this to ${partnerEmail}: ${shareLink}` 
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareLink);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sharing with partner' });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <span className="font-bold text-xl text-gray-800">Calendar Share</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hi, {profile?.full_name}!</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Connection Card */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Google Calendar</h2>
              {isConnected ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-5 w-5" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400">
                  <X className="h-5 w-5" />
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              Connect your Google Calendar to share your schedule with your partner.
            </p>

            {isConnected ? (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/connect-calendar')}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  Manage Calendars
                </button>
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    Your calendar is connected and syncing!
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/connect-calendar')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
              >
                <Link className="h-4 w-4" />
                Connect Google Calendar
              </button>
            )}
          </div>

          {/* Partner Sharing Card */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Share with Partner</h2>
              <Heart className="h-5 w-5 text-red-500" />
            </div>

            <p className="text-gray-600 mb-4">
              Invite your partner to share calendars with you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner's Email
                </label>
                <input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={shareWithPartner}
                className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md"
              >
                <Share2 className="h-4 w-4" />
                Send Invite
              </button>

              {shareLink && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-xs text-gray-600 mb-1">Your share link:</p>
                  <p className="text-xs font-mono text-gray-800 break-all">{shareLink}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div className={`mt-6 rounded-md p-4 ${
            message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Shared Calendar Preview */}
        {isConnected && (
          <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Shared Calendar</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Calendar events will appear here once connected
              </p>
              <button
                onClick={() => navigate(`/shared/${session.user.id}`)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full Calendar →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
