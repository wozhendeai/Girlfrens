const { getAuctionContract } = require("../getContract");
const createBid = require('./utils/createBid');

async function setupEventListeners() {
    const auctionContract = await getAuctionContract();

    auctionContract.on('AuctionBid', async (girlfrenId, bidder, amount, extended) => {
        try {
            // Create bid
            await createBid(girlfrenId, bidder, amount, extended);
        } catch (error) {
            // TODO: Better errors
            console.error(error);
        }
    });
}

module.exports = setupEventListeners;
