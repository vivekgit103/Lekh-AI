import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../services/supabaseClient';

const AuthContext = createContext({});

const DEMO_USER = {
  id: 'demo-user-00000000-0000-0000-0000-000000000001',
  email: 'demo@docusaathi.ai',
  user_metadata: {
    full_name: 'Demo Citizen',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if demo user saved in localStorage
    const savedDemo = localStorage.getItem('docusaathi_demo_mode');
    if (savedDemo === 'true') {
      setUser(DEMO_USER);
      setToken('demo-token');
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    if (!isSupabaseEnabled || !supabase) {
      // Default to demo mode if Supabase credentials are not yet configured
      setUser(DEMO_USER);
      setToken('demo-token');
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    // Supabase auth subscription
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setToken(currentSession.access_token);
        localStorage.setItem('sb-token', currentSession.access_token);
        setIsDemoMode(false);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setToken(currentSession?.access_token ?? null);
      if (currentSession) {
        setIsDemoMode(false);
        localStorage.removeItem('docusaathi_demo_mode');
        localStorage.setItem('sb-token', currentSession.access_token);
      } else {
        localStorage.removeItem('sb-token');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsDemo = () => {
    localStorage.setItem('docusaathi_demo_mode', 'true');
    localStorage.setItem('sb-token', 'demo-token');
    setUser(DEMO_USER);
    setToken('demo-token');
    setIsDemoMode(true);
  };

  const signIn = async (email, password) => {
    if (!isSupabaseEnabled || !supabase) {
      loginAsDemo();
      return { data: { user: DEMO_USER }, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.session) {
      setIsDemoMode(false);
      localStorage.removeItem('docusaathi_demo_mode');
      localStorage.setItem('sb-token', data.session.access_token);
      setUser(data.user);
      setSession(data.session);
      setToken(data.session.access_token);
    }
    return { data, error };
  };

  const signUp = async (email, password, fullName) => {
    if (!isSupabaseEnabled || !supabase) {
      loginAsDemo();
      return { data: { user: DEMO_USER }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    // Create profile record if user created
    if (!error && data?.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          preferred_language: 'en',
        });
      } catch (profileErr) {
        console.warn('Profile creation handled by trigger or error:', profileErr);
      }

      if (data.session) {
        setIsDemoMode(false);
        localStorage.removeItem('docusaathi_demo_mode');
        localStorage.setItem('sb-token', data.session.access_token);
        setUser(data.user);
        setSession(data.session);
        setToken(data.session.access_token);
      }
    }
    return { data, error };
  };

  const signOut = async () => {
    localStorage.removeItem('docusaathi_demo_mode');
    localStorage.removeItem('sb-token');
    setIsDemoMode(false);
    setUser(null);
    setSession(null);
    setToken(null);
    if (isSupabaseEnabled && supabase) {
      await supabase.auth.signOut();
    }
  };

  const value = {
    user,
    session,
    token,
    loading,
    isDemoMode,
    isSupabaseConfigured: isSupabaseEnabled,
    signIn,
    signUp,
    signOut,
    loginAsDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
