/*
  Warnings:

  - You are about to alter the column `amount` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "amount" SET DATA TYPE BIGINT;
