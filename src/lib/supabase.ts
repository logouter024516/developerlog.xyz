/**
 * 🔌 Supabase Client Configuration
 * Realtime Broadcast 전용 (DB 사용 안함)
 */

import { createClient } from '@supabase/supabase-js';

// 환경변수로 관리 (배포 시 실제 값 사용)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('✅ Supabase URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    timeout: 30000,
  },
  auth: {
    persistSession: false,
  },
});

// Broadcast 채널 이름
export const CURSOR_CHANNEL = 'portfolio:cursors';
