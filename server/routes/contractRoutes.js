/**
 * @dev Routes for all current contract addresses
 * @description Primarily helpful for rapid web-development
 */
const express = require('express');
const prisma = require("../prismaClient");
const router = express.Router();

// Utils
const getContractAddress = require('../utils/contractData/getContractAddress');

// Fetch all contract addresses
router.get('/', async (req, res) => {
  const contracts = await prisma.contractAddress.findMany();
  res.json(contracts);
});

// Fetch a specific contract address by name
router.get('/:name', async (req, res) => {
  const { name } = req.params;

  const contractAddress = await getContractAddress(name);

  if (contract) {
    res.json(contractAddress);
  } else {
    res.status(404).json({ message: "Contract not found" });
  }
});

// Update a contract address
router.put('/:name', async (req, res) => {
  const { name } = req.params;
  const { address } = req.body;

  try {
    const updatedContract = await prisma.contractAddress.update({
      where: { name },
      data: { address },
    });
    res.json(updatedContract);
  } catch (error) {
    res.status(404).json({ message: "Contract not found or update failed" });
  }
});

module.exports = router;
