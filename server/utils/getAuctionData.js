const ethers = require('ethers');
const { getAuctionContract } = require('../getContract');

// Function to fetch and return the current auction data from the smart contract
async function getAuctionData() {
    try {
        const auctionContract = await getAuctionContract();
        // Assuming `auctionData` is a callable function in your contract
        const data = await auctionContract.auctionData();

        // Transform the data from the smart contract to a more friendly format
        return {
            bidder: data.bidder,
            amount: ethers.formatEther(data.amount), // Convert Wei to Ether
            withdrawable: ethers.formatEther(data.withdrawable),
            startTime: Number(data.startTime) * 1000, // Convert to milliseconds
            endTime: Number(data.endTime) * 1000,
            girlfrenId: Number(data.girlfrenId),
            settled: data.settled,
            reservePercentage: Number(data.reservePercentage),
            girlfrensNFT: data.girlfrensNFT,
            reservePrice: ethers.formatEther(data.reservePrice),
            bidIncrement: ethers.formatEther(data.bidIncrement),
            duration: Number(data.duration),
            timeBuffer: Number(data.timeBuffer),
            girlfrenBalance: ethers.formatEther(data.girlfrenBalance),
            girlfrensTotalRedeemed: Number(data.girlfrensTotalRedeemed),
        };
    } catch (error) {
        console.error('Error fetching auction data:', error);
        throw new Error('Failed to fetch auction data');
    }
}

module.exports = getAuctionData;
