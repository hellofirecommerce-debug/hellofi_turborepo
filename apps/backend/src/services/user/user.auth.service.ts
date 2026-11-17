import prisma from "@repo/db";
import { Response, Request } from "express";
import { UserType } from "../../types";
import { handleServiceError, throwAuthError } from "../../lib/utils/error";
import TokenService from "../auth/common/token.service";
import CookieService from "../auth/common/cookie.service";
import OTPService from "../auth/common/otp.service";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";

import {
  checkUserStatusSchema,
  sendOTPSchema,
  resendOTPSchema,
  verifyOTPSchema,
  userRegistrationSchema,
  CheckUserStatusInput,
  VerifyOTPInput,
} from "@repo/validations";

// ── Constants ──
const isStaging = process.env.NODE_ENV === "staging";
const isDevelopment = process.env.NODE_ENV === "development";
const STAGING_BYPASS_OTP = "4711";

// Generic on purpose: don't reveal that the number belongs to an admin
const NOT_ALLOWED_MESSAGE =
  "This mobile number cannot be used to log in here. Please use a different number.";

class UserAuthService {
  // Only customer accounts may use the customer OTP flow
  // (blocks SUPERADMIN / ADMIN rows that share the same user table)
  private isCustomer(user: { userType: string }) {
    return user.userType === "USER";
  }

