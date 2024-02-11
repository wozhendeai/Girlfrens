const crypto = require('crypto');
const ethers = hre.ethers;



const main = async () => {
    const [ deployer ] = await ethers.getSigners();


    // Create a new contract instance for WETH
    const WETHAddress = "0x4200000000000000000000000000000000000023";
    const WETH = await ethers.getContractFactory("WETHRebasing");
    const weth = await WETH.attach(WETHAddress);
    
    // Get the balance of WETH for the deployer
    const balance = await weth.balanceOf(deployer.address);
    console.log(`WETH Balance: ${ethers.formatEther(balance)} WETH`);

    // Unwrap all WETH to ETH
    const tx = await weth.withdraw(balance);
    console.log(`Unwrapping WETH... TxHash: ${tx.hash}`);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log('WETH successfully unwrapped to ETH');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});