import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ievqpjyerkdpbdezvssu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldnFwanllcmtkcGJkZXp2c3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNjYxNjIsImV4cCI6MjEwMTY0MjE2Mn0.KpMepkIf_v2Qw-IobIUy-k7vyY7SMCY0rs9eVtGKNZI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
