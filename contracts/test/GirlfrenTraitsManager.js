const crypto = require("crypto");
const hre = require("hardhat");
const { parseEther, getSigners, getContractFactory, getContractAt } = require("hardhat").ethers;
const { loadFixture, time, setBalance } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const EntropyABI = require("@pythnetwork/entropy-sdk-solidity/abis/IEntropy.json");

// Constants
const ethers = hre.ethers;

async function deployFixture() {
    const [dev, bidder1, bidder2] = await getSigners();

    const ENTROPY_CONTRACT = "0x98046Bd286715D3B0BC227Dd7a956b83D8978603";

    // Get entropy provider contract TODO: Probably better renamed to "entropyContract"
    const entropyProvider = await getContractAt(EntropyABI, ENTROPY_CONTRACT);

    // Get data from entropy provider
    const entropyProviderAddress = await entropyProvider.getDefaultProvider();
    // 0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344
    
    let entropyProviderUri = (await entropyProvider.getProviderInfo(entropyProviderAddress)).uri;
    entropyProviderUri = "https://fortuna-staging.pyth.network/v1/chains/blast-testnet/"
    // 0x0000000000000000

    // Deploy GirlfrenTraitManager
    const GirlfrenTraitManagerFactory = await getContractFactory("GirlfrenTraitManager")
    const gfTraitManager = await GirlfrenTraitManagerFactory.connect(dev).deploy(
        dev.address, // For testing purposes, we can act as Girlfriend NFT contract address
        entropyProviderAddress
    );
    await gfTraitManager.waitForDeployment();
    const gfTMAddress = await gfTraitManager.getAddress();

    return {
        dev,
        gfTraitManager,
        gfTMAddress,
        entropyProvider,
        entropyProviderAddress,
        entropyProviderUri,
        bidder1,
        bidder2
    };
}

describe("GirlfrenTraitManager", function () {

    beforeEach(async function () {
        this.fixture = await loadFixture(deployFixture);
    });

    it("Should initiate randomness request directly using contract", async function () {
        const { dev, entropyProvider, entropyProviderAddress, entropyProviderUri, gfTraitManager } = this.fixture;

        // Generate a 32-byte random number on the client side, then hash it with keccak256 to create a commitment 
        const randomString = crypto.randomBytes(32);
        const randomHexString = '0x' + randomString.toString("hex");;

        // Hash it with keccak256 to create a commitment 
        const commitment = ethers.keccak256(randomHexString);

        // Get fee for generating randomness
        const fee = await entropyProvider.getFee(entropyProviderAddress);

        // Request a number from Entropy
        const tx = await (await entropyProvider.request(entropyProviderAddress, commitment, true, { value: fee })).wait();

        // Search for sequence number from tx

        // Parse the logs from the transaction receipt
        const parsedLogs = tx.logs.map(log => {
            try {
                return entropyProvider.interface.parseLog(log);
            } catch {
                // Ignore if log is not from entropyProvider
                return null;
            }
        }).filter(log => log !== null);

        // Search for the 'Requested' event and extract the sequence number
        const requestedEvent = parsedLogs.find(log => log.name === 'Requested');
        if (!requestedEvent) {
            throw new Error('Requested event not found');
        }
        const requestedEventLogs = requestedEvent.args[0];
        const sequenceNumber = requestedEventLogs[1];

        // Fetch the provider's number
        const data = await fetch(`${entropyProviderUri}/revelations/${sequenceNumber}`);
        let json = await data.json();
        const providerRandomNumber = json.value.data;

        // Reveal number
        await entropyProvider.reveal(entropyProviderAddress, sequenceNumber, randomString, "0x" + providerRandomNumber)
    });

    // it("Should initiate randomness request", async function () {
    //     const { dev, entropyProvider, entropyProviderAddress, gfTraitManager } = this.fixture;

    //     const fee = await entropyProvider.getFee(entropyProviderAddress);

    //     await expect(
    //         await gfTraitManager.connect(dev).requestRandomnessForToken(1, { value: fee })
    //     )
    //         .to.emit(gfTraitManager, "RandomnessRequested");

    // });

}); 