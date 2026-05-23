import { createClient } from "@supabase/supabase-js"

// Informa ao validador estrito que o import.meta contém propriedades dinâmicas do Vite
/** @type {any} */
const meta = import.meta

const supabaseUrl = meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = meta.env.VITE_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Atenção: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram detectadas no seu arquivo .env"
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)