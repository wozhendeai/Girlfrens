const hre = require("hardhat");
const { parseEther, parseUnits, getSigners, getContractFactory, getContractAt, getBlock } = require("hardhat").ethers;
const { loadFixture, time, setBalance } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const ethers = hre.ethers;

const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";

async function deployFixture() {
  const [dev, bidder1, bidder2] = await getSigners();

  // Get deployed contract
  const WETH = await getContractAt("WETHRebasing", WETH_ADDRESS);
  // const WETHFactory = await getContractFactory("WETH")
  // const WETH = await WETHFactory.connect(dev).deploy();
  // await WETH.waitForDeployment();
  const WETHAddress = await WETH.getAddress();

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

  // Update Girlfren NFT to use correct Auction Address and Treasury Address
  await gfNFT.connect(dev).setGirlfrenAuction(gfAuctionAddress);
  await gfNFT.connect(dev).setGirlfrenTreasury(gfTreasuryAddress);

  // Update Girlfren Treasury to use correct NFT address
  await gfTreasury.connect(dev).setGirlfrensNFTAddress(gfNFTAddress);

  return { dev, bidder1, bidder2, WETH, gfTreasury, gfNFT, gfNFTAddress, gfAuction, gfAuctionAddress };
}

function getDefaultAuctionData() {
  const reservePrice = BigInt(parseEther("1")); // Example value
  const bidIncrement = BigInt(parseEther("0.01")); // Example value
  const duration = 86400; // 1 day in seconds
  const timeBuffer = 300; // 5 minutes in seconds
  const reservePercentage = 10; // 10%

  return { reservePrice, bidIncrement, duration, timeBuffer, reservePercentage }
}

