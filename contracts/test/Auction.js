const hre = require("hardhat");
const { parseEther, getSigners, getContractFactory, getContractAt } = require("hardhat").ethers;
const { loadFixture, time, setBalance } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const ethers = hre.ethers;

const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";

async function deployFixture() {
    const [dev, bidder1, bidder2] = await getSigners();

    // Deploy GF Auction
    const GirlfrenAuctionFactory = await getContractFactory("GirlfrenAuction");
    const gfAuction = await GirlfrenAuctionFactory.connect(dev).deploy();
    await gfAuction.waitForDeployment();
    const gfAuctionAddress = await gfAuction.getAddress();

    // Deploy GirlfrenNFT
    const GirlfrenNFTFactory = await getContractFactory("Girlfren")
    const gfNFT = await GirlfrenNFTFactory.connect(dev).deploy();
    await gfNFT.waitForDeployment();
    const gfNFTAddress = await gfNFT.getAddress();


    // Initialize GirlfrenAuction
    const { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage } = getDefaultAuctionData();
    await gfAuction.connect(dev).initialize(
        gfNFTAddress,
        reservePrice,
        bidIncrement,
        duration,
        timeBuffer,
        reservePercentage
    );

    return { dev, gfAuction, gfAuctionAddress, bidder1, bidder2, };
}

function getDefaultAuctionData() {
    const reservePrice = BigInt(parseEther("1")); // Minimum bid
    const bidIncrement = BigInt(parseEther("0.01")); // Minimum bid increment
    const duration = 86400; // 1 day in seconds
    const timeBuffer = 300; // 5 minutes in seconds
    const reservePercentage = 70; // (100 - reservePercentage)% will go to devs

    return { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage }
}


describe("GirlfrenAuction Contract Admin Functions", function () {

    beforeEach(async function () {
        this.fixture = await loadFixture(deployFixture);
    });

    it("Should update reserve percentage and emit event", async function () {
        const { gfAuction, dev } = this.fixture;
        const newReservePercentage = 85; // New percentage

        await expect(await gfAuction.connect(dev).setReservePercentage(newReservePercentage))
            .to.emit(gfAuction, "AuctionReservePriceUpdated")
            .withArgs(newReservePercentage);

        const auctionData = await gfAuction.auctionData();
        expect(auctionData.reservePercentage).to.equal(newReservePercentage);
    });

    it("Should update bid increment and emit event", async function () {
        const { gfAuction, dev } = this.fixture;
        const newBidIncrement = parseEther("0.02"); // New increment

        await expect(gfAuction.connect(dev).setBidIncrement(newBidIncrement))
            .to.emit(gfAuction, "AuctionBidIncrementUpdated")
            .withArgs(newBidIncrement);

        const auctionData = await gfAuction.auctionData();
        expect(auctionData.bidIncrement).to.equal(newBidIncrement);
    });

    it("Should update reserve price and emit event", async function () {
        const { gfAuction, dev } = this.fixture;
        const newReservePrice = parseEther("2"); // New price

        await expect(gfAuction.connect(dev).setReservePrice(newReservePrice))
            .to.emit(gfAuction, "AuctionReservePriceUpdated")
            .withArgs(newReservePrice);

        const auctionData = await gfAuction.auctionData();
        expect(auctionData.reservePrice).to.equal(newReservePrice);
    });

    // it("Should withdraw ETH and emit event", async function () {
    //     const { gfAuction, gfAuctionAddress, dev } = this.fixture;

    //     // Assuming the contract has some ETH
    //     // Send some ETH to the contract for testing
    //     await dev.sendTransaction({ to: gfAuctionAddress, value: parseEther("1") });

    //     const initialBalance = await ethers.provider.getBalance(dev.address);
    //     const withdrawAmount = await ethers.provider.getBalance(gfAuctionAddress);

    //     await expect(gfAuction.connect(dev).withdrawETH())
    //         .to.emit(gfAuction, "EthWithdrawn") // Replace with your actual event
    //         .withArgs(dev.address, withdrawAmount);

    //     const finalBalance = await ethers.provider.getBalance(dev.address);
    //     expect(finalBalance).to.be.gt(initialBalance);
    // });

}); 