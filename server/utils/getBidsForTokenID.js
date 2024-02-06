const prisma = require("../prismaClient");

async function getBidsForTokenID(tokenId) {
    try {
        const bids = await prisma.bid.findMany({
            where: {
                auction: {
                    tokenId: parseInt(tokenId),
                },
            },
            include: {
                auction: true, // Include related auction data
            },
        });
        return bids;
    } catch (error) {
        console.error(error);
        return "Error retrieving bids";
    }
}

module.exports = getBidsForTokenID;