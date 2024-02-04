/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ContractAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContractAddress_name_key" ON "ContractAddress"("name");
