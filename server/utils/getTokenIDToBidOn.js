const { getAuctionContract } = require("../getContract");

async function getTokenIDToBidOn() {
    try {
        const auctionContract = await getAuctionContract();
        const auctionData = await auctionContract.auctionData();

        const startTime = auctionData.startTime;
        const endTime = auctionData.endTime;
        const currentTime = Date.now();

        console.log(startTime, endTime, currentTime);

        if (startTime === 0) {
            // Auction hasn't started yet
            return 1;
        }

        const currentTokenId = auctionData.girlfrenId;
        // const maxSupply = await nftContract.MAX_SUPPLY();
        const maxSupply = BigInt(1000);

        // Check if the current token ID has reached or exceeded max supply
        if (currentTokenId >= maxSupply) {
            // Reached max supply; no more auctions can be created
            return -1;
        } else if (currentTime > endTime) {
            // Current time is past the auction end time, and not reached max supply
            // Normally, we'd advance to the next token ID, but let's also check totalSupply
            if (currentTokenId < maxSupply) {
                // There's still room for more tokens to be minted/auctioned
                return currentTokenId + BigInt(1);
            }
        } else {
            // Auction is in progress
            return currentTokenId;
        }
    } catch (error) {
        console.error(error);
        return "Error retrieving token ID to bid on.";
    }
}