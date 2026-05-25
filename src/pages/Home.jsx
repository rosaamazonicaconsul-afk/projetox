import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/consortium/Header";
import LoginSection from "@/components/consortium/LoginSection";
import SignUpSection from "@/components/consortium/SignUpSection";
import ProfileSection from "@/components/consortium/ProfileSection";
import SuccessModal from "@/components/consortium/SuccessModal";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(/** @type {string | null} */(null));
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePlanSelect = (/** @type {string} */ plan) => {
    setSelectedPlan(plan);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignUpContinue = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setSelectedPlan(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header currentStep={currentStep} />

      {/* Envolvendo as transições em um container seguro com chaves estritas para zerar o erro de renderização do DOM */}
      <main className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" initial={false}>
          {currentStep === 1 && (
            <motion.div
              key="step-login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LoginSection onPlanSelect={handlePlanSelect} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-signup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SignUpSection
                selectedPlan={selectedPlan ?? ""}
                onContinue={handleSignUpContinue}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-profile"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ProfileSection
                selectedPlan={selectedPlan ?? ""}
                onConfirm={handleConfirm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </div>
  );
}