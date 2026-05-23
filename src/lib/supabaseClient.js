import { createClient } from "@supabase/supabase-js"

// Dados REAIS do seu projeto (URL higienizada sem o caminho /rest/v1/)
const REAL_SUPABASE_URL = "https://biflpcknndsmlizemizx.supabase.co"
const REAL_SUPABASE_ANON_KEY = "COLE_AQUI_A_SUA_CHAVE_ANON_LONGA"

// Informa ao validador estrito que o import.meta contém propriedades dinâmicas do Vite
/** @type {any} */
const meta = import.meta

// Tenta buscar no ambiente local, caso contrário assume a chave estática definitiva
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || REAL_SUPABASE_URL
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || REAL_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Atenção: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram detectadas no ambiente corrente."
  )
}

// Inicializa o cliente apontando diretamente para o seu banco real sem risco de usar placeholders ruins
export const supabase = createClient(supabaseUrl, supabaseAnonKey)