/*
  Warnings:

  - Added the required column `value` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "description" TEXT,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
