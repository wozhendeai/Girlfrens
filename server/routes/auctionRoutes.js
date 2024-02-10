const express = require('express');
const prisma = require("../prismaClient");
const router = express.Router();

// Utils
const getTokenIDToBidOn = require('../utils/getTokenIDToBidOn');
const getBidsForTokenID = require('../utils/getBidsForTokenID');

// Get the token ID that should be bid on
router.get('/current-token', async (req, res) => {
  try {
    const response = await getTokenIDToBidOn();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all bids for a token ID
router.get('/bids/tokenId/:tokenId', async (req, res) => {
  const { tokenId } = req.params;
  try {
    const bids = await getBidsForTokenID(tokenId);
    // TODO: better response
    res.json({ bids });
  } catch (error) {
    console.error(error);
  }
});

// Get all bids placed by a specific bidder address
router.get('/bids/address/:bidderAddress', async (req, res) => {
  const { bidderAddress } = req.params;
  console.log(bidderAddress)
  try {
    const bids = await prisma.bid.findMany({
      where: {
        bidder: bidderAddress,
      },
      include: {
        auction: true, // Include related auction data
      },
    });
    console.log(`Bids found: ${bids.length} for ${bidderAddress}`);
    res.json(bids);
  } catch (error) {
    console.error('Failed to get bids for bidder:', error);
    res.status(500).json({ error: 'Failed to get bids for bidder' });
  }
});

module.exports = router;