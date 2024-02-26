const prisma = require('../../prismaClient');
const ethers = require('ethers');

/**
 * 
 * @param {bn} girlfrenId Token ID for NFT being auctioned 
 * @param {bn} startTime Unix timestamp of end time of auction
 * @param {bn} endTime Unix timestamp for end time of auction
 */
async function createOrUpdateAuction(girlfrenId, startTime, endTime) {
    let auction;

    try {
        auction = await prisma.auction.findUnique({
            where: { tokenId: girlfrenId },
        });

        if (auction) {
            // Auction exists, update it
            auction = await updateAuction(girlfrenId, startTime, endTime)
        } else {
            // Create new auction
            auction = await createAuction(girlfrenId, startTime, endTime);
        }

    } catch (error) {
        console.error("Error storing auction:", error);
    }

    return auction;
}

/**
 * 
 * @param {String} girlfrenId token id of nft being auctioned 
 * @param {String} startTime timestamp of start date of auction 
 * @param {String} endTime timestamp of end date of auction
 * @returns 
 */
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

/**
 * 
 * @param {String} girlfrenId token id of nft being auctioned 
 * @param {String} startTime timestamp of start date of auction 
 * @param {String} endTime timestamp of end date of auction
 * @returns 
 */
async function updateAuction(girlfrenId, startTime, endTime) {
    // Assuming the parameters are already converted to the correct types in createOrUpdateAuction
    try {
        const auction = await prisma.auction.update({
            where: { tokenId: girlfrenId },
            data: { startTime: startTime, endTime: endTime },
        });

        return auction;
    } catch (error) {
        console.error('Error creating auction:', error);
    }
}

module.exports = { createOrUpdateAuction };