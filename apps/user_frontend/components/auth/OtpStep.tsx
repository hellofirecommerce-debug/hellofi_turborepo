// src/components/auth/OtpStep.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  VERIFY_USER_OTP,
  RESEND_USER_OTP,
} from "../../lib/graphql/mutations/userAuth.mutations";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";

interface OtpStepProps {
  contact: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OtpStep({ contact, onSuccess, onBack }: OtpStepProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [verifyOtp, { loading }] = useMutation<any>(VERIFY_USER_OTP);
  const [resendOtp] = useMutation<any>(RESEND_USER_OTP);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const { data } = await verifyOtp({
        variables: { input: { contact, otp } },
      });

      if (!data?.verifyUserOTP?.success) {
        setError(data?.verifyUserOTP?.message || "Invalid OTP");
        return;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ variables: { contact } });
      setSuccessMsg("OTP resent successfully!");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4 mt-4">
      <p className="text-sm text-gray-600 text-center">
        We sent a 4-digit code to <br />
        <span className="font-bold text-black">+91 {contact}</span>
      </p>
      <div>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="0000"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          className="text-center text-2xl tracking-widest font-mono"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-xs mt-2 text-center">
            {successMsg}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || otp.length !== 4}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </Button>

      <div className="flex justify-between items-center text-sm mt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:underline"
        >
          Change Number
        </button>
        <button
          type="button"
          onClick={handleResend}
          className="text-blue-600 font-medium hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
}
