const crypto = require('crypto');
const ethers = hre.ethers;



const main = async () => {
    const [ deployer ] = await ethers.getSigners();

    // TODO: Get dynamically
    const girlfrenAuctionAddress = "0xD9224Cb60E18287724637DF217CD154ae0C6a95b";
    const girlfrensNFTAddress = "0xf20cdD5A98acD5Ae1f0f771527394C93Dc9187Bf";

    // Get Girlfren Auction contract to interact with and Girlfren Treasury
    const GirlfrenAuction = await ethers.getContractFactory("GirlfrenAuction");
    const girlfrenAuction = await GirlfrenAuction.attach(girlfrenAuctionAddress);

    // Initialize
    const { reservePrice, reservePercentage, bidIncrement, duration, timeBuffer } = getDefaultAuctionData();
    await girlfrenAuction.connect(deployer).initialize(
        girlfrensNFTAddress,
        reservePrice,
        bidIncrement,
        duration,
        timeBuffer,
        reservePercentage
    )
    console.log("Initialized")
}

function getDefaultAuctionData() {
    const reservePrice = BigInt(ethers.parseEther("0.1")); // Minimum bid
    const bidIncrement = BigInt(ethers.parseEther("0.01")); // Minimum bid increment
    const duration = 900; // 1 day in seconds
    const timeBuffer = 300; // 5 minutes in seconds
    const reservePercentage = 70; // (100 - reservePercentage)% will go to devs

    return { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});