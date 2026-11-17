import prisma from "@repo/db";
import axios from "axios";

const OTPService = {
  // Get today's date as string (YYYY-MM-DD)
  getTodayDate: () => {
    return new Date().toISOString().split("T")[0];
  },

  // Check daily limits for user by contact
  checkDailyLimits: async (contact: string) => {
    const normalizedContact = contact.toString().replace(/\D/g, "");

    const user = await prisma.user.findUnique({
      where: { contact: normalizedContact },
    });

    if (!user || user.userType !== "USER") {
      throw new Error("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if it's a new day to reset attempts
    const isNewDay = !user.lastOtpDate || user.lastOtpDate < today;

    let updatedUser = user;
    if (isNewDay) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          dailyOtpAttempts: 0,
          dailyResendOtpAttempts: 0,
          dailyVerificationOtpAttempts: 0,
          lastOtpDate: new Date(),
          lastResendDate: new Date(),
          lastVerificationDate: new Date(),
          isOtpBlocked: false,
          isResendBlocked: false,
          isVerificationBlocked: false,
        },
      });
    }

    return {
      canRequestOtp:
        !updatedUser.isOtpBlocked && updatedUser.dailyOtpAttempts < 3,
      canResendOtp:
        !updatedUser.isResendBlocked && updatedUser.dailyResendOtpAttempts < 5,
      canVerifyOtp:
        !updatedUser.isVerificationBlocked &&
        updatedUser.dailyVerificationOtpAttempts < 15,

      otpAttemptsUsed: updatedUser.dailyOtpAttempts,
      verificationAttemptsUsed: updatedUser.dailyVerificationOtpAttempts,
      resendAttemptsUsed: updatedUser.dailyResendOtpAttempts,

      isBlocked:
        updatedUser.isOtpBlocked ||
        updatedUser.isResendBlocked ||
        updatedUser.isVerificationBlocked,
      user: updatedUser,
    };
  },

  // Check rate limiting for resends (minimum 30 seconds between resends)
  checkResendRateLimit: (user: any) => {
    if (!user.lastResendDate) {
      return { canResend: true, waitTime: 0 };
    }

    const timeSinceLastResend =
      Date.now() - new Date(user.lastResendDate).getTime();
    const minInterval = 30 * 1000; // 30 seconds

    if (timeSinceLastResend < minInterval) {
      const waitTime = Math.ceil((minInterval - timeSinceLastResend) / 1000);
      return { canResend: false, waitTime };
    }

    return { canResend: true, waitTime: 0 };
  },

  // Send OTP using MSG91
  sendOTPViaMSG91: async (contact: string, templateParams: any = {}) => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");

      const options = {
        method: "POST",
        url: "https://control.msg91.com/api/v5/otp",
        params: {
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: `91${normalizedContact}`,
          authkey: process.env.MSG91_AUTH_KEY,
          otp_expiry: "2",
          realTimeResponse: "1",
        },
        headers: { "content-type": "application/json" },
        data: JSON.stringify(templateParams),
      };

      const response = await axios.request(options);
      return {
        success: response.data.type === "success",
        message: response.data.message || "OTP sent successfully",
        requestId: response.data.request_id,
        error: response.data.type === "error" ? response.data.message : null,
      };
    } catch (error: any) {
      console.error(
        "MSG91 Send OTP Error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to send OTP via SMS");
    }
  },

  // Verify OTP using MSG91
  verifyOTPViaMSG91: async (contact: string, otp: string) => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");

      const options = {
        method: "GET",
        url: "https://control.msg91.com/api/v5/otp/verify",
        params: {
          otp: otp,
          mobile: `91${normalizedContact}`,
        },
        headers: { authkey: process.env.MSG91_AUTH_KEY },
      };

      const response = await axios.request(options);
      return {
        success: response.data.type === "success",
        message: response.data.message || "OTP verification failed",
        error: response.data.type === "error" ? response.data.message : null,
      };
    } catch (error: any) {
      console.error(
        "MSG91 Verify OTP Error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to verify OTP");
    }
  },

  // Resend OTP using MSG91
  resendOTPViaMSG91: async (contact: string) => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");

      const options = {
        method: "GET",
        url: "https://control.msg91.com/api/v5/otp/retry",
        params: {
          authkey: process.env.MSG91_AUTH_KEY,
          retrytype: "text",
          mobile: `91${normalizedContact}`,
        },
      };

      const response = await axios.request(options);
      return {
        success: response.data.type === "success",
        message: response.data.message || "OTP resent successfully",
        error: response.data.type === "error" ? response.data.message : null,
      };
    } catch (error: any) {
      console.error(
        "MSG91 Resend OTP Error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to resend OTP");
    }
  },

  // Create OTP with daily limit check and MSG91 integration
  createOTP: async (contact: string, purpose = "login") => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");
      const limits = await OTPService.checkDailyLimits(normalizedContact);

      if (limits.isBlocked) {
        return {
          success: false,
          message: "Account temporarily blocked. Try again tomorrow.",
          code: "USER_BLOCKED",
        };
      }

      if (!limits.canRequestOtp) {
        return {
          success: false,
          message: `Daily OTP limit reached (${limits.otpAttemptsUsed}/3).`,
          code: "DAILY_LIMIT_EXCEEDED",
        };
      }

      const templateParams = { name: limits.user.fName || "User" };
      const msg91Response = await OTPService.sendOTPViaMSG91(
        normalizedContact,
        templateParams,
      );

      if (!msg91Response.success) {
        return {
          success: false,
          message: msg91Response.error || "Failed to send OTP",
          code: "SMS_SEND_FAILED",
        };
      }

      // Update DB
      const newAttempts = limits.user.dailyOtpAttempts + 1;
      await prisma.user.update({
        where: { id: limits.user.id },
        data: {
          dailyOtpAttempts: newAttempts,
          isOtpBlocked: newAttempts >= 3,
          lastOtpDate: new Date(),
        },
      });

      return {
        success: true,
        message: "OTP sent successfully",
        attemptsRemaining: 3 - newAttempts,
        requestId: msg91Response.requestId,
      };
    } catch (error) {
      console.error("Error creating OTP:", error);
      throw error;
    }
  },

  // Resend OTP with comprehensive checks
  resendOTP: async (contact: string, purpose = "login") => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");
      const limits = await OTPService.checkDailyLimits(normalizedContact);

      if (limits.isBlocked) {
        return {
          success: false,
          message: "Account temporarily blocked. Try again tomorrow.",
          code: "USER_BLOCKED",
        };
      }

      if (!limits.canResendOtp) {
        return {
          success: false,
          message: `Daily resend limit reached (${limits.resendAttemptsUsed}/5).`,
          code: "DAILY_RESEND_LIMIT_EXCEEDED",
        };
      }

      const rateLimit = OTPService.checkResendRateLimit(limits.user);
      if (!rateLimit.canResend) {
        return {
          success: false,
          message: `Please wait ${rateLimit.waitTime} seconds before resending.`,
          code: "RATE_LIMIT_EXCEEDED",
          waitTime: rateLimit.waitTime,
        };
      }

      const msg91Response =
        await OTPService.resendOTPViaMSG91(normalizedContact);

      if (!msg91Response.success) {
        if (msg91Response.error === "No OTP request found to retryotp") {
          return {
            success: false,
            message: "No active OTP session found.",
            code: "NO_ACTIVE_SESSION",
          };
        }
        if (msg91Response.error === "OTP retry count maxed out") {
          return {
            success: false,
            message: "Max retry attempts reached.",
            code: "MAX_RETRY_EXCEEDED",
          };
        }
        return {
          success: false,
          message: msg91Response.error || "Failed to resend OTP",
          code: "SMS_RESEND_FAILED",
        };
      }

      const newResendAttempts = limits.user.dailyResendOtpAttempts + 1;
      await prisma.user.update({
        where: { id: limits.user.id },
        data: {
          dailyResendOtpAttempts: newResendAttempts,
          isResendBlocked: newResendAttempts >= 5,
          lastResendDate: new Date(),
        },
      });

      return {
        success: true,
        message: "OTP resent successfully",
        resendAttemptsRemaining: 5 - newResendAttempts,
      };
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  },

  // Verify OTP with MSG91 and daily limit check
  verifyOTP: async (contact: string, enteredOTP: string, purpose = "login") => {
    try {
      const normalizedContact = contact.toString().replace(/\D/g, "");
      const limits = await OTPService.checkDailyLimits(normalizedContact);

      if (!limits.canVerifyOtp) {
        return {
          success: false,
          message: `Daily verification limit exceeded (${limits.verificationAttemptsUsed}/15).`,
          code: "DAILY_VERIFICATION_LIMIT_EXCEEDED",
        };
      }

      const newVerifyAttempts = limits.user.dailyVerificationOtpAttempts + 1;
      await prisma.user.update({
        where: { id: limits.user.id },
        data: {
          dailyVerificationOtpAttempts: newVerifyAttempts,
          isVerificationBlocked: newVerifyAttempts >= 15,
          lastVerificationDate: new Date(),
        },
      });

      const msg91Response = await OTPService.verifyOTPViaMSG91(
        normalizedContact,
        enteredOTP,
      );

      if (!msg91Response.success) {
        let errorMessage = "OTP verification failed";
        let errorCode = "VERIFICATION_FAILED";

        if (msg91Response.error === "OTP expired") {
          errorMessage = "OTP has expired. Please request a new OTP.";
          errorCode = "OTP_EXPIRED";
        } else if (msg91Response.error === "OTP not match") {
          errorMessage = "Invalid OTP entered. Please try again.";
          errorCode = "INVALID_OTP";
        } else if (msg91Response.error === "Invalid authkey") {
          errorMessage = "System error. Please try again later.";
          errorCode = "SYSTEM_ERROR";
        }

        return {
          success: false,
          message: errorMessage,
          code: errorCode,
          verificationAttemptsRemaining: Math.max(0, 15 - newVerifyAttempts),
          isBlocked: newVerifyAttempts >= 15,
        };
      }

      // Success - Update user status
      const updatedUser = await prisma.user.update({
        where: { id: limits.user.id },
        data: { contactVerified: true }, // Using your schema field
      });

      return {
        success: true,
        message: "OTP verified successfully",
        user: updatedUser,
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },

  // Reset all users' daily attempts (for cron job)
  resetAllDailyAttempts: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await prisma.user.updateMany({
        where: {
          OR: [
            { lastOtpDate: { lt: today } },
            { lastOtpDate: null },
            { lastResendDate: { lt: today } },
            { lastVerificationDate: { lt: today } },
          ],
        },
        data: {
          dailyOtpAttempts: 0,
          isOtpBlocked: false,
          lastOtpDate: today,
          dailyResendOtpAttempts: 0,
          isResendBlocked: false,
          lastResendDate: today,
          dailyVerificationOtpAttempts: 0,
          isVerificationBlocked: false,
          lastVerificationDate: today,
        },
      });

      return {
        success: true,
        usersReset: result.count,
        message: "Daily attempts reset completed",
      };
    } catch (error) {
      console.error("Error resetting daily attempts:", error);
      throw error;
    }
  },
};

export default OTPService;
