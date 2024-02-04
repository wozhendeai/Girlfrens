const prisma = require("../prismaClient");

async function main() {
  const contractNames = [
    "treasuryStrategy",
    "girlfrenTreasury",
    "girlfrenAuction",
    "girlfrenNFT"
  ];
  const contractAddresses = [
    "0x75b1C7c88860c98B52B4C540aE7C2eFDFd5444F1",
    "0xB114665Bd2c39d9359480BcD861859EAb24809EF",
    "0xa998c689E471AeE9E6f93b177CF4E90562903c62",
    "0xBe30d4751F7661729e1d170B33D0fe2ED71C6Fa4"
  ];

  for (let i = 0; i < contractNames.length; i++) {
    await prisma.contractAddress.create({
      data: {
        name: contractNames[i],
        address: contractAddresses[i],
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
