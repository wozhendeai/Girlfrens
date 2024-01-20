const hre = require("hardhat");
const { parseEther, parseUnits, getSigners, getContractFactory, getContractAt }= require("hardhat").ethers;
const { loadFixture, time, setBalance, mine, impersonateAccount } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";

async function deployFixture() {
  const [dev, bidder1, bidder2] = await getSigners();

  // Get deployed contract
  const WETH = await getContractAt("WETH", WETH_ADDRESS);
  const WETHAddress = WETH.getAddress();

  // TreasuryStrategy deployment
  // This contract requires no dependancies
  const TreasuryStrategyFactory = await getContractFactory("TreasuryStrategy")
  const treasuryStrategy = await TreasuryStrategyFactory.connect(dev).deploy();
  await treasuryStrategy.waitForDeployment();
  const treasuryStrategyAddress = await treasuryStrategy.getAddress();

  // Deploy BlasterTreasury
  const GirlfrenTreasuryFactory = await getContractFactory("GirlfrenTreasury")
  const gfTreasury = await GirlfrenTreasuryFactory.connect(dev).deploy(
    WETHAddress, // The underlying asset in vaults is WETH Rebasing
    dev, // Temporarily set NFT contract address as developer
    treasuryStrategyAddress // Set our initial treasury strategy
  );
  await gfTreasury.waitForDeployment();
  const gfTreasuryAddress = await gfTreasury.getAddress();

  // Deploy Girlfren Auction
  const GirlfrenAuctionFactory = await getContractFactory("GirlfrenAuction");
  const gfAuction = await GirlfrenAuctionFactory.connect(dev).deploy();
  await gfAuction.waitForDeployment();
  const gfAuctionAddress = await gfAuction.getAddress();

  // Deploy GirlfrenNFT
  const GirlfrenNFTFactory = await getContractFactory("Girlfren")
  const gfNFT = await GirlfrenNFTFactory.connect(dev).deploy();
  await gfNFT.waitForDeployment();
  const gfNFTAddress = await gfNFT.getAddress();

  // Update Girlfren NFT to use correct Auction Address
  await gfNFT.connect(dev).setGirlfrenAuction(gfAuctionAddress);

  // Update Girlfren Treasury to use correct NFT address
  await gfTreasury.connect(dev).setGirlfrensNFTAddress(gfNFTAddress);

  return { dev, bidder1, bidder2, WETH, gfTreasury, gfNFT, gfNFTAddress, gfAuction };
}

function getDefaultAuctionData() {
  const reservePrice = BigInt(parseEther("1") ); // Example value
  const bidIncrement = BigInt(parseEther("0.01")); // Example value
  const duration = 86400; // 1 day in seconds
  const timeBuffer = 300; // 5 minutes in seconds
  const reservePercentage = 10; // 10%

  return { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage }
}

describe("Integration Test", function () {

  beforeEach(async function () {
    try {
      this.fixture = await loadFixture(deployFixture);
      const { gfAuction, gfNFTAddress, dev } = this.fixture;
  
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
    } catch (error) {
      console.error("Error in beforeEach hook:", error);
      throw error; // Re-throw the error to make sure the test fails
    }
  });
  
  it("Should have correct initialization parameters", async function () {
    const { gfAuction, gfNFTAddress } = this.fixture;

    // Fetch default auction data from tests
    const { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage } = getDefaultAuctionData();

    // Fetch auction data from the contract
    const auctionData = await gfAuction.auctionData();

    // Assert each parameter
    expect(auctionData.girlfrensNFT).to.equal(gfNFTAddress);
    expect(auctionData.reservePrice).to.equal(reservePrice);
    expect(auctionData.bidIncrement).to.equal(bidIncrement);
    expect(auctionData.duration).to.equal(duration);
    expect(auctionData.timeBuffer).to.equal(timeBuffer);
    expect(auctionData.reservePercentage).to.equal(reservePercentage);
  });

});
