// src/components/auth/AuthModal.tsx
"use client";

import { useState } from "react";
import { CustomModal } from "../ui/CustomModal";
import { LoginStep } from "./LoginStep";
import { RegisterStep } from "./RegisterStep";
import { OtpStep } from "./OtpStep";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export type AuthStep = "LOGIN" | "REGISTER" | "OTP";

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>("LOGIN");
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState({
    contact: "",
    firstName: "",
    lastName: "",
    pinCode: "",
  });

  const handleClose = () => {
    setStep("LOGIN");
    setFormData({ contact: "", firstName: "", lastName: "", pinCode: "" });
    onClose();
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {step === "LOGIN" && (
            <LoginStep
              initialContact={formData.contact}
              onNext={(contact, needsRegistration) => {
                setDirection(1);
                setFormData((prev) => ({ ...prev, contact }));
                setStep(needsRegistration ? "REGISTER" : "OTP");
              }}
            />
          )}

          {step === "REGISTER" && (
            <RegisterStep
              initialData={formData}
              onNext={(data) => {
                setDirection(1);
                setFormData((prev) => ({ ...prev, ...data }));
                setStep("OTP");
              }}
              onBack={() => {
                setDirection(-1);
                setStep("LOGIN");
              }}
            />
          )}

          {step === "OTP" && (
            <OtpStep
              contact={formData.contact}
              onSuccess={() => {
                onSuccess();
                handleClose();
              }}
              onBack={() => {
                setDirection(-1);
                setStep("LOGIN");
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </CustomModal>
  );
}
