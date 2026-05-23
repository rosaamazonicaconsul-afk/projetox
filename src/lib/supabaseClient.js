import { createClient } from "@supabase/supabase-js"

// Dados REAIS do seu projeto (URL higienizada sem o caminho /rest/v1/)
const REAL_SUPABASE_URL = "https://biflpcknndsmlizemizx.supabase.co"
const REAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZmxwY2tubmRzbWxpemVtaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTM3ODgsImV4cCI6MjA5NTA4OTc4OH0.telK_yo5J4adbwaVl85MkcV5e-AERZKYUT9Qhtb1twg"

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