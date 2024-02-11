const prisma = require('../../prismaClient');
const ethers = require('ethers');
const { createOrUpdateAuction } = require('./createOrUpdateAuction');
const getAuctionData = require('../../utils/getAuctionData');

/**
 * 
 * @param {bigint} amount Bid value in WEI
 * @param {string} bidder Address of biddder
 * @param {bigint} girlfrenId NFT ID being bid on
 * @param {boolean} extended Whether bid caused auction to be extended or not
 */
async function createBid(amount, bidder, girlfrenId, extended) {
    // Convert types
    amount = amount.toString();
    girlfrenId = BigInt(girlfrenId).toString();

    try {
        let auction;

        // First, check if the Auction record exists
        auction = await prisma.auction.findUnique({
            where: { tokenId: girlfrenId },
        });

        // No auction record exists or extended
        if (!auction || extended) {
            // If no auction record exists, we'll get auction data from the contract and update DB
            // If bid caused auction to be extended, update end date
            const auctionData = await getAuctionData();

            auction = await createOrUpdateAuction(
                girlfrenId.toString(),
                new Date(auctionData.startTime).toISOString(),
                new Date(auctionData.endTime).toISOString()
            );
        }

        // Now we've ensured Auction exists, proceed to store the bid
        await prisma.bid.create({
            data: {
                amount: amount,
                bidder: bidder,
                extended: extended,
                auctionId: auction.id, // Token ID = Auction ID
            },
        });
    } catch (error) {
        console.error("Error storing bid:", error);
    }
}

module.exports = createBid;