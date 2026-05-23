import React from "react";
import { Shield, ChevronRight } from "lucide-react";

/**
 * @param {object} props
 * @param {number} props.currentStep
 */
export default function Header({ currentStep }) {
  const steps = [
    { label: "Acesso", num: 1 },
    { label: "Cadastro", num: 2 },
    { label: "Perfil", num: 3 },
  ];

  return (
    <header className="w-full bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#D97706] flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight leading-none">
              ConsórcioPro
            </h1>
            <p className="text-[10px] sm:text-xs text-blue-300 tracking-widest uppercase">
              Plataforma Segura
            </p>
          </div>
        </div>

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