-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "blockNumber" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "transactionHash" TEXT NOT NULL DEFAULT '0';
