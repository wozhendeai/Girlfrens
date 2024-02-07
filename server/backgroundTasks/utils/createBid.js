const prisma = require('../../prismaClient');
const ethers = require('ethers');
const { createAuction } = require('./createAuction');

async function createBid(amount, bidder, girlfrenId, extended) {
    try {
        // First, check if the Auction record exists
        let auction = await prisma.auction.findUnique({
            where: { tokenId: parseInt(girlfrenId.toString()) },
        });

        // No auction record exists
        if (!auction) {
            // If no auction record exists, we'll create placeholder values
            // We'll account for this when searching for new bids
            const placeholderDate = new Date(0);
            auction = await createAuction(parseInt(girlfrenId.toString()), placeholderDate, placeholderDate)
        }

        // If the Auction exists, proceed to store the bid
        const bid = await prisma.bid.create({
            data: {
                amount: amount.toString(),
                bidder: bidder,
                extended: extended,
                auctionId: auction.id, // Use the found auction's ID for the relation
            },
        });
        console.log("Bid stored in the database:", bid);
    } catch (error) {
        console.error("Error storing bid:", error);
    }
}

module.exports = createBid;