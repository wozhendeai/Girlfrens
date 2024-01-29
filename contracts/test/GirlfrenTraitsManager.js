const hre = require("hardhat");
const { parseEther, getSigners, getContractFactory, getContractAt } = require("hardhat").ethers;
const { loadFixture, time, setBalance } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const EntropyABI = require("@pythnetwork/entropy-sdk-solidity/abis/IEntropy.json");

// Constants
const ethers = hre.ethers;
const ENTROPY_PROVIDER = "0x0708325268dF9F66270F1401206434524814508b";

async function deployFixture() {
    const [dev, bidder1, bidder2] = await getSigners();

    // Deploy GirlfrenTraitManager
    const GirlfrenTraitManagerFactory = await getContractFactory("GirlfrenTraitManager")
    const gfTraitManager = await GirlfrenTraitManagerFactory.connect(dev).deploy(
        dev.address, // For testing purposes, we can act as Girlfriend NFT contract address
        ENTROPY_PROVIDER
    );
    await gfTraitManager.waitForDeployment();
    const gfTMAddress = await gfTraitManager.getAddress();

    // Get entropy provider contract
    const entropyProvider = await getContractAt(EntropyABI, ENTROPY_PROVIDER);
    const entropyProviderAddress = await entropyProvider.getAddress();


    return {
        dev,
        gfTraitManager,
        gfTMAddress,
        entropyProvider,
        entropyProviderAddress,
        bidder1,
        bidder2
    };
}

describe("GirlfrenTraitManager", function () {

    beforeEach(async function () {
        this.fixture = await loadFixture(deployFixture);
    });

    it("Should initiate randomness request", async function () {
        const { dev, entropyProvider, entropyProviderAddress, gfTraitManager } = this.fixture;

        const fee = await entropyProvider.getFee(entropyProviderAddress);
        await expect(
            await gfTraitManager.connect(dev).requestRandomnessForToken(1, { value: fee })
        )
            .to.emit(gfTraitManager, "RandomnessRequested");

    });

}); 