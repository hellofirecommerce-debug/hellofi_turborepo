import * as z from "zod";

// ── Base Schemas ──
export const contactSchema = z
  .string()
  .min(1, "Contact number is required")
  .regex(/^\d{10}$/, "Contact number must be exactly 10 digits")
  .refine((val) => !val.startsWith("0"), "Contact number cannot start with 0")
  .refine(
    (val) => ["6", "7", "8", "9"].includes(val.charAt(0)),
    "Contact number must start with 6, 7, 8, or 9",
  );

export const pinCodeSchema = z
  .string()
  .min(1, "Please Enter Your Pincode")
  .regex(/^\d{6}$/, "Pincode must be exactly 6 digits");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
  .transform((val) => val.trim())
  .refine((val) => val.length > 0, "Name cannot be empty");

export const otpSchema = z
  .string()
  .min(1, "OTP is required")
  .regex(/^\d{4}$/, "OTP must be exactly 4 digits");

// ── Main Form Schemas ──

// 1. Check User Status (Just needs contact)
export const checkUserStatusSchema = z.object({
  contact: contactSchema,
});

// 2. Send OTP (Just needs contact)
export const sendOTPSchema = z.object({
  contact: contactSchema,
});

// 3. Resend OTP (Just needs contact)
export const resendOTPSchema = z.object({
  contact: contactSchema,
});

// 4. Verify OTP (Needs contact + otp)
export const verifyOTPSchema = z.object({
  contact: contactSchema,
  otp: otpSchema,
});

// 5. Complete Registration (Needs name, contact, pincode)
export const userRegistrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  contact: contactSchema,
  pinCode: pinCodeSchema,
});

// ── Types (Inferred from Schemas) ──
export type CheckUserStatusInput = z.infer<typeof checkUserStatusSchema>;
export type SendOTPInput = z.infer<typeof sendOTPSchema>;
export type ResendOTPInput = z.infer<typeof resendOTPSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
