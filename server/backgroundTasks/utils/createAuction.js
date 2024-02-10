const prisma = require('../../prismaClient');
const ethers = require('ethers');

/**
 * 
 * @param {bn} girlfrenId Token ID for NFT being auctioned 
 * @param {bn} startTime Unix timestamp of end time of auction
 * @param {bn} endTime Unix timestamp for end time of auction
 */
async function createOrUpdateAuction(girlfrenId, startTime, endTime) {
    girlfrenId = girlfrenId.toString(); // Assuming girlfrenId is a BigNumber and needs to be a string
    // Convert startTime and endTime from BigInt to Date
    startTime = new Date(Number(startTime) * 1000); // Convert seconds to milliseconds
    endTime = new Date(Number(endTime) * 1000); // Convert seconds to milliseconds

    try {
        const auction = await prisma.auction.findUnique({
            where: { tokenId: girlfrenId },
        });

        if (auction) {
            const placeholderDate = new Date(0);
            if (auction.startTime.getTime() === placeholderDate.getTime() && auction.endTime.getTime() === placeholderDate.getTime()) {
                const updatedAuction = await prisma.auction.update({
                    where: { tokenId: girlfrenId },
                    data: { startTime, endTime },
                });
                console.log("Auction updated in the database:", updatedAuction);
            } else {
                console.log("Auction already exists with valid times, no update needed.");
            }
        } else {
            const newAuction = await prisma.auction.create({
                data: {
                    tokenId: girlfrenId,
                    startTime,
                    endTime,
                },
            });
            console.log("Auction stored in the database:", newAuction);
        }
    } catch (error) {
        console.error("Error storing auction:", error);
    }
}

// TODO: Comments
async function createAuction(girlfrenId, startTime, endTime) {
    // Assuming the parameters are already converted to the correct types in createOrUpdateAuction
    try {
        const auction = await prisma.auction.create({
            data: {
                tokenId: girlfrenId.toString(), // Ensure tokenId is a string
                startTime,
                endTime,
            },
        });
        return auction;
    } catch (error) {
        console.error('Error creating auction:', error);
    }
}

module.exports = { createAuction, createOrUpdateAuction };