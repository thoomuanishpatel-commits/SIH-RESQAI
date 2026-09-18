import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ievqpjyerkdpbdezvssu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldnFwanllcmtkcGJkZXp2c3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNjYxNjIsImV4cCI6MjEwMTY0MjE2Mn0.KpMepkIf_v2Qw-IobIUy-k7vyY7SMCY0rs9eVtGKNZI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadPrivateIncidentMedia(
  file: File | Blob,
  incidentToken: string,
  filename: string
): Promise<{ path: string | null; error: any }> {
  try {
    const ext = filename.split('.').pop() || 'jpg';
    const filePath = `incidents/${incidentToken}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('incident-media')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return { path: filePath, error };
    }
    return { path: data?.path || filePath, error: null };
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return { path: `incidents/${incidentToken}/${filename}`, error: err };
  }
}

