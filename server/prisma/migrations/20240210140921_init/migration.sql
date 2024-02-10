-- CreateTable
CREATE TABLE "LastCheckedBlock" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "blockNumber" INTEGER NOT NULL,

    CONSTRAINT "LastCheckedBlock_pkey" PRIMARY KEY ("id")
);
