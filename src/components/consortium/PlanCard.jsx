import React from "react";
import { Check, Star, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";

const planConfigs = {
  diario: {
    icon: Zap,
    gradient: "from-[#1E3A8A] to-[#2563EB]",
    badge: null,
    price: "R$ 19,90",
    period: "/mês",
    features: [
      "Acesso ao WhatsApp",
      "Acesso ao Telegram",
      "Acesso a Localização em tempo real",
    ],
    cta: "Comprar",
    ctaClass: "bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white",
  },
  mensal: {
    icon: Star,
    gradient: "from-[#059669] to-[#10B981]",
    badge: "Mais Popular",
    price: "R$ 299,90",
    period: "/mês",
    features: [
      "Acesso ao WhatsApp",
      "Acesso ao Telegram",
      "Acesso a Localização em tempo real",
    ],
    cta: "Comprar",
    ctaClass: "bg-[#059669] hover:bg-[#059669]/90 text-white",
  },
  anual: {
    icon: Crown,
    gradient: "from-[#D97706] to-[#F59E0B]",
    badge: "Exclusivo",
    price: "R$ 899,90",
    period: "/mês",
    features: [
      "Acesso ao WhatsApp",
      "Acesso ao Telegram",
      "Acesso a Localização em tempo real",
    ],
    cta: "Comprar",
    ctaClass: "bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:opacity-90 text-white",
  },
};

/**
 * @param {object} props
 * @param {'diario' | 'mensal' | 'anual'} props.planKey
 * @param {function} props.onSelect
 * @param {number} props.index
 */
export default function PlanCard({ planKey, onSelect, index }) {
  // Captura a configuração garantindo letras minúsculas
  const rawKey = planKey ? planKey.toLowerCase() : "diario";

  // Cast estrito para o indexador mapear o objeto sem erro 7053
  const key = /** @type {'diario' | 'mensal' | 'anual'} */ (rawKey);
  const plan = planConfigs[key] || planConfigs.diario;

  const Icon = plan.icon;
  const isPopular = key === "mensal";
  const isPremium = key === "anual";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative group w-full ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
    >
      {plan.badge && (
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-xs font-bold text-white tracking-wide shadow-lg ${isPremium
              ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B]"
              : "bg-[#059669]"
            }`}
        >
          {plan.badge}
        </div>
      )}

      <div
        className={`relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isPopular
            ? "border-[#059669]/30 shadow-xl shadow-[#059669]/5 ring-1 ring-[#059669]/10"
            : isPremium
              ? "border-[#D97706]/30 shadow-xl shadow-[#059669]/5 ring-1 ring-[#D97706]/10"
              : "border-border shadow-lg"
          }`}
      >
        <div className={`h-1.5 bg-gradient-to-r ${plan.gradient}`} />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-md`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground capitalize">
              {key}
            </h3>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {plan.price}
            </span>
            <span className="text-muted-foreground text-sm">{plan.period}</span>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((/** @type {string} */ f, /** @type {number} */ i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelect(key)}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.ctaClass} shadow-md hover:shadow-lg active:scale-[0.98]`}
          >
            {plan.cta}
          </button>
        </div>
      </div>
    </motion.div>
  );
}