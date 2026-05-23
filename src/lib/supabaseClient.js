import { createClient } from "@supabase/supabase-js"

// Informa ao validador estrito que o import.meta contém propriedades dinâmicas do Vite
/** @type {any} */
const meta = import.meta

// Busca de forma segura nas variáveis do Vite usando encadeamento opcional
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || ""
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Atenção: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram detectadas no ambiente corrente."
  )
}

// Inicializa o cliente garantindo strings substitutas seguras para não quebrar o build se o Vite atrasar a leitura
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url-para-evitar-erro.supabase.co",
  supabaseAnonKey || "placeholder-key"
)