const prisma = require("../../prismaClient");

// Utility function to fetch contract address by name
async function getContractAddress(name) {
    try {
        const contract = await prisma.contractAddress.findUnique({
            where: { name },
        });
        return contract ? contract.address : null;
    } catch (error) {
        console.error(`Failed to fetch contract address for ${name}:`, error);
        return null;
    }
}

module.exports = getContractAddress;