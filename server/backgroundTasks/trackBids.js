const { getAuctionContract } = require("../getContract");
const createBid = require('./utils/createBid');

async function setupEventListeners() {
    const auctionContract = await getAuctionContract();

    auctionContract.on('AuctionBid', async (girlfrenId, bidder, amount, extended, event) => {
        try {
            // Create bid
            await createBid(amount, bidder, girlfrenId, extended, event.log.transactionHash);
        } catch (error) {
            // TODO: Better errors
            console.error(error);
        }
    });
}

module.exports = setupEventListeners;
