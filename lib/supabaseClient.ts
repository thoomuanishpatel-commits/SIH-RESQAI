import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-resqai-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key';

export const isRealSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-resqai-project')
);

// Primary Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Private Storage Helper: Upload to 'incident-media' private bucket
export async function uploadPrivateIncidentMedia(
  file: File | Blob,
  incidentId: string,
  fileName?: string
): Promise<{ path: string | null; error: Error | null }> {
  if (!isRealSupabaseConfigured) {
    // In demo mode, simulate secure private storage with a blob/data URL
    const simulatedPath = `incidents/${incidentId}/${Date.now()}-${fileName || 'evidence.jpg'}`;
    return { path: simulatedPath, error: null };
  }

  try {
    const cleanFileName = `${Date.now()}-${fileName || 'media.jpg'}`;
    const filePath = `incidents/${incidentId}/${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('incident-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return { path: data.path, error: null };
  } catch (err: any) {
    console.error('Failed to upload to private bucket:', err);
    return { path: null, error: err };
  }
}

// Private Storage Helper: Get authenticated signed URL (expires in 60 minutes)
// Normal visitors cannot access this media; only authorized EOC roles with signed tokens can view it.
export async function getSignedIncidentMediaUrl(
  storagePath: string,
  expiresInSeconds: number = 3600
): Promise<{ signedUrl: string | null; error: Error | null }> {
  if (!isRealSupabaseConfigured) {
    // Demo fallback: Return simulated secure preview
    return { signedUrl: storagePath.startsWith('http') || storagePath.startsWith('data:') ? storagePath : null, error: null };
  }

  try {
    const { data, error } = await supabase.storage
      .from('incident-media')
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error) throw error;
    return { signedUrl: data.signedUrl, error: null };
  } catch (err: any) {
    console.error('Failed to create signed URL for private media:', err);
    return { signedUrl: null, error: err };
  }
}
