/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auction_tokenId_key" ON "Auction"("tokenId");
