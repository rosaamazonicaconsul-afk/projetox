"use client"

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  UserCheck,
  Clock,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/**
 * @typedef {object} Profile
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {string} cpf
 * @property {string} phone
 * @property {string} selected_plan
 * @property {number} step_completed
 * @property {string} updated_at
 */

export default function AdminDashboard() {
  // Ajustado o cast diretamente dentro do useState para resolver o erro de 'never[]'
  const [profiles, setProfiles] = useState(/** @type {Profile[]} */([]));
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStep, setFilterStep] = useState("all");

  // Busca dados em tempo real diretamente do Supabase ordenando cronologicamente por padrão
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProfiles(data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filtros de busca dinâmica no lado do cliente
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

  // Função auxiliar para formatar a data e horário amigavelmente no padrão brasileiro
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
        minute: "2-digit",
        second: "2-digit"
      });
      return { date, time };
    } catch (e) {
      return { date: "—", time: "—" };
    }
  };

  // Cálculos de métricas rápidas baseados nos dados reais do banco
  const totalSubscribers = profiles.length;
  const completedRegistrations = profiles.filter(p => p.step_completed === 3).length;
  const pendingRegistrations = profiles.filter(p => p.step_completed === 2).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 lg:p-10 font-inter">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-slate-400 text-sm mt-1">Linha do tempo de informações recebidas e atualizadas por data e horário.</p>
        </div>
        <button
          onClick={fetchProfiles}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors text-sm rounded-xl font-medium border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar Dados
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Total de Leads</p>
            <h3 className="text-2xl font-bold mt-0.5">{totalSubscribers}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Cadastro Completo (Fase 3)</p>
            <h3 className="text-2xl font-bold mt-0.5">{completedRegistrations}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Incompletos (Fase 2)</p>
            <h3 className="text-2xl font-bold mt-0.5">{pendingRegistrations}</h3>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl pl-10 pr-4 h-11 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={filterStep}
            onChange={(e) => setFilterStep(e.target.value)}
            className="w-full sm:w-48 bg-slate-950 border border-slate-800 text-sm rounded-xl px-3 h-11 text-slate-200 focus:outline-none focus:border-slate-700 transition-colors"
          >
            <option value="all">Todas as etapas</option>
            <option value="3">Finalizados (Fase 3)</option>
            <option value="2">Incompletos (Fase 2)</option>
          </select>
        </div>
      </div>

      {/* Table Container - Configurada para foco em Data e Horário */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-950">
                <th className="p-4 pl-6 w-52">Data / Horário</th>
                <th className="p-4">Informações do Cliente</th>
                <th className="p-4">Documento</th>
                <th className="p-4">Plano Escolhido</th>
                <th className="p-4">Status do Fluxo</th>
                <th className="p-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Carregando logs de registros...
                  </td>
                </tr>
              ) : filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Nenhuma informação encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => {
                  const { date, time } = formatDateTime(profile.updated_at);
                  return (
                    <tr key={profile.id} className="hover:bg-slate-850/40 transition-colors">
                      {/* Coluna Principal Desmembrada por Data e Horário */}
                      <td className="p-4 pl-6 align-middle border-r border-slate-800/40 bg-slate-950/20">
                        <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {date}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5 pl-5">
                          {time}
                        </div>
                      </td>

                      <td className="p-4 align-middle">
                        <div className="font-semibold text-slate-200">
                          {profile.full_name || "Nome não preenchido"}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{profile.email}</div>
                        {profile.phone && (
                          <div className="text-xs text-slate-500 mt-0.5">{profile.phone}</div>
                        )}
                      </td>

                      <td className="p-4 align-middle text-slate-300 font-mono text-xs">
                        {profile.cpf || "—"}
                      </td>

                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-[#D97706]">
                          {profile.selected_plan || "Não definido"}
                        </span>
                      </td>

                      <td className="p-4 align-middle">
                        {profile.step_completed === 3 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Sucesso (Fase 3)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                            <Clock className="w-3.5 h-3.5" /> Abandono (Fase 2)
                          </span>
                        )}
                      </td>

                      <td className="p-4 pr-6 align-middle text-right">
                        <button
                          onClick={() => alert(`Visualizando detalhes do ID seguro: ${profile.id}`)}
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          Ver Detalhes
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}