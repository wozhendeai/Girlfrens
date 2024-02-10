    const prisma = require('../../prismaClient');
    const ethers = require('ethers');
    const { createAuction } = require('./createAuction');

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
            // First, check if the Auction record exists
            let auction = await prisma.auction.findUnique({
                where: { tokenId: girlfrenId },
            });

            // No auction record exists
            if (!auction) {
                // If no auction record exists, we'll create placeholder values
                // We'll account for this when searching for new bids
                const placeholderDate = new Date(0);
                auction = await createAuction(girlfrenId, placeholderDate, placeholderDate)
            }

            // If the Auction exists, proceed to store the bid
            const bid = await prisma.bid.create({
                data: {
                    amount: amount,
                    bidder: bidder,
                    extended: extended,
                    auctionId: auction.id, // Token ID = Auction ID
                },
            });
            // console.log("Bid stored in the database:", bid);
        } catch (error) {
            console.error("Error storing bid:", error);
        }
    }

    module.exports = createBid;