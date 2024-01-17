// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "./TreasuryStrategy.sol";

abstract contract BlasterTreasury is ERC4626, Ownable {
    using Math for uint256;

    // Constants

    // Storage
    /**
     * @dev The address of the Blasters NFT
     */
    address _blastersNFT;
    /**
     * @dev The current treasury vault strategy.
     */
    // TODO: Change to address
    TreasuryStrategy _treasuryStrategy;
    // TODO: Add underscore to below address
    /**
     * @dev The proposed new strategy
     */
    address public newStrategy;
    /**
     * @dev The block timestamp of when the strategy change was initiated
     */
    uint256 public strategyChangeInitiated;
    /**
     * @dev Timelock length on how long it will take to change current strategy
     */
    uint256 public constant STRATEGY_CHANGE_DELAY = 1 days;

    // Events
    event StrategyChangeInitiated(address indexed newStrategy, uint256 at);
    event StrategyChanged(address indexed newStrategy);

    // Modifier
    modifier onlyBlastersNFT() {
        require(msg.sender == _blastersNFT, "");
        _;
    }

    /**
     * @dev Initializes the BlasterTreasury contract, setting up the underlying asset for the ERC4626 vault and the initial treasury strategy.
     * @param asset The ERC20 token to be used as the underlying asset in the vault.
     * @param treasuryStrategy The initial strategy to be employed by the treasury.
     */
    constructor(
        IERC20 asset,
        address blastersNFT,
        TreasuryStrategy treasuryStrategy
    )
        ERC20("BLASTERSHARES", "BLASTERSHARES")
        ERC4626(asset)
        Ownable(msg.sender)
    {
        // The address of Blasters NFT
        _blastersNFT = blastersNFT;
        // The initial treasury yield-bearing strategy we'll use
        _treasuryStrategy = treasuryStrategy;
    }

    // Public functions

    /**
     * @dev Allows users to deposit assets into the vault in exchange for vault shares and automatically deposits the assets into the active strategy.
     * @param receiver The address that will receive the vault shares.
     * @param assets The amount of the underlying asset to deposit.
     */
    function depositAssets(address receiver, uint256 assets) public onlyBlastersNFT {
        uint256 shares = previewDeposit(assets);
        _deposit(msg.sender, receiver, assets, shares);

        // Deposit into strategy
        _treasuryStrategy.deposit();
    }

    /**
     * @dev Allows users to withdraw their assets from the vault by redeeming their vault shares and automatically withdraws the assets from the active strategy.
     * @param receiver The address that will receive the withdrawn assets.
     * @param assets The amount of assets to withdraw from the vault.
     */
    function withdrawAssets(address receiver, uint256 assets) public onlyBlastersNFT {
        uint256 shares = previewWithdraw(assets);
        _withdraw(msg.sender, receiver, msg.sender, assets, shares);

        // Withdraw from strategy
        _treasuryStrategy.withdraw();
    }

    /**
     * @dev Initiates the process to change the treasury's strategy by setting a new proposed strategy. This change is subject to a delay for security.
     * @param _newStrategy The contract address of the new strategy proposed for the treasury.
     */
    function proposeStrategy(address _newStrategy) public onlyOwner {
        require(_newStrategy != address(0), "Invalid strategy address");
        newStrategy = _newStrategy;
        strategyChangeInitiated = block.timestamp;

        emit StrategyChangeInitiated(newStrategy, strategyChangeInitiated);
    }

    /**
     * @dev Executes the strategy change after the delay period has passed, updating the treasury's active strategy to the previously proposed strategy.
     */
    function executeStrategyChange() public onlyOwner {
        require(newStrategy != address(0), "No strategy change initiated");
        require(
            block.timestamp >= strategyChangeInitiated + STRATEGY_CHANGE_DELAY,
            "Strategy change delay has not passed"
        );

        // Change strategy
        _treasuryStrategy = TreasuryStrategy(newStrategy);
        newStrategy = address(0);

        // TODO: Migrate funds from previous strategy to current

        emit StrategyChanged(address(_treasuryStrategy));
    }
}
