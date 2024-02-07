const { getAuctionContract } = require("../getContract");

async function getTokenIDToBidOn() {
    const createResponse = (tokenId, inProgress) => ({
        "tokenId": tokenId,
        "inProgress": inProgress
    });

    try {
        const auctionContract = await getAuctionContract();
        const auctionData = await auctionContract.auctionData();

        const startTime = Number(auctionData.startTime) * 1000;
        const endTime = Number(auctionData.endTime) * 1000;
        const currentTime = Date.now();

        if (startTime === 0) {
            // Auction hasn't started yet
            return createResponse(1, false);
        }

        const currentTokenId = Number(auctionData.girlfrenId);
        // const maxSupply = await nftContract.MAX_SUPPLY();
        const maxSupply = 1000;

        // Check if the current token ID has reached or exceeded max supply
        if (startTime === 0) {
            // Auction hasn't started yet
            return createResponse(1, false);
        } else if (currentTokenId >= maxSupply) {
            // Reached max supply; no more auctions can be created
            return createResponse(-1, false);
        } else if (currentTime > endTime) {
            // Auction ended, and not at max supply; advance to the next token ID
            return createResponse(currentTokenId + 1, false);
        } else {
            // Auction is in progress
            return createResponse(currentTokenId, true);
        }
    } catch (error) {
        console.error(error);
        return "Error retrieving token ID to bid on.";
    }
}

module.exports = getTokenIDToBidOn;