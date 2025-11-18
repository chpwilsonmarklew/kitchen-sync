-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  partner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create calendar_connections table
CREATE TABLE IF NOT EXISTS public.calendar_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  google_calendar_connected BOOLEAN DEFAULT false,
  google_access_token TEXT,
  google_refresh_token TEXT,
  calendars JSONB,
  selected_calendars TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create shared_events table (for caching)
CREATE TABLE IF NOT EXISTS public.shared_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_id TEXT NOT NULL,
  calendar_id TEXT,
  title TEXT,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  attendees JSONB,
  is_all_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can view their partner's profile" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND partner_id = profiles.id
    )
  );

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Calendar connections policies
CREATE POLICY "Users can view their own calendar connection" 
  ON public.calendar_connections FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their partner's calendar connection" 
  ON public.calendar_connections FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND partner_id = calendar_connections.user_id
    )
  );

CREATE POLICY "Users can update their own calendar connection" 
  ON public.calendar_connections FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar connection" 
  ON public.calendar_connections FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Shared events policies
CREATE POLICY "Users can view their own events" 
  ON public.shared_events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their partner's events" 
  ON public.shared_events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND partner_id = shared_events.user_id
    )
  );

CREATE POLICY "Users can manage their own events" 
  ON public.shared_events FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER calendar_connections_updated_at
  BEFORE UPDATE ON public.calendar_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER shared_events_updated_at
  BEFORE UPDATE ON public.shared_events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
