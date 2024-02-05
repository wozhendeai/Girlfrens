// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.log(
    "Deploying the contracts with the account: ",
    deployerAddress
  );

  const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";
  const ENTROPY_CONTRACT = "0x98046Bd286715D3B0BC227Dd7a956b83D8978603";

  // Deploy the initial strategy to farm yield
  const treasuryStrategyAddress = await deployContract("TreasuryStrategy");

  // Deploy Vault contract
  const girlfrenTreasuryAddress = await deployContract(
    "GirlfrenTreasury",
    WETH_ADDRESS,
    deployerAddress,
    treasuryStrategyAddress
  );

  // Deploy auction contract
  const girlfrenAuctionAddress = await deployContract("GirlfrenAuction");

  // Deploy girlfrens NFT contract
  const girlfrenNFTAddress = await deployContract("Girlfren");

  // Get Girlfren NFT contract to interact with and Girlfren Treasury
  const GirlfrenNFT = await ethers.getContractFactory("Girlfren");
  const girlfrenNFT = await GirlfrenNFT.attach(girlfrenNFTAddress);

  const GirlfrenTreasury = await ethers.getContractFactory("GirlfrenTreasury");
  const girlfrenTreasury = await GirlfrenTreasury.attach(girlfrenTreasuryAddress);

  // Set proper variables
  await girlfrenNFT.setGirlfrenAuction(girlfrenAuctionAddress);
  console.log(`Set girlfren auction contract address in girlfren nft to ${girlfrenAuctionAddress}`);

  await girlfrenNFT.setGirlfrenTreasury(girlfrenTreasuryAddress);
  console.log(`Set girlfren treasury contract address in girlfren nft to ${girlfrenTreasuryAddress}`);

  await girlfrenTreasury.setGirlfrensNFTAddress(girlfrenNFTAddress);
  console.log(`Set girlfren nft contract address in girlfren treasury to ${girlfrenNFTAddress}`);

  // TODO: Send POST to server with updated addresses & block they were mined at
}

// Utils
const deployContract = async (contractName, ...args) => {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...args);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`Deployed ${contractName}; Address: ${contractAddress}`)
  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
