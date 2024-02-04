const prisma = require('../prismaClient');
const ethers = require('ethers');

async function createBid(amount, bidder, girlfrenId, extended) {
    try {
        // Convert the BigNumber values to a string or number as needed
        const bidAmount = ethers.formatEther(amount);
  
        // Store the bid in the database
        const bid = await prisma.bid.create({
          data: {
            amount: parseFloat(bidAmount),
            bidder: bidder,
            extended: extended,
            auction: {
              connect: {
                tokenId: parseInt(girlfrenId.toString()),
              },
            },
          },
        });
        console.log("Bid stored in the database:", bid);
      } catch (error) {
        console.error("Error storing bid:", error);
      }
}

module.exports = createBid;