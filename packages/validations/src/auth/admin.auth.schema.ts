import * as z from "zod";

const deviceInfoSchema = z
  .object({
    deviceId: z.string().optional(),
    deviceInfo: z.string().optional(),
    ipAddress: z.string().optional(),
  })
  .optional();

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(25, "Password must be 8 characters"),
  deviceInfo: deviceInfoSchema,
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
