const express = require('express');
const prisma = require("../prismaClient");
const router = express.Router();

// Utils
const getTokenIDToBidOn = require('../utils/getTokenIDToBidOn');

router.get('/current-token', async (req, res) => {
    const tokenId = await getTokenIDToBidOn();
    res.json({ tokenId });
  });
  