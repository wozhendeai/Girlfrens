const { ethers } = require('ethers');
const prisma = require('../prismaClient');
const { getAuctionContract } = require("../getContract");
const createBid = require('./createBid');

async function setupEventListeners() {
    const auctionContract = await getAuctionContract();
  
    auctionContract.on('AuctionBid', async (girlfrenId, bidder, amount, extended) => {
        const createBid = await createBid(girlfrenId, bidder, amount, extended);
    });
  }
  
module.exports = setupEventListeners;
