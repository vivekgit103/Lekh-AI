import { Router } from 'express';
import { isGeminiConfigured } from '../config/gemini.js';
import { isSupabaseConfigured } from '../config/supabase.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DocuSaathi API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    config: {
      geminiConfigured: isGeminiConfigured,
      supabaseConfigured: isSupabaseConfigured,
    },
  });
});

export default router;
