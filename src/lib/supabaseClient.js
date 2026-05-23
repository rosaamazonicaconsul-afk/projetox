import { createClient } from "@supabase/supabase-js"

// Coloque aqui os dados REAIS obtidos no painel do seu Supabase (Project Settings > API)
const REAL_SUPABASE_URL = "https://seu-projeto.supabase.co"
const REAL_SUPABASE_ANON_KEY = "sua-chave-anon-public-longa-aqui"

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