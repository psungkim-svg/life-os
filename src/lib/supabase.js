import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

export const getSupabaseConfig = () => {
  const url = localStorage.getItem('LIFEOS_SUPABASE_URL') || '';
  const key = localStorage.getItem('LIFEOS_SUPABASE_KEY') || '';
  return { url, key };
};

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem('LIFEOS_SUPABASE_URL', url.trim());
  localStorage.setItem('LIFEOS_SUPABASE_KEY', key.trim());
  supabaseClient = null; // reset client
};

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient;
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.error('Supabase init error:', e);
      return null;
    }
  }
  return null;
};