describe("Auction Tests", function () {

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

  it("Should start auction with a valid bid", async function () {
    const { gfAuction, bidder1 } = this.fixture;
    const { reservePrice } = getDefaultAuctionData();

    // Assuming the auction starts with girlfrenId 1 and we have a method to get the current timestamp
    const expectedGirlfrenId = 1;
    const currentTimestamp = await time.latest();
    const auctionData = await gfAuction.auctionData();
    const auctionDuration = Number(auctionData.duration);

    // Start an auction and place a valid bid. Our initial bid will be the minimum bid value
    const initialBid = reservePrice;

    await expect(gfAuction.connect(bidder1).createBid(expectedGirlfrenId, { value: initialBid }))
      .to.emit(gfAuction, "AuctionCreated")
      .withArgs(expectedGirlfrenId, currentTimestamp + 1, currentTimestamp + auctionDuration + 1); // assuming auctionDuration is known
  });

  /**
   * @dev Should respect reserve percentage
   * @description It is the minimum amount that must be bid for the auctioned item (in this case, a Girlfren).
   * If the first bid on an item is below the reserve price, it will be rejected.
   * The reserve price acts as a threshold to ensure that bids start from a certain minimum value.
   */
  it("Should allow bids respecting reserve price and minimum bid increment", async function () {
    const { gfAuction, dev, bidder1 } = this.fixture;
    const { reservePrice, bidIncrement } = getDefaultAuctionData();

    // Start an auction and place a valid bid
    // Our initial bid will be the minimum bid value
    const initialBid = reservePrice;
    await expect(gfAuction.connect(bidder1).createBid(1, { value: reservePrice }))
      .to.emit(gfAuction, "AuctionBid")
      .withArgs(1, bidder1.address, reservePrice, false);

    // Try to place a bid below the reserve price (should fail)
    await expect(
      gfAuction.connect(bidder1).createBid(1, { value: reservePrice - BigInt(1) })
    ).to.be.revertedWith("Bid too low.");

    // Place invalid bid, lower than minimum increment
    const expectedMinimumNewBidValue = initialBid + bidIncrement;
    const invalidBidValue = expectedMinimumNewBidValue - BigInt("1"); // 1 wei less than the minimum required
    await expect(
      gfAuction.connect(bidder1).createBid(1, { value: invalidBidValue })
    ).to.be.revertedWith("Bid too low.");

    // Place valid bid
    await gfAuction.connect(bidder1).createBid(1, { value: expectedMinimumNewBidValue })

  });

  /**
 * @dev The auction end time can be extended if a bid is made within a certain time buffer of the auction's scheduled end time. 
 * This is determined by the timeBuffer value in _auctionData. 
 * If a bid is placed within the timeBuffer period before the scheduled end, the auction's endTime is extended.
 */
  it("Should extend auction end time when bid is placed within timeBuffer", async function () {
    const { gfAuction, bidder1, bidder2 } = this.fixture;
    const { reservePrice, bidIncrement, duration, timeBuffer } = getDefaultAuctionData();

    // Start the auction with the first bid
    await gfAuction.connect(bidder1).createBid(1, { value: reservePrice });

    // Increase time to just before the end of the auction, but still within the time buffer
    await time.increase(duration - timeBuffer + 1);

    // Place a new bid within the time buffer
    const bidTx = await gfAuction.connect(bidder2).createBid(1, { value: reservePrice + bidIncrement });

    // Get the exact block timestamp when the bid was placed
    const bidBlock = await ethers.provider.getBlock(bidTx.blockNumber);
    const bidTimestamp = bidBlock.timestamp;

    // Fetch updated auction data
    const updatedAuctionData = await gfAuction.auctionData();

    // Calculate the expected extended end time
    const expectedExtendedEndTime = bidTimestamp + timeBuffer;
    expect(Number(updatedAuctionData.endTime)).to.be.equal(expectedExtendedEndTime);
    await expect(bidTx).to.emit(gfAuction, "AuctionExtended").withArgs(1, expectedExtendedEndTime);
  });

  it("Should settle auction correctly", async function () {
    const { gfAuction, gfNFT, bidder1, bidder2 } = this.fixture;
    const { reservePrice, bidIncrement, duration } = getDefaultAuctionData();

    // Start an auction and place a bid
    await gfAuction.connect(bidder1).createBid(1, { value: reservePrice });

    // Increase time to after the end of the auction
    await time.increase(duration + 1);

    // Call settleAuction
    await expect(gfAuction.connect(bidder1).settleAuction())
      .to.emit(gfAuction, "AuctionSettled")
      .withArgs(1, bidder1.address, reservePrice);

    // Verify that the NFT was transferred and has the correct backing
    const tokenId = await gfNFT.nextTokenId() - BigInt(1); // Assuming this is the correct way to get the last minted tokenId
    expect(await gfNFT.ownerOf(tokenId)).to.equal(bidder1.address);

    // Check for backing, if applicable
    const backing = await gfNFT.getGirlfrenShares(tokenId);
    expect(backing).to.be.greaterThan(0);
  });

  it("Should start a new auction when max supply remaining, on new bid", async function () {
    const { gfAuction, bidder1, bidder2 } = this.fixture;
    const { reservePrice, bidIncrement, duration } = getDefaultAuctionData();

    // Start the auction with the first bid
    await gfAuction.connect(bidder1).createBid(1, { value: reservePrice });

    // Fast forward time past the auction duration
    await time.increase(duration + 1);

    // Now that the auction has ended, we can start to bid on the next NFT.
    // NOTE: The frontend has to account for this.
    // Attempt to place a bid after the auction has ended
    const bidTxPromise = await gfAuction.connect(bidder2).createBid(2, { value: reservePrice });

    // Depending on the contract's logic, you can either expect the bid to be rejected or a new auction to start
    // Uncomment the appropriate line below based on your contract's functionality

    // Expect the bid to be rejected
    // await expect(bidTxPromise).to.be.revertedWith("Auction already ended.");

    // Expect a new auction to start
    // If a new auction should start, you'll need to validate that the auction's data has been reset/updated
    await expect(bidTxPromise).to.emit(gfAuction, "AuctionCreated");
  });

  it("Should not start a new auction after reaching max supply", async function () {
    const { gfAuction, gfNFT, dev, gfAuctionAddress } = this.fixture;
    const { reservePrice } = getDefaultAuctionData();
  
    // Impersonate the auction contract
    const impersonatedSigner = await ethers.getImpersonatedSigner(gfAuctionAddress);
    await setBalance(gfAuctionAddress, 100n ** 18n);

    // Mint Girlfrens up to the maximum supply
    const maxSupply = await gfNFT.maxSupply();
    for (let i = await gfNFT.nextTokenId(); i <= maxSupply; i++) {
      await gfNFT.connect(impersonatedSigner).mint();
    }
    const totalSupply = await gfNFT.totalSupply();
    const totalMinted = await gfNFT.totalMinted();

    // Attempt to start a new auction
    await expect(
      gfAuction.connect(dev).createBid(maxSupply + BigInt(1), { value: reservePrice })
    ).to.be.revertedWith("Public sale has ended");
  });
    
});
