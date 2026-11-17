// src/components/auth/RegisterStep.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER_AND_SEND_USER_OTP } from "../../lib/graphql/mutations/userAuth.mutations";
import { motion } from "motion/react";

interface RegisterStepProps {
  initialData: {
    contact: string;
    firstName: string;
    lastName: string;
    pinCode: string;
  };
  onNext: (data: {
    firstName: string;
    lastName: string;
    pinCode: string;
  }) => void;
  onBack: () => void;
}

export function RegisterStep({
  initialData,
  onNext,
  onBack,
}: RegisterStepProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [pinCode, setPinCode] = useState(initialData.pinCode);
  const [error, setError] = useState("");

  const [registerAndSendOtp, { loading }] = useMutation<any>(
    REGISTER_AND_SEND_USER_OTP,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || pinCode.length !== 6) {
      setError("Please fill all fields correctly. Pincode must be 6 digits.");
      return;
    }

    try {
      const { data } = await registerAndSendOtp({
        variables: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          contact: initialData.contact,
          pinCode,
        },
      });

      if (!data?.registerAndSendUserOTP?.success) {
        setError(data?.registerAndSendUserOTP?.message || "Failed to send OTP");
        return;
      }

      onNext({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        pinCode,
      });
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  const inputClass =
    "flex-1 w-full bg-[#F0F5FF] border-2 border-[#0066FF]/30 rounded-xl px-4 py-3 outline-none text-gray-900 placeholder:text-gray-400 font-medium focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all";
  const labelClass = "text-sm font-bold text-gray-800 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col pt-2">
      <h2 className="text-[26px] font-extrabold text-gray-900 mb-2 text-center">
        Just one step away
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Please complete your profile to proceed
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className={inputClass}
            autoFocus
          />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClass}>Pincode</label>
        <input
          value={pinCode}
          inputMode="numeric"
          onChange={(e) =>
            setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="560001"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-2/3 bg-[#0066FF] hover:bg-[#0057D9] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 shadow-lg shadow-blue-500/30"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </motion.button>
      </div>
    </form>
  );
}
