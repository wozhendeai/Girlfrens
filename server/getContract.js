const ethers = require('ethers');
const getContractAddress = require('./utils/contractData/getContractAddress');
const abi = require("../contracts/artifacts/contracts/GirlfrenAuction.sol/GirlfrenAuction.json");

async function getAuctionContract() {
    const contractAddress = await getContractAddress("girlfrenAuction");
    if (!contractAddress) {
        throw new Error("Contract address for 'girlfrenAuction' not found.");
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    return new ethers.Contract(contractAddress, abi.abi, provider);
}

async function getNFTContract() {
    const contractAddress = await getContractAddress("girlfrenNFT");
    if (!contractAddress) {
        throw new Error("Contract address for 'girlfrenNFT' not found.");
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    return new ethers.Contract(contractAddress, abi.abi, provider);
}

module.exports = {getAuctionContract, getNFTContract};
