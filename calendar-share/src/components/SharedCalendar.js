import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Calendar, Users, Clock, MapPin, ArrowLeft, Heart, RefreshCw } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

function SharedCalendar({ session }) {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [partnerEvents, setPartnerEvents] = useState([]);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState('week'); // week or list

  useEffect(() => {
    fetchCalendarData();
  }, [partnerId, currentWeek]);

  async function fetchCalendarData() {
    try {
      setLoading(true);

      // Fetch partner profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', partnerId)
        .single();

      if (profileError) throw profileError;
      setPartnerProfile(profile);

      // Fetch partner's calendar connection
      const { data: connection, error: connError } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', partnerId)
        .single();

      if (connection && connection.google_access_token) {
        // In a real app, we'd fetch events from Google Calendar API
        // For MVP, we'll use mock data
        setPartnerEvents(generateMockEvents(partnerId, 'Partner'));
      }

      // Fetch your own events
      const { data: myConnection } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (myConnection && myConnection.google_access_token) {
        setEvents(generateMockEvents(session.user.id, 'You'));
      }

    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Mock event generator for MVP
  function generateMockEvents(userId, label) {
    const events = [];
    const weekStart = startOfWeek(currentWeek);
    
    // Generate some sample events for the week
    const sampleEvents = [
      { title: 'Morning Standup', time: '09:00', duration: 30 },
      { title: 'Team Meeting', time: '14:00', duration: 60 },
      { title: 'Lunch Break', time: '12:00', duration: 60 },
      { title: 'Project Review', time: '16:00', duration: 45 },
      { title: 'Coffee Chat', time: '10:30', duration: 30 },
    ];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      // Random events for each day
      if (Math.random() > 0.3) {
        const numEvents = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numEvents; j++) {
          const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
          events.push({
            id: `${userId}-${i}-${j}`,
            title: `${label}: ${event.title}`,
            start: format(day, 'yyyy-MM-dd') + 'T' + event.time,
            duration: event.duration,
            owner: label,
          });
        }
      }
    }
    return events;
  }

  const allEvents = [...events, ...partnerEvents].sort((a, b) => 
    new Date(a.start) - new Date(b.start)
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(currentWeek), i)
  );

  const getEventsForDay = (day) => {
    return allEvents.filter(event => 
      isSameDay(parseISO(event.start), day)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <span className="font-bold text-xl text-gray-800">Shared Calendar</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="h-4 w-4 text-red-500" />
                <span>You & {partnerProfile?.full_name || 'Partner'}</span>
              </div>
              <button
                onClick={fetchCalendarData}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md ${
                view === 'week' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md ${
                view === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              ←
            </button>
            <span className="font-medium text-gray-700">
              Week of {format(startOfWeek(currentWeek), 'MMM d, yyyy')}
            </span>
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {view === 'week' ? (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 text-center border-r last:border-r-0 ${
                    isSameDay(day, new Date()) ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="font-semibold text-gray-900">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-2xl mt-1 ${
                    isSameDay(day, new Date()) 
                      ? 'text-indigo-600 font-bold' 
                      : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[400px]">
              {weekDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div
                    key={index}
                    className={`border-r last:border-r-0 p-2 ${
                      isSameDay(day, new Date()) ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded text-xs ${
                            event.owner === 'You'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {format(parseISO(event.start), 'HH:mm')}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length === 0 && (
                        <div className="text-gray-400 text-xs text-center py-4">
                          No events
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">All Events This Week</h3>
            <div className="space-y-3">
              {allEvents.length > 0 ? (
                allEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      event.owner === 'You'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-pink-50 border-pink-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(event.start), 'MMM d')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(parseISO(event.start), 'HH:mm')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.owner}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No events this week</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm text-gray-600">Your Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-100 rounded"></div>
            <span className="text-sm text-gray-600">{partnerProfile?.full_name || 'Partner'}'s Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedCalendar;
