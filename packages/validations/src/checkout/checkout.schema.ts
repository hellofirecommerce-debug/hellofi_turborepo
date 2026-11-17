import { z } from "zod";
import { GraphQLError } from "graphql";

const MOBILE = /^[6-9]\d{9}$/;
const GST = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const UPI = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const emptyToUndefined = (v: string | null | undefined) => v || undefined;

export const addressInputSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(60),
  contact: z.string().trim().regex(MOBILE, "Enter a valid 10-digit mobile number"),
  alternateContactNo: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform(emptyToUndefined)
    .refine((v) => !v || MOBILE.test(v), "Enter a valid alternate number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  address: z.string().trim().min(5, "Address is too short").max(250),
  pinCode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  landMark: z.string().trim().max(120).optional().nullable().transform(emptyToUndefined),
  cityDistrict: z.string().trim().min(2, "Enter city").max(60),
  state: z.string().trim().min(2, "Enter state").max(60),
  gst: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .nullable()
    .transform(emptyToUndefined)
    .refine((v) => !v || GST.test(v), "Enter a valid GSTIN"),
  addressType: z.enum(["HOME", "WORK", "OTHER"]),
  isDefault: z.boolean().optional().default(false),
});

export const schedulePickupSchema = z.object({
  method: z.enum(["DOORSTEP", "DROP_TO_OFFICE"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"), // YYYY-MM-DD
  slot: z.string().min(1, "Select a time slot"),
});

export const paymentSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("UPI"),
    upiId: z.string().trim().regex(UPI, "Enter a valid UPI ID"),
  }),
  z.object({
    method: z.literal("BANK"),
    bankName: z.string().trim().min(2, "Enter bank name").max(80),
    accountHolderName: z.string().trim().min(2, "Enter account holder name").max(80),
    bankAccountNumber: z.string().trim().regex(/^\d{9,18}$/, "Enter a valid account number"),
    ifscCode: z.string().trim().toUpperCase().regex(IFSC, "Enter a valid IFSC code"),
  }),
  z.object({ method: z.literal("CASH") }),
]);

export function parseOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new GraphQLError(result.error.issues[0]?.message ?? "Invalid input", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return result.data;
}