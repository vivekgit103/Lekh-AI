import { verifySupabaseToken, isSupabaseConfigured } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Missing header handling
  if (!authHeader) {
    if (!isSupabaseConfigured) {
      req.user = {
        id: 'demo-user-00000000-0000-0000-0000-000000000001',
        email: 'demo@docusaathi.ai',
        full_name: 'Demo Citizen',
      };
      return next();
    }
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is missing. Expected "Authorization: Bearer <token>".',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authorization header format. Expected "Bearer <token>".',
    });
  }

  const token = parts[1];

  // 2. Demo token path
  if (token === 'demo-token' || token.startsWith('demo-')) {
    req.user = {
      id: 'demo-user-00000000-0000-0000-0000-000000000001',
      email: 'demo@docusaathi.ai',
      full_name: 'Demo Citizen',
    };
    return next();
  }

  // 3. Supabase JWT token verification
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await verifySupabaseToken(token);
      if (error || !data?.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: error?.message || 'Invalid or expired Supabase authentication token.',
        });
      }

      req.user = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        ...data.user,
      };
      return next();
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token verification failed: ' + err.message,
      });
    }
  }

  // 4. Default fallback when Supabase credentials are missing
  req.user = {
    id: 'demo-user-00000000-0000-0000-0000-000000000001',
    email: 'demo@docusaathi.ai',
    full_name: 'Demo Citizen',
  };
  return next();
};
