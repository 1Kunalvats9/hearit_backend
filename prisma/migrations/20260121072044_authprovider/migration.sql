/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `AuthProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuthProvider" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT;
