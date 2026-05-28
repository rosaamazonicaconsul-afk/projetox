import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { Button as ShadcnButton } from "@/components/ui/button";
import PlanCard from "./PlanCard";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

// Cast dos componentes para 'any' para neutralizar a validação estrita do checkJs no JSX
/** @type {any} */
const Input = ShadcnInput;
/** @type {any} */
const Checkbox = ShadcnCheckbox;
/** @type {any} */
const Label = ShadcnLabel;
/** @type {any} */
const Button = ShadcnButton;

/**
 * @param {object} props
 * @param {function} props.onPlanSelect
 * */
export default function LoginSection({ onPlanSelect }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Definindo a lista de chaves com tipagem estrita para o validador aceitar no PlanCard
  /** @type {('basico' | 'plus' | 'premium')[]} */
  const plans = ["basico", "plus", "premium"];

  // Função responsável por autenticar e verificar o perfil do usuário
  const handleLogin = async (/** @type {any} */ e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Realiza a autenticação direta no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }

      // Captura o metadado que adicionamos via SQL Editor
      const isAdmin = data?.user?.user_metadata?.is_admin;

      if (isAdmin === true) {
        // Redireciona o administrador direto para a rota do painel
        navigate("/admin");
      } else {
        // Caso seja um cliente comum tentando logar, avança para a escolha padrão de planos
        setErrorMessage("Acesso restrito para administradores.");
      }
    } catch (err) {
      setErrorMessage("Ocorreu um erro ao tentar realizar o acesso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Login Card */}
      <section className="max-w-md mx-auto px-4 pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            {/* Logotipo customizado inserido no lugar do escudo antigo */}
            <div className="mx-auto flex items-center justify-center mb-4">
              <img
                src="/logo.png"
                alt="Logo ConsórcioPro"
                className="h-24 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sua segurança é nossa prioridade
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(/** @type {any} */ e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-secondary/50 border-border focus:ring-2 focus:ring-[#1E3A8A]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(/** @type {any} */ e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-secondary/50 border-border focus:ring-2 focus:ring-[#1E3A8A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <button type="button" className="text-sm text-[#1E3A8A] hover:underline font-medium">
                Esqueci o número
              </button>
            </div>

            {/* Exibição de alertas de erro amigáveis */}
            {errorMessage && (
              <div className="text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-lg text-center">
                {errorMessage}
              </div>
            )}

            {/* Botão integrado com o design do sistema */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1E3A8A] hover:bg-[#152963] text-white font-medium rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Conexão protegida com criptografia de ponta a ponta</span>
          </div>
        </motion.div>
      </section>

      {/* Plans Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold text-[#D97706] uppercase tracking-widest mb-2">
            Planos de Consórcio
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Escolha o plano ideal para você
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            Grupos auditados pelo Banco Central — mais de 50.000 clientes satisfeitos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((key, i) => (
            <PlanCard key={key} planKey={key} onSelect={onPlanSelect} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          ✓ Cancelamento gratuito em até 7 dias &nbsp;·&nbsp; ✓ Sem taxas ocultas &nbsp;·&nbsp; ✓ Garantia de satisfação
        </motion.p>
      </section>
    </motion.div>
  );
}