/*
  Warnings:

  - You are about to drop the column `lastOtpTime` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastResendTime` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastVerificationTime` on the `users` table. All the data in the column will be lost.
  - The `lastOtpDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lastResendDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lastVerificationDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastOtpTime",
DROP COLUMN "lastResendTime",
DROP COLUMN "lastVerificationTime",
DROP COLUMN "lastOtpDate",
ADD COLUMN     "lastOtpDate" TIMESTAMP(3),
DROP COLUMN "lastResendDate",
ADD COLUMN     "lastResendDate" TIMESTAMP(3),
DROP COLUMN "lastVerificationDate",
ADD COLUMN     "lastVerificationDate" TIMESTAMP(3);
