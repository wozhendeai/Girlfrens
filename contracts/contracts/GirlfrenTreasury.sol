// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "./TreasuryStrategy.sol";

contract GirlfrenTreasury is ERC4626, Ownable {
    using Math for uint256;

    // Constants
    /**
     * @dev Timelock length on how long it will take to change current strategy
     */
    uint256 public constant STRATEGY_CHANGE_DELAY = 1 days;

    // Storage
    /**
     * @dev The address of the Blasters NFT
     */
    address _girlfrensNFT;
    /**
     * @dev The current treasury vault strategy.
     */
    address _treasuryStrategy;
    /**
     * @dev The proposed new strategy
     */
    address public _newStrategy;
    /**
     * @dev The block timestamp of when the strategy change was initiated
     */
    uint256 public strategyChangeInitiated;

    // Events
    event StrategyChangeInitiated(address indexed newStrategy, uint256 at);
    event StrategyChanged(address indexed newStrategy);

    // Modifier
    modifier onlyGirlfrensNFT() {
        require(msg.sender == _girlfrensNFT, "Only Girlfrens NFT can deposit into vault");
        _;
    }

    /**
     * @dev Initializes the BlasterTreasury contract, setting up the underlying asset for the ERC4626 vault and the initial treasury strategy.
     * @param asset The ERC20 token to be used as the underlying asset in the vault.
     * @param treasuryStrategy The initial strategy to be employed by the treasury.
     */
    constructor(
        IERC20 asset,
        address girlfrensNFT,
        address treasuryStrategy
    )
        ERC20("GFShares", "GFShares")
        ERC4626(asset)
        Ownable(msg.sender)
    {
        // The address of Blasters NFT
        _girlfrensNFT = girlfrensNFT;
        // The initial treasury yield-bearing strategy we'll use
        _treasuryStrategy = treasuryStrategy;
    }

    // Public functions

    /**
     * @dev Allows users to deposit assets into the vault in exchange for vault shares and automatically deposits the assets into the active strategy.
     * @param receiver The address that will receive the vault shares.
     * @param assets The amount of the underlying asset to deposit.
     */
    function depositAssets(address receiver, uint256 assets) public onlyGirlfrensNFT {
        uint256 shares = previewDeposit(assets);
        _deposit(msg.sender, receiver, assets, shares);
        
        // Deposit into strategy
        ITreasuryStrategy(_treasuryStrategy).deposit();
    }

    /**
     * @dev Allows users to withdraw their assets from the vault by redeeming their vault shares and automatically withdraws the assets from the active strategy.
     * @param receiver The address that will receive the withdrawn assets.
     * @param assets The amount of assets to withdraw from the vault.
     */
    function withdrawAssets(address receiver, uint256 assets) public onlyGirlfrensNFT {
        uint256 shares = previewWithdraw(assets);
        _withdraw(msg.sender, receiver, msg.sender, assets, shares);

        // Withdraw from strategy
        ITreasuryStrategy(_treasuryStrategy).withdraw();
    }

    /**
     * @dev Initiates the process to change the treasury's strategy by setting a new proposed strategy. This change is subject to a delay for security.
     * @param newStrategy The contract address of the new strategy proposed for the treasury.
     */
    function proposeStrategy(address newStrategy) public onlyOwner {
        require(newStrategy != address(0), "Invalid strategy address");
        _newStrategy = newStrategy;
        strategyChangeInitiated = block.timestamp;

        emit StrategyChangeInitiated(_newStrategy, strategyChangeInitiated);
    }

    /**
     * @dev Executes the strategy change after the delay period has passed, updating the treasury's active strategy to the previously proposed strategy.
     */
    function executeStrategyChange() public onlyOwner {
        require(_newStrategy != address(0), "No strategy change initiated");
        require(
            block.timestamp >= strategyChangeInitiated + STRATEGY_CHANGE_DELAY,
            "Strategy change delay has not passed"
        );

        // Change strategy
        _treasuryStrategy = _newStrategy;
        _newStrategy = address(0);

        // TODO: Migrate funds from previous strategy to current

        emit StrategyChanged(address(_treasuryStrategy));
    }

    /**
     * @dev Allows the current girlfen NFT contract to change address
     */
    function setGirlfrensNFTAddress (address girlfrensNFT) public onlyGirlfrensNFT {
        _girlfrensNFT = girlfrensNFT;
    }
}

interface ITreasuryStrategy {
    function withdraw() external;
    function deposit() external;
}