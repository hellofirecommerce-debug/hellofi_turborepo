-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "contactVerified" BOOLEAN NOT NULL DEFAULT false,
    "dailyOtpAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastOtpDate" TEXT,
    "lastOtpTime" TIMESTAMP(3),
    "isOtpBlocked" BOOLEAN NOT NULL DEFAULT false,
    "pinCode" TEXT NOT NULL,
    "dailyResendOtpAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastResendDate" TEXT,
    "lastResendTime" TIMESTAMP(3),
    "isResendBlocked" BOOLEAN NOT NULL DEFAULT false,
    "dailyVerificationOtpAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastVerificationDate" TEXT,
    "lastVerificationTime" TIMESTAMP(3),
    "isVerificationBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_contact_key" ON "users"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_contact_idx" ON "users"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "sessions"("refreshToken");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
