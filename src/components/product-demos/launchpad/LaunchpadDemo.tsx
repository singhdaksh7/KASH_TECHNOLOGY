"use client";

import { useState } from "react";
import { LaunchpadStep, LaunchpadFormState, INITIAL_FORM_STATE } from "./types";
import { BrowserFrame } from "../shared/BrowserFrame";
import { LaunchpadHeader } from "./LaunchpadHeader";
import { LaunchpadStepper } from "./LaunchpadStepper";
import { WalletStep } from "./WalletStep";
import { TokenCreationStep } from "./TokenCreationStep";
import { PresaleConfigurationStep } from "./PresaleConfigurationStep";
import { ReviewStep } from "./ReviewStep";
import { PublishedStep } from "./PublishedStep";
import { PublicPresalePreview } from "./PublicPresalePreview";
import { validateTokenStep, validatePresaleStep } from "./validation";
import { AnimatePresence, motion } from "framer-motion";

export function LaunchpadDemo() {
  const [step, setStep] = useState<LaunchpadStep>("wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [formState, setFormState] = useState<LaunchpadFormState>(INITIAL_FORM_STATE);

  const handleFieldChange = (field: keyof LaunchpadFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setStep("wallet");
    setIsConnected(false);
    setFormState(INITIAL_FORM_STATE);
  };

  const renderStep = () => {
    switch (step) {
      case "wallet":
        return <WalletStep isConnected={isConnected} onConnect={() => setIsConnected(true)} onNext={() => setStep("token")} />;
      case "token":
        return <TokenCreationStep 
          state={formState} 
          errors={validateTokenStep(formState)}
          onChange={handleFieldChange} 
          onNext={() => setStep("presale")} 
          onBack={() => setStep("wallet")}
        />;
      case "presale":
        return <PresaleConfigurationStep 
          state={formState} 
          errors={validatePresaleStep(formState)}
          onChange={handleFieldChange} 
          onNext={() => setStep("review")} 
          onBack={() => setStep("token")}
        />;
      case "review":
        return <ReviewStep state={formState} onNext={() => setStep("published")} onBack={() => setStep("presale")} />;
      case "published":
        return <PublishedStep state={formState} onViewPresale={() => setStep("public_preview")} onReset={handleReset} />;
      case "public_preview":
        return <PublicPresalePreview state={formState} onBack={() => setStep("published")} />;
    }
  };

  return (
    <BrowserFrame>
      {step !== "public_preview" && <LaunchpadHeader isConnected={isConnected} />}
      <LaunchpadStepper currentStep={step} />
      
      <div className="flex-1 w-full relative overflow-hidden flex flex-col bg-[#050505]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </BrowserFrame>
  );
}
