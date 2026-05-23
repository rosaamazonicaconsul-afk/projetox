import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  Mail,
  KeyRound,
  Hash,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";

// Cast dos componentes externos para 'any' para neutralizar a validação estrita do checkJs no JSX
/** @type {any} */
const Input = ShadcnInput;
/** @type {any} */
const Label = ShadcnLabel;
/** @type {any} */
const Select = ShadcnSelect;
/** @type {any} */
const SelectContent = ShadcnSelectContent;
/** @type {any} */
const SelectItem = ShadcnSelectItem;
/** @type {any} */
const SelectTrigger = ShadcnSelectTrigger;
/** @type {any} */
const SelectValue = ShadcnSelectValue;

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

function buildMonthOptions() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const months = [];
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  for (let y = currentYear; y <= currentYear + 15; y++) {
    const startMonth = y === currentYear ? currentMonth : 0;
    for (let m = startMonth; m < 12; m++) {
      months.push({ value: `${y}-${String(m + 1).padStart(2, "0")}`, label: `${monthNames[m]} ${y}` });
    }
  }
  return months;
}

/**
 * @param {object} props
 * @param {string} props.selectedPlan
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.onConfirm
 */
export default function ProfileSection({ selectedPlan, onConfirm }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cep: "",
    email: "",
    token: "",
    grupo: "",
    finalizacao: "",
  });

  const monthOptions = buildMonthOptions();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField icon={User} label="Nome Completo" className="md:col-span-2">
            <Input
              placeholder="Maria da Silva"
              value={form.nome}
              onChange={(/** @type {any} */ e) => update("nome", e.target.value)}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={CreditCard} label="CPF">
            <Input
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(/** @type {any} */ e) => update("cpf", formatCPF(e.target.value))}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={Phone} label="Telefone">
            <Input
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={(/** @type {any} */ e) => update("telefone", formatPhone(e.target.value))}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={MapPin} label="CEP">
            <Input
              placeholder="00000-000"
              value={form.cep}
              onChange={(/** @type {any} */ e) => update("cep", formatCEP(e.target.value))}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={Mail} label="E-mail">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(/** @type {any} */ e) => update("email", e.target.value)}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={KeyRound} label="Número Token">
            <div className="relative">
              <Input
                placeholder="TOKEN-XXXX-XXXX"
                value={form.token}
                onChange={(/** @type {any} */ e) => update("token", e.target.value.toUpperCase())}
                className="h-12 bg-secondary/50 font-mono tracking-wider"
              />
              <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#059669]" />
            </div>
          </FormField>

          <FormField icon={Hash} label="Número do Grupo">
            <Input
              placeholder="Ex: 1042"
              value={form.grupo}
              onChange={(/** @type {any} */ e) => update("grupo", e.target.value.replace(/\D/g, ""))}
              className="h-12 bg-secondary/50"
            />
          </FormField>

          <FormField icon={Calendar} label="Data de Finalização">
            <Select value={form.finalizacao} onValueChange={(/** @type {string} */ v) => update("finalizacao", v)}>
              <SelectTrigger className="h-12 bg-secondary/50">
                <SelectValue placeholder="Selecione mês/ano" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            onClick={onConfirm}
            className="w-full py-4 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#059669] text-white font-bold text-base rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Confirmar Cadastro
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}