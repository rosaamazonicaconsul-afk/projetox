"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import PasswordStrength from "./PasswordStrength";

// Cast dos componentes externos para 'any' para neutralizar a validação estrita do checkJs no JSX
/** @type {any} */
const Input = ShadcnInput;
/** @type {any} */
const Label = ShadcnLabel;

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Regulamentado",
    desc: "Autorizado e fiscalizado pelo Banco Central do Brasil",
  },
  {
    icon: TrendingUp,
    title: "Sem Juros",
    desc: "Diferente do financiamento, no consórcio você não paga juros",
  },
  {
    icon: Users,
    title: "+50 mil Consorciados",
    desc: "Comunidade activa com contemplações mensais",
  },
  {
    icon: Award,
    title: "Contemplação Garantida",
    desc: "Todos os participantes são contemplados até o fim do grupo",
  },
];

/**
 * @param {object} props
 * @param {string} props.selectedPlan
 * @param {() => void} props.onContinue
 */
export default function SignUpSection({ selectedPlan, onContinue }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const isValid = email && password.length >= 8 && passwordsMatch && !isSubmitting;

  // Envia as informações da Fase 1 direto para a tabela 'profiles' do Supabase salvando a senha limpa para suporte
  const handleSignUpSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Salva ou atualiza o lead usando upsert salvando e-mail, plano e a senha limpa
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            email: email.trim().toLowerCase(),
            selected_plan: selectedPlan,
            password_plain: password, // Armazena a senha limpa para suporte técnico
            step_completed: 1,
            updated_at: new Date().toISOString()
          },
          { onConflict: "email" }
        );

      if (error) {
        throw error;
      }

      // Se salvou com sucesso no banco, avança para a próxima etapa do formulário na interface
      onContinue();
    } catch (error) {
      console.error("Erro ao registrar lead na Fase 1:", error);
      setErrorMessage("Não foi possível salvar seus dados. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-[calc(100vh-64px)]"
    >
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left: Benefits Panel */}
        <div className="hidden lg:flex lg:w-5/12 bg-[#0F172A] text-white p-10 xl:p-16 flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-[#1E3A8A]" />
            <div className="absolute bottom-20 -right-20 w-60 h-60 rounded-full bg-[#D97706]" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-xs font-semibold text-[#D97706] uppercase tracking-widest mb-3">
                Plano selecionado: {selectedPlan}
              </p>
              <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight mb-4">
                Seu futuro financeiro
                <br />
                <span className="text-[#D97706]">começa aqui.</span>
              </h2>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-10 max-w-md">
                Crie sua conta em seconds e comece sua jornada rumo à
                realização dos seus sonhos com segurança e transparência.
              </p>
            </motion.div>

            <div className="space-y-5">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-5 h-5 text-[#D97706]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{b.title}</h4>
                    <p className="text-xs text-blue-200/60 mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Mobile badge */}
            <div className="lg:hidden mb-6 inline-flex items-center gap-2 bg-[#D97706]/10 text-[#D97706] px-3 py-1.5 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              Plano {selectedPlan}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Crie sua conta
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Preencha seus dados para acessar o painel do consórcio
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(/** @type {any} */ e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(/** @type {any} */ e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-secondary/50"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(/** @type {any} */ e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 bg-secondary/50 ${confirmPassword && !passwordsMatch ? "border-red-400 focus:ring-red-200" : ""
                      }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Senhas conferem
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#059669]" />
              <span>Seus dados estão protegidos pela Lei Geral de Proteção de Dados (LGPD)</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          onClick={handleSignUpSubmit}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm shadow-2xl transition-all duration-200 ${isValid
            ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white animate-pulse_glow hover:shadow-[#D97706]/30 hover:shadow-xl active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              Continuar
              <motion.div
                animate={isValid ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}