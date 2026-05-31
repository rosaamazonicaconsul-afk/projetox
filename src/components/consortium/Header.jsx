import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * @param {object} props
 * @param {number} props.currentStep
 */
export default function Header({ currentStep }) {
  const steps = [
    { label: "Acesso", num: 1 },
    { label: "Cadastro", num: 2 },
    { label: "Pagamento", num: 3 },
  ];

  return (
    <header className="w-full bg-[#0F172A] text-white">
      {/* Alinhamento ajustado para justify-end para manter os passos organizados à direita após a remoção da logo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-end">

        {/* Lado Direito (Desktop): Menu de Passos do Formulário */}
        <nav className="hidden sm:flex items-center gap-1">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${currentStep >= s.num
                      ? "bg-[#D97706] text-white shadow-md"
                      : "bg-white/10 text-white/40"
                    }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-sm transition-colors duration-300 ${currentStep >= s.num ? "text-white font-medium" : "text-white/40"
                    }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20 mx-1" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Lado Direito (Mobile): Indicadores Simplificados em Bolinhas */}
        <div className="sm:hidden flex items-center gap-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentStep >= s.num ? "bg-[#D97706] scale-110" : "bg-white/20"
                }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}