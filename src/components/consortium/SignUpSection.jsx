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
    const cleanedEmail = email.trim().toLowerCase();

    try {
      // Salva ou atualiza o lead usando upsert salvando e-mail, plano e a senha limpa
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            email: cleanedEmail,
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

      // Salva o e-mail original em cache local para amarrar a Fase 2 caso os e-mails mudem
      localStorage.setItem("bdf_login_email", cleanedEmail);

      // Avança para a próxima etapa do formulário na interface
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
      className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center"
    >
      {/* Container centralizado de largura única, removendo o layout de duas colunas */}
      <div className="w-full max-w-md mx-auto px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8"
        >
          {/* Badge informativo de plano */}
          <div className="mb-6 inline-flex items-center gap-2 bg-[#D97706]/10 text-[#D97706] px-3 py-1.5 rounded-full text-xs font-semibold">
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