import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Calendar, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react';

function CalendarConnect({ session }) {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  const REDIRECT_URI = `${window.location.origin}/connect-calendar`;
  const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly';

  useEffect(() => {
    // Check if we're returning from Google OAuth
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      handleGoogleCallback(accessToken);
    }
  }, []);

  const initiateGoogleAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URI}&` +
      `response_type=token&` +
      `scope=${SCOPE}&` +
      `include_granted_scopes=true&` +
      `state=state_parameter_passthrough_value`;

    window.location.href = authUrl;
  };

  const handleGoogleCallback = async (accessToken) => {
    setConnecting(true);
    try {
      // Fetch user's calendars
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch calendars');

      const data = await response.json();
      setCalendars(data.items || []);

      // Store the connection in database
      const { error } = await supabase
        .from('calendar_connections')
        .upsert({
          user_id: session.user.id,
          google_calendar_connected: true,
          google_access_token: accessToken, // In production, encrypt this
          calendars: data.items || []
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Successfully connected to Google Calendar!' 
      });
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to connect to Google Calendar. Please try again.' 
      });
    } finally {
      setConnecting(false);
      // Clear the URL hash
      window.history.replaceState(null, null, window.location.pathname);
    }
  };

  const saveSelectedCalendars = async () => {
    try {
      const { error } = await supabase
        .from('calendar_connections')
        .update({
          selected_calendars: selectedCalendars
        })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Calendar preferences saved!'
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving calendar preferences:', error);
      setMessage({
        type: 'error',
        text: `Failed to save calendar preferences: ${error.message}`
      });
    }
  };

  const toggleCalendar = (calendarId) => {
    setSelectedCalendars(prev => {
      if (prev.includes(calendarId)) {
        return prev.filter(id => id !== calendarId);
      } else {
        return [...prev, calendarId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Connect Google Calendar
            </h1>
            <p className="text-gray-600">
              Select which calendars you want to share with your partner
            </p>
          </div>

          {!calendars.length ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How this works:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Click "Connect Google Calendar" below</li>
                      <li>Sign in to your Google account</li>
                      <li>Grant calendar read permissions</li>
                      <li>Select which calendars to share</li>
                    </ol>
                  </div>
                </div>
              </div>

              <button
                onClick={initiateGoogleAuth}
                disabled={connecting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Connect Google Calendar
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    Connected! Select calendars to share:
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {calendars.map((calendar) => (
                  <label
                    key={calendar.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCalendars.includes(calendar.id)}
                      onChange={() => toggleCalendar(calendar.id)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {calendar.summary}
                      </p>
                      {calendar.description && (
                        <p className="text-xs text-gray-500">
                          {calendar.description}
                        </p>
                      )}
                    </div>
                    <div
                      className="w-4 h-4 rounded-full ml-2"
                      style={{ backgroundColor: calendar.backgroundColor }}
                    />
                  </label>
                ))}
              </div>

              <button
                onClick={saveSelectedCalendars}
                disabled={selectedCalendars.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Continue
              </button>
            </div>
          )}

          {message.text && (
            <div className={`mt-6 rounded-md p-4 ${
              message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarConnect;
