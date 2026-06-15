import { createClient } from "@supabase/supabase-js";

// Cliente Supabase server-side (service role). Nunca expor no browser.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  // Placeholders para o build do Next.js nao quebrar quando as envs ainda nao existem.
  // Em runtime (Vercel/local) as variaveis reais devem estar configuradas.
  console.warn("[db] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente - usando placeholder (apenas build).");
}

export const db = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceKey || "placeholder-key",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
