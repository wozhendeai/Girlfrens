// SPDX-License-Identifier: GPL-3.0
// forked from REMILIA COLLECTIVE
// ETYMOLOGY: Zora Auction House -> Noun Auction House -> Girlfren Auction

pragma solidity ^0.8.20;

import "solady/src/utils/SafeTransferLib.sol";
import "solady/src/utils/SafeCastLib.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract GirlfrenAuction is OwnableUpgradeable {
    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                           EVENTS                           */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    event AuctionCreated(
        uint256 indexed girlfrenId,
        uint256 startTime,
        uint256 endTime
    );

    event AuctionBid(
        uint256 indexed girlfrenId,
        address bidder,
        uint256 amount,
        bool extended
    );

    event AuctionExtended(uint256 indexed girlfrenId, uint256 endTime);

    event AuctionSettled(
        uint256 indexed girlfrenId,
        address winner,
        uint256 amount
    );

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionBidIncrementUpdated(uint256 bidIncrement);

    event AuctionDurationUpdated(uint256 duration);

    event AuctionReservePercentageUpdated(uint256 reservePercentage);

    event GirlfrenRedeemed(uint256 indexed girlfrenId);

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                          STORAGE                           */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev A struct containing the auction data and configuration.
     * We bundle as much as possible into a single struct so that we can
     * use a single view function to fetch all the relevant data,
     * helping us reduce RPC calls.
     *
     * Notes:
     *
     * - `uint96` is enough to represent 79,228,162,514 ETH.
     *   Currently, there is only 120,523,060 ETH in existence.
     *
     * - `uint40` is enough to represent timestamps up to year 36811 A.D.
     */
    struct AuctionData {
        // The address of the current highest bid.
        address bidder;
        // The current highest bid amount.
        uint96 amount;
        // The amount of fees collected from the auction.
        uint96 withdrawable;
        // The start time of the auction.
        uint40 startTime;
        // The end time of the auction.
        uint40 endTime;
        // ID for the Girlfren (ERC721 token ID). Starts from 0.
        uint24 girlfrenId;
        // Whether or not the auction has been settled.
        bool settled;
        // The percent (0 .. 100) of the bidded amount to store in the Girlfren.
        uint8 reservePercentage;
        // The Girlfrens ERC721 token contract.
        address girlfrensNFT;
        // The minimum price accepted in an auction.
        uint96 reservePrice;
        // The minimum bid increment.
        uint96 bidIncrement;
        // The duration of a single auction.
        uint32 duration;
        // The minimum amount of time left in an auction after a new bid is created.
        uint32 timeBuffer;
        // The amount of ETH in the Girlfrens NFT contract.
        // This can be considered as the treasury balance.
        uint256 girlfrenBalance;
        // Total number of Girlfrens redeemed.
        uint256 girlfrensTotalRedeemed;
    }

    /**
     * @dev The auction data.
     */
    AuctionData internal _auctionData;

    /**
     * @dev The amount of auctions possible
     * TODO: Get value from Blasters MAX_SUPPLY
     */
    uint256 public constant MAX_SUPPLY = 1000;

    /**
     * @dev The address that deployed the contract.
     */
    address internal immutable _deployer;

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                        CONSTRUCTOR                         */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    constructor() {
        _deployer = msg.sender;
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                        INITIALIZER                         */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     */
    function initialize(
        address girlfrensNFT,
        uint96 reservePrice,
        uint96 bidIncrement,
        uint32 duration,
        uint32 timeBuffer,
        uint8 reservePercentage
    ) external payable initializer {
        require(_deployer == msg.sender, "Only the deployer can call.");
        require(
            girlfrensNFT != address(0),
            "Girlfrens must not be the zero address."
        );
        require(_auctionData.girlfrensNFT == address(0), "Already initialized.");

        __Ownable_init(msg.sender);

        _checkReservePercentage(reservePercentage);
        _checkReservePrice(reservePrice);
        _checkBidIncrement(bidIncrement);
        _checkDuration(duration);

        _auctionData.girlfrensNFT = girlfrensNFT;

        _auctionData.reservePrice = reservePrice;
        _auctionData.bidIncrement = bidIncrement;

        _auctionData.duration = duration;
        _auctionData.timeBuffer = timeBuffer;

        _auctionData.reservePercentage = reservePercentage;
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*              PUBLIC / EXTERNAL VIEW FUNCTIONS              */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Returns all the public data on the auction,
     * with some useful extra information on the Girlfrens NFT.
     */
    function auctionData() external view returns (AuctionData memory data) {
        data = _auctionData;
        // Load some extra data regarding the Girlfrens NFT contract.
        data.girlfrenBalance = address(data.girlfrensNFT).balance;
        data.girlfrensTotalRedeemed = IGirlfrenNFT(data.girlfrensNFT).totalRedeemed();
    }

    /**
     * @dev Returns whether the auction has ended.
     */
    function hasEnded() public view returns (bool) {
        return block.timestamp >= _auctionData.endTime;
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*              PUBLIC / EXTERNAL WRITE FUNCTIONS             */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Create a bid for a Girlfren, with a given amount.
     * This contract only accepts payment in ETH.
     *
     * The frontend should pass in the next `girlfrenId` and the next `generationHash`
     * when the auction has ended.
     */
    function createBid(
        uint256 girlfrenId,
        uint256 generationHash
    ) external payable {
        // To prevent gas under-estimation.
        require(gasleft() > 150000);

        /* ------- AUTOMATIC AUCTION CREATION AND SETTLEMENT -------- */

        bool creationFailed;
        if (_auctionData.startTime == 0) {
            // If the first auction has not been created,
            // try to create a new auction.
            creationFailed = !_createAuction(generationHash);
        } else if (hasEnded()) {
            if (_auctionData.settled) {
                // If the auction has ended, and is settled, try to create a new auction.
                creationFailed = !_createAuction(generationHash);
            } else {
                // Otherwise, if the auction has ended, but is yet been settled, settle it.
                _settleAuction();
                // After settling the auction, try to create a new auction.
                if (!_createAuction(generationHash)) {
                    // If the creation fails, it means that we have ran out of generation hashes.
                    // In this case, refund all the ETH sent and early return.
                    SafeTransferLib.forceSafeTransferETH(msg.sender, msg.value);
                    return;
                }
            }
        }
        // If the auction creation fails, we must revert to prevent any bids.
        require(!creationFailed, "Cannot create auction.");

        /* --------------------- BIDDING LOGIC ---------------------- */

        address lastBidder = _auctionData.bidder;
        uint256 amount = _auctionData.amount; // `uint96`.
        uint256 endTime = _auctionData.endTime; // `uint40`.

        // Ensures that the `girlfrenId` is equal to the auction's.
        // This prevents the following scenarios:
        // - A bidder bids a high price near closing time, the next auction starts,
        //   and the high bid gets accepted as the starting bid for the next auction.
        // - A bidder bids for the next auction due to frontend being ahead of time,
        //   but the current auction gets extended,
        //   and the bid gets accepted for the current auction.
        require(girlfrenId == _auctionData.girlfrenId, "Bid for wrong Girlfren.");

        if (amount == 0) {
            require(
                msg.value >= _auctionData.reservePrice,
                "Bid below reserve price."
            );
        } else {
            // Won't overflow. `amount` and `bidIncrement` are both stored as 96 bits.
            require(
                msg.value >= amount + _auctionData.bidIncrement,
                "Bid too low."
            );
        }

        _auctionData.bidder = msg.sender;
        _auctionData.amount = SafeCastLib.toUint96(msg.value); // Won't overflow on ETH mainnet.

        if (_auctionData.timeBuffer == 0) {
            emit AuctionBid(girlfrenId, msg.sender, msg.value, false);
        } else {
            // Extend the auction if the bid was received within `timeBuffer` of the auction end time.
            uint256 extendedTime = block.timestamp + _auctionData.timeBuffer;
            // Whether the current timestamp falls within the time extension buffer period.
            bool extended = endTime < extendedTime;
            emit AuctionBid(girlfrenId, msg.sender, msg.value, extended);

            if (extended) {
                _auctionData.endTime = SafeCastLib.toUint40(extendedTime);
                emit AuctionExtended(girlfrenId, extendedTime);
            }
        }

        if (amount != 0) {
            // Refund the last bidder.
            SafeTransferLib.forceSafeTransferETH(lastBidder, amount);
        }
    }

    /**
     * @dev Settles the auction.
     * This method may be called by anyone if there are no bids to trigger
     * settling the ended auction, or to settle the last auction,
     * when all the generation hash hashes have been used.
     */
    function settleAuction() external {
        require(
            block.timestamp >= _auctionData.endTime,
            "Auction still ongoing."
        );
        require(_auctionData.startTime != 0, "No auction.");
        require(_auctionData.bidder != address(0), "No bids.");
        require(!_auctionData.settled, "Auction already settled.");
        _settleAuction();
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                   ADMIN WRITE FUNCTIONS                    */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Set the auction reserve price.
     */
    function setReservePrice(uint96 reservePrice) external onlyOwner {
        _checkReservePrice(reservePrice);
        _auctionData.reservePrice = reservePrice;
        emit AuctionReservePriceUpdated(reservePrice);
    }

    /**
     * @dev Set the auction bid increment.
     */
    function setBidIncrement(uint96 bidIncrement) external onlyOwner {
        _checkBidIncrement(bidIncrement);
        _auctionData.bidIncrement = bidIncrement;
        emit AuctionBidIncrementUpdated(bidIncrement);
    }

    /**
     * @dev Set the auction time duration.
     */
    function setDuration(uint32 duration) external onlyOwner {
        _checkDuration(duration);
        _auctionData.duration = duration;
        emit AuctionDurationUpdated(duration);
    }

    /**
     * @dev Set the auction time buffer.
     */
    function setTimeBuffer(uint32 timeBuffer) external onlyOwner {
        _auctionData.timeBuffer = timeBuffer;
        emit AuctionTimeBufferUpdated(timeBuffer);
    }

    /**
     * @dev Set the reserve percentage
     * (the percentage of the max bid that is stored in the Girlfren).
     */
    function setReservePercentage(uint8 reservePercentage) external onlyOwner {
        _checkReservePercentage(reservePercentage);
        _auctionData.reservePercentage = reservePercentage;
        emit AuctionReservePriceUpdated(reservePercentage);
    }

    /**
     * @dev Withdraws all the ETH in the contract.
     */
    function withdrawETH() external onlyOwner {
        uint256 amount = _auctionData.withdrawable;
        _auctionData.withdrawable = 0;
        SafeTransferLib.forceSafeTransferETH(msg.sender, amount);
    }

    /**
     * @dev For emitting an event when a Girlfren has been redeemed.
     */
    function emitGirlfrenRedeemedEvent(uint256 girlfrenId) external payable {
        // The caller can only be either the Girlfrens contract,
        // TODO: [remove] or the owner of this contract (for testing purposes).
        require(msg.sender == _auctionData.girlfrensNFT || msg.sender == owner());
        emit GirlfrenRedeemed(girlfrenId);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                 EVENT EMITTERS FOR TESTING                 */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    function emitAuctionCreatedEvent(
        uint256 girlfrenId,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        emit AuctionCreated(girlfrenId, startTime, endTime);
    }

    function emitAuctionBidEvent(
        uint256 girlfrenId,
        address bidder,
        uint256 amount,
        bool extended
    ) external onlyOwner {
        emit AuctionBid(girlfrenId, bidder, amount, extended);
    }

    function emitAuctionExtendedEvent(
        uint256 girlfrenId,
        uint256 endTime
    ) external onlyOwner {
        emit AuctionExtended(girlfrenId, endTime);
    }

    function emitAuctionSettledEvent(
        uint256 girlfrenId,
        address winner,
        uint256 amount
    ) external onlyOwner {
        emit AuctionSettled(girlfrenId, winner, amount);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                 INTERNAL / PRIVATE HELPERS                 */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Create an auction.
     * Stores the auction details in the `auction` state variable
     * and emits an `AuctionCreated` event.
     * Returns whether the auction has been created successfully.
     */
    function _createAuction(uint256 generationHash) internal returns (bool) {
        // This is the index into the `generationHashHashes`.
        // If there is no auction, its value is 0.
        // Otherwise, its value is the next `girlfrenId`.
        uint256 girlfrenId = uint256(_auctionData.girlfrenId) + 1;

        // If we have reached the tokens max supply,
        // we cannot create a new auction.
        require(girlfrenId > MAX_SUPPLY, "No more auctions, reached max supply.");

        // Mint the Girlfren.
        girlfrenId = IGirlfrenNFT(_auctionData.girlfrensNFT).mint(generationHash);

        uint256 endTime = block.timestamp + _auctionData.duration;

        _auctionData.bidder = address(1);
        _auctionData.amount = 0;
        _auctionData.startTime = SafeCastLib.toUint40(block.timestamp);
        _auctionData.endTime = SafeCastLib.toUint40(endTime);
        _auctionData.girlfrenId = SafeCastLib.toUint24(girlfrenId);
        _auctionData.settled = false;

        emit AuctionCreated(girlfrenId, block.timestamp, endTime);

        return true;
    }

    /**
     * @dev Settle an auction, finalizing the bid.
     */
    function _settleAuction() internal {
        address bidder = _auctionData.bidder;
        uint256 amount = _auctionData.amount;
        uint256 withdrawable = _auctionData.withdrawable;
        uint256 girlfrenId = _auctionData.girlfrenId;
        uint256 reservePercentage = _auctionData.reservePercentage;
        address girlfrensNFT = _auctionData.girlfrensNFT;

        // Amount of ETH to be converted into shares
        uint256 girlfrenShares = (amount * reservePercentage) / 100;
        // Auction fees
        withdrawable += amount - girlfrenShares;

        // Transfer the Girlfren to the winner.
        IGirlfrenNFT(girlfrensNFT).transferPurchasedGirlfren{value: girlfrenShares}(
            girlfrenId,
            bidder
        );

        _auctionData.settled = true;
        _auctionData.withdrawable = SafeCastLib.toUint96(withdrawable);

        emit AuctionSettled(girlfrenId, bidder, amount);
    }

    /**
     * @dev Checks whether `reservePercentage` is within 1..100 (inclusive).
     */
    function _checkReservePercentage(uint8 reservePercentage) internal pure {
        require(reservePercentage < 101, "Reserve percentage exceeds 100.");
    }

    /**
     * @dev Checks whether `reservePrice` is greater than 0.
     */
    function _checkReservePrice(uint96 reservePrice) internal pure {
        require(reservePrice != 0, "Reserve price must be greater than 0.");
    }

    /**
     * @dev Checks whether `bidIncrement` is greater than 0.
     */
    function _checkBidIncrement(uint96 bidIncrement) internal pure {
        require(bidIncrement != 0, "Bid increment must be greater than 0.");
    }

    /**
     * @dev Checks whether `bidIncrement` is greater than 0.
     */
    function _checkDuration(uint32 duration) internal pure {
        require(duration != 0, "Duration must be greater than 0.");
    }
}

interface IGirlfrenNFT {
    /**
     * @dev Allows the minter to transfer `tokenId` to address `to`,
     * while accepting a ETH deposit to be stored inside the Girlfren,
     * to be redeemed if it is burned.
     */
    function transferPurchasedGirlfren(
        uint256 tokenId,
        address to
    ) external payable;

    /**
     * @dev Allows the minter to mint a Girlfren to itself, with `generationHash`.
     */
    function mint(
        uint256 generationHash
    ) external payable returns (uint256 tokenId);

    /**
     * @dev Total number of Girlfrens redeemed (burned).
     */
    function totalRedeemed() external view returns (uint32);
}
