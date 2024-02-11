const getAuctionData = require("./getAuctionData");

async function getTokenIDToBidOn() {
    const createResponse = (tokenId, inProgress) => ({
        "tokenId": tokenId,
        "inProgress": inProgress
    });

    try {
        const auctionData = await getAuctionData();

        // Get current time
        const currentTime = Date.now();

        // Extract necessary data from auctionData
        const { startTime, endTime, girlfrenId } = auctionData;
        const currentTokenId = Number(girlfrenId);

        // TODO: maxSupply = getNFTContract().maxSupply();
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
        throw new Error("Error retrieving token ID to bid on.");
    }
}

module.exports = getTokenIDToBidOn;