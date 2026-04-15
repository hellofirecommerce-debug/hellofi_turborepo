/*
  Warnings:

  - You are about to drop the column `pinCode` on the `users` table. All the data in the column will be lost.
  - Added the required column `sessionTokenExpires` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "sessionTokenExpires" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "pinCode",
ADD COLUMN     "pincode" TEXT NOT NULL;
