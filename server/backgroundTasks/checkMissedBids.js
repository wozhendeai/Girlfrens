const { ethers } = require('ethers');
const prisma = require('../prismaClient');
const { getAuctionContract } = require('../getContract.js');
const createBid = require('./utils/createBid');

// Function to check for missed bids in chunks
async function checkMissedBids() {
  const auctionContract = await getAuctionContract();
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const filter = auctionContract.filters.AuctionBid();


  const lastCheckedBlock = await getLastCheckedBlock();
  const latestBlock = await provider.getBlockNumber();

  const blockSize = 1000; // Define the size of each block range you want to check
  let currentBlock = lastCheckedBlock;
  let missedBids = 0;

  while (currentBlock < latestBlock) {
    let toBlock = currentBlock + blockSize;
    if (toBlock > latestBlock) {
      toBlock = latestBlock;
    }

    try {
      const events = await auctionContract.queryFilter(filter, currentBlock + 1, toBlock);

      for (const event of events) {
        const { girlfrenId, bidder, amount, extended } = event.args;

        // Check if the bid already exists to avoid duplicates
        const existingBid = await prisma.bid.findFirst({
          where: {
            auction: {
              tokenId: String(girlfrenId),
            },
            bidder: bidder,
            amount: amount.toString(),
          },
        });

        // If the bid does not exist, create it
        if (!existingBid) {
          await createBid(amount, bidder, girlfrenId, extended);
          missedBids++;
        }
      }

      // Update the last checked block in the database
      await updateLastCheckedBlock(toBlock);
      currentBlock = toBlock;

    } catch (error) {
      console.error('Error checking for missed bids:', error);
    }
  }

  console.log(`Checked from block ${lastCheckedBlock} to ${latestBlock}, stored ${missedBids} missed bids`);
}

const getLastCheckedBlock = async () => {
  // Fetch the last checked block from the database
  const lastCheckedBlock = await prisma.lastCheckedBlock.findUnique({
    where: { id: 1 }, // Assuming you have a single record for this
  });

  // Return the block number
  // If no value is returned, then we use the deployed block from enviromental settings
  return lastCheckedBlock?.blockNumber || parseInt(process.env.DEPLOYED_BLOCK);
};

const updateLastCheckedBlock = async (blockNumber) => {
  // Update the last checked block in the database
  await prisma.lastCheckedBlock.upsert({
    where: { id: 1 },
    update: { blockNumber },
    create: { blockNumber },
  });
};

module.exports = checkMissedBids;
