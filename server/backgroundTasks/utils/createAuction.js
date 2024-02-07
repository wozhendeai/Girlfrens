const prisma = require('../../prismaClient');
const ethers = require('ethers');

/**
 * 
 * @param {bn} girlfrenId Token ID for NFT being auctioned 
 * @param {bn} startTime Unix timestamp of end time of auction
 * @param {bn} endTime Unix timestamp for end time of auction
 */
async function createOrUpdateAuction(girlfrenId, startTime, endTime) {
    // Convert types

    try {
        // First, check if the Auction record already exists
        const auction = await prisma.auction.findUnique({
            where: { tokenId: girlfrenId.toString() },
        });

        if (auction) {
            // If auction record exists and has placeholder values, update it
            const placeholderDate = new Date(0);
            if (
                auction.startTime.getTime() === placeholderDate.getTime()
                && auction.endTime.getTime() === placeholderDate.getTime()
            ) {
                const updatedAuction = await prisma.auction.update({
                    where: { tokenId },
                    data: {
                        startTime: new Date(startTime),
                        endTime: new Date(endTime),
                    },
                });
                console.log("Auction updated in the database:", updatedAuction);
            } else {
                console.log("Auction already exists with valid times, no update needed.");
            }
        } else {
            // If the Auction doesn't exist, create it
            const newAuction = await createAuction(girlfrenId, new Date(startTime), new Date(endTime));
            console.log("Auction stored in the database:", newAuction);
        }
    } catch (error) {
        console.error("Error storing auction:", error);
    }
}

// TODO: Comments
async function createAuction(girlfrenId, startTime, endTime) {
    try {
        const auction = await prisma.auction.create({
            data: {
                tokenId: girlfrenId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });
        return auction;
    } catch (error) {
        console.error('Error creating auction:', error);
    }

}

module.exports = { createAuction, createOrUpdateAuction };