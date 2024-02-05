const { ethers } = require('ethers');
const prisma = require('../prismaClient');
const getAuctionContract = require('../utils/getContract');
const createBid = require('./utils/createBid');

// Function to check for missed bids
async function checkMissedBids() {
  const auctionContract = await getAuctionContract();
  const filter = auctionContract.filters.AuctionBid();

  // TODO: Receive from contract
  const fromBlock = 0;
  const toBlock = 'latest';

  let missedBids = 0;
  try {
    const events = await auctionContract.queryFilter(filter, fromBlock, toBlock);

    for (const event of events) {
      const { girlfrenId, bidder, amount, extended } = event.args;
      
      // Before creating the bid, check if it already exists to avoid duplicates
      const existingBid = await prisma.bid.findFirst({
        where: {
          auction: {
            tokenId: girlfrenId.toNumber(),
          },
          bidder: bidder,
          amount: parseFloat(ethers.formatEther(amount)),
        },
      });

      // If the bid does not exist, create it
      if (!existingBid) {
        await createBid(girlfrenId, bidder, amount, extended);
        missedBids++;
      }
    }
  } catch (error) {
    console.error('Error checking for missed bids:', error);
  }
  console.log(`Stored ${missedBids} missed bids`)
}

module.exports = checkMissedBids;