  // 1. Check User Status
  async checkUserStatus(contact: string) {
    try {
      const { contact: normalizedContact } =
        validateOrThrow<CheckUserStatusInput>(checkUserStatusSchema, {
          contact,
        });

      const user = await prisma.user.findUnique({
        where: { contact: normalizedContact, userType: UserType.USER },
      });

      if (!user) {
        return {
          exists: false,
          needsRegistration: true,
          message: "User not found. Registration required.",
        };
      }

      if (!this.isCustomer(user)) {
        return {
          exists: false,
          needsRegistration: false,
          message: NOT_ALLOWED_MESSAGE,
        };
      }

      const hasCompleteProfile = user.fName && user.lName && user.pincode;

      if (!hasCompleteProfile) {
        return {
          exists: true,
          needsRegistration: true,
          incompleteProfile: true,
          message: "Profile incomplete. Please complete registration.",
          user: {
            fName: user.fName || "",
            lName: user.lName || "",
            contact: user.contact,
            pinCode: user.pincode || "",
          },
        };
      }

      return {
        exists: true,
        needsRegistration: false,
        message: "User found. Ready for OTP verification.",
        user: {
          fName: user.fName,
          lName: user.lName,
          contact: user.contact,
          pinCode: user.pincode,
        },
      };
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // ── Shared: actually dispatch the OTP (MSG91 in prod, bypass in staging/dev)
  private async dispatchOTP(normalizedContact: string) {
    if (isStaging || isDevelopment) {
      console.log(`💡 [BYPASS] Use OTP: ${STAGING_BYPASS_OTP}`);
      return {
        success: true,
        needsRegistration: false,
        message: "OTP sent successfully",
        attemptsRemaining: 5,
      };
    }

    const otpResult = await OTPService.createOTP(normalizedContact, "login");
    if (!otpResult.success) throw new Error(otpResult.message);

    return {
      success: true,
      needsRegistration: false,
      message: "OTP sent successfully to your mobile number",
      attemptsRemaining: otpResult.attemptsRemaining,
    };
  }

  // 2. Send OTP — REGISTERED CUSTOMERS ONLY
  async sendOTP(contact: string) {
    try {
      const { contact: normalizedContact } = validateOrThrow(sendOTPSchema, {
        contact,
      });

      const user = await prisma.user.findUnique({
        where: { contact: normalizedContact, userType: UserType.USER },
      });

      // Not registered → don't send anything, tell the frontend to ask for details
      if (!user) {
        return {
          success: false,
          needsRegistration: true,
          message:
            "You are not registered. Please enter your first name, last name and pincode.",
        };
      }

      // Admin / superadmin number → never send an OTP
      if (!this.isCustomer(user)) {
        return {
          success: false,
          needsRegistration: false,
          message: NOT_ALLOWED_MESSAGE,
        };
      }

      return await this.dispatchOTP(normalizedContact);
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // 3. Register + Send OTP — NEW CUSTOMERS
  async registerAndSendOTP(
    firstName: string,
    lastName: string,
    contact: string,
    pinCode: string,
  ) {
    try {
      const {
        firstName: validFirstName,
        lastName: validLastName,
        contact: validContact,
        pinCode: validPinCode,
      } = validateOrThrow(userRegistrationSchema, {
        firstName,
        lastName,
        contact,
        pinCode,
      });

      const existing = await prisma.user.findUnique({
        where: { contact: validContact, userType: UserType.USER },
      });

      if (existing) {
        // Admin / superadmin number → never touch it, never send an OTP
        if (!this.isCustomer(existing)) {
          return {
            success: false,
            needsRegistration: false,
            message: NOT_ALLOWED_MESSAGE,
          };
        }
        // Already a customer → don't overwrite details, just send the OTP
        return await this.dispatchOTP(validContact);
      }

      // Brand-new number → create customer. upsert with empty `update` keeps it
      // safe against a double-submit race (never overwrites an existing row).
      await prisma.user.upsert({
        where: { contact: validContact },
        update: {},
        create: {
          fName: validFirstName,
          lName: validLastName,
          contact: validContact,
          pincode: validPinCode,
          status: "ACTIVE",
          userType: "USER",
          contactVerified: false,
        },
      });

      return await this.dispatchOTP(validContact);
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // 4. Complete Registration (kept as-is for any existing callers)
  async completeUserRegistration(
    firstName: string,
    lastName: string,
    contact: string,
    pinCode: string,
  ) {
    try {
      const {
        firstName: validFirstName,
        lastName: validLastName,
        contact: validContact,
        pinCode: validPinCode,
      } = validateOrThrow(userRegistrationSchema, {
        firstName,
        lastName,
        contact,
        pinCode,
      });

      const existing = await prisma.user.findUnique({
        where: { contact: validContact, userType: UserType.USER },
      });
      if (existing && !this.isCustomer(existing)) {
        throw new Error(NOT_ALLOWED_MESSAGE);
      }

      const user = await prisma.user.upsert({
        where: { contact: validContact },
        update: {
          fName: validFirstName,
          lName: validLastName,
          pincode: validPinCode,
          status: "ACTIVE",
        },
        create: {
          fName: validFirstName,
          lName: validLastName,
          contact: validContact,
          pincode: validPinCode,
          status: "ACTIVE",
          userType: "USER",
        },
      });

      return {
        success: true,
        message: "Registration completed successfully",
        user: {
          id: user.id,
          fName: user.fName,
          lName: user.lName,
          pinCode: user.pincode,
          contact: user.contact,
          userType: user.userType,
          status: user.status,
        },
      };
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // 5. Resend OTP
  async resendOTP(contact: string) {
    try {
      const { contact: normalizedContact } = validateOrThrow(resendOTPSchema, {
        contact,
      });

      const user = await prisma.user.findUnique({
        where: { contact: normalizedContact, userType: UserType.USER },
      });
      if (!user) throw new Error("User not found");

      // Admin / superadmin number → never resend an OTP
      if (!this.isCustomer(user)) {
        return {
          success: false,
          message: NOT_ALLOWED_MESSAGE,
        };
      }

      if (isStaging || isDevelopment) {
        console.log(`💡 [BYPASS] Use OTP: ${STAGING_BYPASS_OTP}`);
        return {
          success: true,
          message: "OTP resent successfully",
          resendAttemptsRemaining: 3,
        };
      }

      const otpResult = await OTPService.resendOTP(normalizedContact, "login");
      if (!otpResult.success) throw new Error(otpResult.message);

      return {
        success: true,
        message: "OTP resent successfully",
        resendAttemptsRemaining: otpResult.resendAttemptsRemaining,
      };
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // 6. Verify OTP and Login (never registers; customers only)
  async verifyOtp(contact: string, otp: string, req: Request, res: Response) {
    try {
      const { contact: normalizedContact, otp: validOtp } =
        validateOrThrow<VerifyOTPInput>(verifyOTPSchema, { contact, otp });

      // Check the account BEFORE verifying the OTP, so an admin/superadmin
      // number can never get a customer session (even with the staging bypass)
      const existingUser = await prisma.user.findUnique({
        where: { contact: normalizedContact, userType: UserType.USER },
      });
      if (!existingUser) {
        throw new Error("User not registered. Please register first.");
      }
      if (!this.isCustomer(existingUser)) {
        throw new Error(NOT_ALLOWED_MESSAGE);
      }

      // BYPASS CHECK
      if ((isStaging || isDevelopment) && validOtp === STAGING_BYPASS_OTP) {
        console.log(`✅ [BYPASS] OTP verification successful`);
      } else {
        // PRODUCTION VERIFICATION (MSG91)
        const verificationResult = await OTPService.verifyOTP(
          normalizedContact,
          validOtp,
          "login",
        );
        if (!verificationResult.success)
          throw new Error(verificationResult.message);
      }

      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { contactVerified: true },
      });

      // Generate Tokens
      const { accessToken, refreshToken } = TokenService.generateTokens(
        user.id,
        UserType.USER,
      );

      // Create Session in DB
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: accessToken,
          refreshToken: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          sessionTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
          deviceInfo: req.headers["user-agent"] || "unknown",
          ipAddress: req.ip || req.connection.remoteAddress,
        },
      });

      // Set Cookies
      CookieService.setAccessTokenCookie(res, accessToken, UserType.USER);
      CookieService.setRefreshTokenCookie(res, refreshToken, UserType.USER);

      return {
        success: true,
        message: "User login successful",
        sessionId: session.id,
        accessToken,
        user: {
          id: user.id,
          fName: user.fName,
          lName: user.lName,
          contact: user.contact,
          userType: user.userType,
        },
      };
    } catch (error: any) {
      handleServiceError(error);
    }
  }

  // 7. Require User Auth
  requireUser(req: Request) {
    if (!req.user) return throwAuthError("Unauthorized. Users only.");
    return req.user;
  }

  // 8. Logout
  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization || "";
      const parts = authHeader.split(" ");
      const token =
        parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;

      if (token) {
        await prisma.session.deleteMany({ where: { sessionToken: token } });
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // 9. Get current user
  async getMe(req: Request) {
    try {
      const userId = req.user?.userId;
      if (!userId) return null;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fName: true,
          lName: true,
          contact: true,
          pincode: true,
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        fName: user.fName,
        lName: user.lName,
        contact: user.contact,
        pinCode: user.pincode ?? "", // GraphQL field is pinCode, Prisma column is pincode
      };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new UserAuthService();
