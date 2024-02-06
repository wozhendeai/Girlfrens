/*
  Warnings:

  - Added the required column `extended` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "extended" BOOLEAN NOT NULL;
