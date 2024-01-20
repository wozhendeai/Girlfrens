const ethers = require("hardhat").ethers;
const { setBalance, loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const WETH_ADDRESS = "0x4200000000000000000000000000000000000023";

const deployFixture = async () => {
    // Create a new random wallet
    let [signer, receiver] = await ethers.getSigners();

    // Set balance for the new wallet (e.g., 5 ETH)
    await setBalance(signer.address, ethers.parseEther("5"));

    // Get deployed contract
    const WETH = await ethers.getContractAt("WETHRebasing", WETH_ADDRESS);
    // const WETHFactory = await getContractFactory("WETH")
    // const WETH = await WETHFactory.connect(dev).deploy();
    // await WETH.waitForDeployment();
    const WETHAddress = await WETH.getAddress();

    return { WETH, WETHAddress, signer, receiver }
}

describe("Test with new signer", function () {

    beforeEach(async function () {
        try {
            this.fixture = await loadFixture(deployFixture);
        } catch (error) {
            console.error("Error in beforeEach hook:", error);
            throw error; // Re-throw the error to make sure the test fails
        }
    });

    it("Should have the correct balance", async function () {
        const { WETH, WETHAddress, signer, receiver } = this.fixture;

        const balance = await ethers.provider.getBalance(signer.address);
        expect(balance).to.be.closeTo(ethers.parseEther("5"), ethers.parseEther("0.01"));
    });

    it("Should deposit ETH and update balance", async function () {
        const { WETH, WETHAddress, signer, receiver } = this.fixture;

        const depositAmount = ethers.parseEther("1");

        // Deposit ETH to WETH contract
        await signer.sendTransaction({
            to: WETHAddress,
            value: depositAmount,
        });

        // Check WETH balance
        const wethBalance = await WETH.balanceOf(signer.address);
        expect(wethBalance).to.equal(depositAmount);
    });

    it("Should withdraw WETH and restore ETH balance", async function () {
        const { WETH, WETHAddress, signer, receiver } = this.fixture;
        const depositAmount = ethers.parseEther("1");

        // Deposit ETH to WETH contract
        await signer.sendTransaction({
            to: WETHAddress,
            value: depositAmount,
        });

        const withdrawAmount = ethers.parseEther("0.5");

        // Withdraw WETH
        await WETH.connect(signer).withdraw(withdrawAmount);

        // Check WETH balance post withdrawal
        const wethBalance = await WETH.balanceOf(signer.address);
        expect(wethBalance).to.be.lessThan(ethers.parseEther("1"));
    });

    it("Should approve an address to spend WETH", async function () {
        const { WETH, WETHAddress, signer, receiver } = this.fixture;
        const approveAmount = ethers.parseEther("0.2");

        // Approve receiver to spend WETH
        await WETH.connect(signer).approve(receiver.address, approveAmount);

        // Check allowance
        const allowance = await WETH.allowance(signer.address, receiver.address);
        expect(allowance).to.equal(approveAmount);
    });

    it("Should transfer WETH to another address", async function () {
        const { WETH, WETHAddress, signer, receiver } = this.fixture;
        const transferAmount = ethers.parseEther("0.1");

        const depositAmount = ethers.parseEther("1");

        // Deposit ETH to WETH contract
        await signer.sendTransaction({
            to: WETHAddress,
            value: depositAmount,
        });

        const withdrawAmount = ethers.parseEther("0.5");

        // Withdraw WETH
        await WETH.connect(signer).withdraw(withdrawAmount);

        // Transfer WETH
        await WETH.connect(signer).transfer(receiver.address, transferAmount);

        // Check receiver's WETH balance
        const receiverBalance = await WETH.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(transferAmount);
    });

    it("Should transfer WETH from an approved address using transferFrom", async function () {
        const { WETH, signer, receiver, WETHAddress } = this.fixture;
        const depositAmount = ethers.parseEther("1");
        const transferAmount = ethers.parseEther("0.1");
        const transferFromAmount = ethers.parseEther("0.1");

        // Deposit ETH to WETH contract
        await signer.sendTransaction({ to: WETHAddress, value: depositAmount });

        // Approve receiver to spend WETH on behalf of signer
        await WETH.connect(signer).approve(receiver.address, transferFromAmount);

        // Transfer WETH to receiver
        await WETH.connect(signer).transfer(receiver.address, transferAmount);

        // Check receiver's WETH balance after the transfer
        const initialReceiverBalance = await WETH.balanceOf(receiver.address);
        expect(initialReceiverBalance).to.equal(transferAmount);

        // Prepare and execute transferFrom transaction
        const transferFromTx = WETH.connect(receiver).transferFrom(signer.address, receiver.address, transferFromAmount);

        // Check for 'Transfer' event emission
        await expect(transferFromTx).to.emit(WETH, "Transfer").withArgs(signer.address, receiver.address, transferFromAmount);

        // Check receiver's new WETH balance
        await expect(() => transferFromTx).to.changeTokenBalance(WETH, receiver, transferFromAmount);
    });
});
