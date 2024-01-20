# Run tests on Blast Sepolia
1. `npx hardhat node --fork https://sepolia.blast.io`
2. `npx hardhat test --network localhost --show-stack-traces`

If you want to claim NFT without bidding again call `settleAuction`
There's no need for a new auction to be created if there's no bidder