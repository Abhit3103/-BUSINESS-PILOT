import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const bucket = import.meta.env.VITE_SUPABASE_BUCKET || 'product-images';

let client = null;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!client) client = createClient(supabaseUrl, supabaseKey);
  return client;
}

export function isUploadConfigured() {
  return Boolean(getSupabase());
}

/**
 * @param {File} file
 * @param {(progress: number) => void} [onProgress]
 */
export async function uploadProductImage(file, onProgress) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase storage is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  onProgress?.(10);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  onProgress?.(90);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  onProgress?.(100);
  return data.publicUrl;
}
