const hre = require("hardhat");
const { parseEther, getSigners, getContractFactory, getContractAt } = require("hardhat").ethers;
const { loadFixture, time, setBalance } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const ethers = hre.ethers;

const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";

async function deployFixture() {
    const [dev, bidder1, bidder2] = await getSigners();

    // Deploy GirlfrenNFT
    const GirlfrenNFTFactory = await getContractFactory("Girlfren")
    const gfNFT = await GirlfrenNFTFactory.connect(dev).deploy();
    await gfNFT.waitForDeployment();
    const gfNFTAddress = await gfNFT.getAddress();

    // Update Girlfren NFT to use correct Auction Address and Treasury Address
    await gfNFT.connect(dev).setGirlfrenAuction(dev.address);

    return { dev, bidder1, bidder2, gfNFT, gfNFTAddress };
}

describe("NFT Tests", function () {

    beforeEach(async function () {
        this.fixture = await loadFixture(deployFixture);
    });

    // it("Should not exceed MAX_SUPPLY when minting", async function () {
    //     const { gfNFT } = this.fixture;
    //     const MAX_SUPPLY = await gfNFT.MAX_SUPPLY();
    
    //     // Creating a promise for each mint operation
    //     const mintPromises = [];
    //     for (let i = 0; i < MAX_SUPPLY; i++) {
    //         mintPromises.push(gfNFT.mint());
    //     }
    
    //     // Executing all promises simultaneously
    //     await Promise.all(mintPromises);
    
    //     // Checking if minting beyond MAX_SUPPLY is reverted
    //     await expect(gfNFT.mint()).to.be.revertedWith("Public sale has ended");
    // });
    
    it("Should increment nextTokenId upon minting", async function () {
        const { gfNFT } = this.fixture;
        const initialTokenId = await gfNFT.nextTokenId();

        await gfNFT.mint();
        const newTokenId = await gfNFT.nextTokenId();

        expect(newTokenId).to.equal(initialTokenId + BigInt(1));
    });

    it("Should correctly report total minted and total supply", async function () {
        const { gfNFT } = this.fixture;
        const mintCount = BigInt(5);
      
        for (let i = BigInt(0); i < mintCount; i++) {
          await gfNFT.mint();
        }
      
        const totalMinted = await gfNFT.totalMinted();
        const totalSupply = await gfNFT.totalSupply();
        const totalRedeemed = await gfNFT.totalRedeemed();

        expect(totalMinted).to.equal(mintCount);
        expect(totalSupply).to.equal(mintCount - totalRedeemed);
      });      
});
