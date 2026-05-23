import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/consortium/Header";
import LoginSection from "@/components/consortium/LoginSection";
import SignUpSection from "@/components/consortium/SignUpSection";
import ProfileSection from "@/components/consortium/ProfileSection";
import SuccessModal from "@/components/consortium/SuccessModal";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  // Inicializa informando ao validador o tipo correto aceito pelo estado
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

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <LoginSection key="login" onPlanSelect={handlePlanSelect} />
        )}
        {currentStep === 2 && (
          <SignUpSection
            key="signup"
            selectedPlan={selectedPlan ?? ""}
            onContinue={handleSignUpContinue}
          />
        )}
        {currentStep === 3 && (
          <ProfileSection
            key="profile"
            selectedPlan={selectedPlan ?? ""}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </div>
  );
}