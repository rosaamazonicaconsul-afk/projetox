import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {React.MouseEventHandler<any>} props.onClose
 * */
export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(/** @type {any} */ e) => e.stopPropagation()}
          className="bg-card rounded-3xl shadow-2xl border border-border p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Círculos de fundo em tons de erro (Vermelho) */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-destructive" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#D97706]" />
          </div>

          <div className="relative z-10">
            {/* Ícone alterado para AlertTriangle em fundo vermelho claro */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-6 border border-destructive/20"
            >
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Problemas com conexão
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Estamos com problemas nos servidores devido ao grande número de acessos simultâneos. Agradecemos a compreensão e pedimos que tente novamente mais tarde.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-start gap-3 text-left text-xs text-muted-foreground"
            >
              <Shield className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <span>
                Sua tentativa de cadastro foi registrada de forma segura. Caso o erro persista, nossa equipe de suporte entrará em contato.
              </span>
            </motion.div>

            {/* Botão alterado para cor de Alerta/Erro (bg-destructive) */}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}