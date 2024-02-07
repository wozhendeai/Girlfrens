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
    // TODO: Error handling
  }
});

// Get all bids for a token ID
router.get('/:tokenId/bids', async (req, res) => {
  const { tokenId } = req.params;
  try {
    const bids = await getBidsForTokenID(tokenId);
    // TODO: better response
    res.json({ bids });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;