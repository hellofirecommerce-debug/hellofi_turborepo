// src/components/auth/LoginStep.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SEND_USER_OTP } from "../../lib/graphql/mutations/userAuth.mutations";
import { ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";

interface LoginStepProps {
  initialContact: string;
  onNext: (contact: string, needsRegistration: boolean) => void;
}

export function LoginStep({ initialContact, onNext }: LoginStepProps) {
  const [contact, setContact] = useState(initialContact);
  const [error, setError] = useState("");

  const [sendOtp, { loading }] = useMutation<any>(SEND_USER_OTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (contact.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const { data } = await sendOtp({ variables: { contact } });
      const result = data?.sendUserOTP;

      // Not registered → collect name + pincode first (no OTP was sent)
      if (result?.needsRegistration) {
        onNext(contact, true);
        return;
      }

      if (result?.success) {
        onNext(contact, false); // OTP already sent
        return;
      }

      setError(result?.message || "Could not send OTP");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center pt-2">
      <h2 className="text-[26px] font-extrabold text-gray-900 mb-2">
        Log in or Sign Up
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Enter your 10-digit mobile number to continue
      </p>

      <div className="w-full mb-4">
        <label className="text-sm font-bold text-gray-800 mb-2 block">
          Mobile Number
        </label>

        <div className="flex items-center w-full border-2 border-[#0066FF] rounded-xl overflow-hidden bg-[#F0F5FF] transition-colors focus-within:ring-2 focus-within:ring-[#0066FF]/20">
          <div className="bg-white border-r border-[#0066FF]/20 px-4 py-3.5 flex items-center justify-center">
            <span className="text-gray-900 font-bold">+91</span>
          </div>

          <input
            type="tel"
            placeholder="10-digit phone number"
            value={contact}
            onChange={(e) =>
              setContact(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="flex-1 bg-transparent px-4 py-3.5 outline-none text-gray-900 placeholder:text-gray-400 font-medium"
            autoFocus
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-[#0066FF] hover:bg-[#0057D9] text-white font-bold text-lg py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center shadow-lg shadow-blue-500/30"
      >
        {loading ? "Please wait..." : "Continue"}
      </motion.button>

      <p className="text-xs text-center text-gray-500 mt-6 leading-relaxed">
        By continuing, you agree to HelloFi's{" "}
        <a href="#" className="font-bold text-[#0066FF] hover:underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="font-bold text-[#0066FF] hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <div className="w-full mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
          100% Safe & Secure
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#0066FF]" />
          Instant Payout
        </div>
      </div>
    </form>
  );
}
