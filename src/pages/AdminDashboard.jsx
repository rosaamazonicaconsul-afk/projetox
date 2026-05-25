"use client"

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Mail,
  Lock,
  CreditCard,
  Phone,
  MapPin,
  KeyRound,
  Hash,
  Layers
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/**
 * @typedef {object} Profile
 * @property {string} id
 * @property {string} email
 * @property {string} password_plain
 * @property {string} full_name
 * @property {string} cpf
 * @property {string} phone
 * @property {string} cep
 * @property {string} token_number
 * @property {string} group_number
 * @property {string} end_date
 * @property {string} selected_plan
 * @property {number} step_completed
 * @property {string} updated_at
 */

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState(/** @type {Profile[]} */([]));
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStep, setFilterStep] = useState("all");

  // Busca os dados ordenando sempre do mais recente para o mais antigo
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      if (data) setProfiles(data);
    } catch (error) {
      console.error("Erro ao buscar dados do Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filtros dinâmicos de busca
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      (p.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.cpf || "").includes(searchTerm);

    const matchesStep =
      filterStep === "all" ||
      p.step_completed === parseInt(filterStep, 10);

    return matchesSearch && matchesStep;
  });

  // Formata data e hora separadamente
  const formatDateTime = (/** @type {string} */ isoString) => {
    if (!isoString) return { date: "—", time: "—" };
    try {
      const dateObj = new Date(isoString);
      const date = dateObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const time = dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return { date, time };
    } catch (e) {
      return { date: "—", time: "—" };
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-4 sm:p-6 lg:p-10 font-inter">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Registros de Formulários</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Acompanhamento simples de leads em tempo real por ordem de chegada.</p>
        </div>
        <button
          onClick={fetchProfiles}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-all text-xs font-semibold rounded-xl border border-slate-700 text-white w-full sm:w-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Atualizar Lista
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg pl-9 pr-4 h-10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={filterStep}
            onChange={(e) => setFilterStep(e.target.value)}
            className="w-full md:w-48 bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 h-10 text-slate-200 focus:outline-none focus:border-slate-700"
          >
            <option value="all">Todas as etapas</option>
            <option value="3">Finalizados (Fase 3)</option>
            <option value="2">Perfil Parcial (Fase 2)</option>
            <option value="1">Apenas Conta (Fase 1)</option>
          </select>
        </div>
      </div>

      {/* Grid de Caixas Simples */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
          Carregando formulários...
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
          Nenhum formulário localizado com os critérios informados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((profile) => {
            const { date, time } = formatDateTime(profile.updated_at);
            const planText = !profile.selected_plan || profile.selected_plan === "EMPTY" ? "Não escolhido" : profile.selected_plan;

            return (
              <div
                key={profile.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                {/* Topo da Caixa: Data e Hora */}
                <div className="bg-slate-950/60 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{time}</span>
                  </div>
                </div>

                {/* Conteúdo do Formulário */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1">

                  {/* Nome Completo */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3" /> Nome Completo
                    </span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">
                      {profile.full_name || <span className="text-slate-600 font-normal italic">Não preenchido</span>}
                    </p>
                  </div>

                  {/* E-mail Cadastrado */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                      <Mail className="w-3 h-3" /> E-mail da Conta
                    </span>
                    <p className="text-xs font-mono text-slate-300 mt-0.5 break-all">
                      {profile.email || "—"}
                    </p>
                  </div>

                  {/* Senha Limpa */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-500/80 tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Senha do Usuário
                    </span>
                    <p className="text-xs font-mono bg-slate-950/40 text-amber-400 px-2 py-1 rounded border border-amber-500/10 w-fit mt-1 font-semibold">
                      {profile.password_plain || <span className="text-slate-600 font-normal italic">Sem senha</span>}
                    </p>
                  </div>

                  {/* Divisor interno simples */}
                  <hr className="border-slate-800/60" />

                  {/* Grid de documentos e contato */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> CPF
                      </span>
                      <p className="text-xs font-mono text-slate-300 mt-0.5">
                        {profile.cpf || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Telefone
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {profile.phone || "—"}
                      </p>
                    </div>
                  </div>

                  {/* CEP */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> CEP Residencial
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {profile.cep || "—"}
                    </p>
                  </div>

                  {/* Divisor interno secundário */}
                  <hr className="border-slate-800/60" />

                  {/* Grid de Token, Grupo e Finalização */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                        <KeyRound className="w-3 h-3" /> Número Token
                      </span>
                      <p className="text-xs font-mono text-slate-300 mt-0.5 uppercase break-all">
                        {profile.token_number || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Grupo
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {profile.group_number || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Data de Finalização */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Mês/Ano Finalização
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {profile.end_date || "—"}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card: Identificação do Plano e Etapa */}
                <div className="bg-slate-950/30 px-4 py-3 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                    Plano: {planText}
                  </span>

                  {profile.step_completed === 3 ? (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Fase 3 (Completo)
                    </span>
                  ) : profile.step_completed === 2 ? (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      Fase 2 (Parcial)
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      Fase 1 (Apenas Conta)
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}