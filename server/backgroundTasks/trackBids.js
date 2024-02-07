const { getAuctionContract } = require("../getContract");
const createBid = require('./utils/createBid');
const createAuction = require('./utils/createAuction');

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

    // Listener for AuctionCreated events
    auctionContract.on('AuctionCreated', async (girlfrenId, startTime, endTime) => {
        try {
            // Create auction
            await createAuction(girlfrenId, startTime, endTime);
        } catch (error) {
            // TODO: Better errors
            console.error(error);
        }
    });
}

module.exports = setupEventListeners;