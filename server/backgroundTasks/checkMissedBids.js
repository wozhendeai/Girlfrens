const { ethers } = require('ethers');
const prisma = require('../prismaClient');
const { getAuctionContract } = require('../getContract.js');
const createBid = require('./utils/createBid');

// Function to check for missed bids
async function checkMissedBids() {
  const auctionContract = await getAuctionContract();
  const filter = auctionContract.filters.AuctionBid();

  // TODO: Track from blocks ago
  const fromBlock = -9990;

  let missedBids = 0;
  try {
    const events = await auctionContract.queryFilter(filter, fromBlock, "latest");

    for (const event of events) {
      const { girlfrenId, bidder, amount, extended } = event.args;
      
      // Before creating the bid, check if it already exists to avoid duplicates
      const existingBid = await prisma.bid.findFirst({
        where: {
          auction: {
            tokenId: Number(girlfrenId),
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
  } catch (error) {
    console.error('Error checking for missed bids:', error);
  }
  console.log(`Stored ${missedBids} missed bids`)
}

module.exports = checkMissedBids;
