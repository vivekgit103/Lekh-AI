import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const hasServiceRole = Boolean(
  supabaseUrl && supabaseUrl.startsWith('http') && supabaseServiceKey && supabaseServiceKey.length > 20
);

export const hasAnonKey = Boolean(
  supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey && supabaseAnonKey.length > 20
);

export const isSupabaseConfigured = hasServiceRole || hasAnonKey;

if (hasServiceRole) {
  console.log('✅ Supabase configured with Service Role');
} else if (hasAnonKey) {
  console.log('✅ Supabase configured with Anon Key');
} else {
  console.log('ℹ️ Supabase not fully configured. Running in Memory/Demo Mode.');
}

export const supabaseAdmin = hasServiceRole
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : hasAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const supabasePublic = hasAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function verifySupabaseToken(token) {
  const client = supabaseAdmin || supabasePublic;
  if (!client) {
    return { user: null, error: new Error('Supabase client not initialized') };
  }
  return await client.auth.getUser(token);
}
