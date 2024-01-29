// SPDX-License-Identifier: GPL-3.0
// forked from REMILIA COLLECTIVE

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "hardhat/console.sol";

contract Girlfren is ERC721, Ownable {
    // Constants
    /**
     * @dev The first token `tokenId` that will be minted.
     */
    uint256 public constant START_TOKEN_ID = 1;

    /**
     * @dev The max supply of Girlfren.
     */
    uint256 public constant MAX_SUPPLY = 1000;

    /**
     * @dev Blast rebasing WETH contract address
     */
    address public WETH_ADDRESS = 0x4200000000000000000000000000000000000023;

    // Storage
    /**
     * @dev The base URI.
     */
    string internal __baseURI;

    /**
     * @dev The Girlfren auction contract.
     */
    address internal _girlfrenAuction;

    /**
     * @dev The Girlfren treasury contract.
     */
    address internal _girlfrenTreasury;

    /**
     * @dev The Girlfren trait manager contract
     */
    address internal _girlfrensTraitManager;

    /**
     * @dev The next `tokenId` to be minted.
     */
    uint32 public nextTokenId;

    /**
     * @dev Total number of Girlfren redeemed (burned).
     */
    uint32 public totalRedeemed;

    /**
     * @dev Whether the minter is permanently locked.
     */
    bool public minterLocked;

    /**
     * @dev Whether minting is permanently locked.
     */
    bool public mintLocked;

    /**
     * @dev Mapping of `tokenId` to shares (amount of vault shares stored in each Girlfren).
     */
    mapping(uint256 => uint256) private _vaultShares;

    // Constructor
    constructor() ERC721("Girlfren", "GF") Ownable(msg.sender) {
        nextTokenId = uint32(START_TOKEN_ID);
    }

    // Public Functions
    /**
     * @dev ERC721 override to return the token URI for `tokenId`.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory result) {
        require(ownerOf(tokenId) != address(0), "Token does not exist.");

        string memory metadata = IGirlfrenTraitsManager(_girlfrensTraitManager)
            .getMetadata(tokenId);

        return metadata;
    }

    /**
     * @dev Returns the amount of vault shares stored in `tokenId`.
     */
    function getGirlfrenShares(uint256 tokenId) public view returns (uint256) {
        return _vaultShares[tokenId];
    }

    /**
     * @dev Returns the total number of Girlfren minted.
     */
    function totalMinted() external view returns (uint256) {
        return nextTokenId - START_TOKEN_ID;
    }

    /**
     * @dev Returns the total number of Girlfren in existence.
     */
    function totalSupply() external view returns (uint256) {
        return nextTokenId - START_TOKEN_ID - totalRedeemed;
    }

    /**
     * @dev Returns the max total number of Girlfren
     */
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /**
     * @dev Returns if the `tokenId` exists.
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Returns if the `tokenIds` exist.
     */
    function exist(
        uint256[] memory tokenIds
    ) external view returns (bool[] memory results) {
        uint256 n = tokenIds.length;
        results = new bool[](n);
        for (uint256 i; i < n; ++i) {
            results[i] = _ownerOf(tokenIds[i]) != address(0);
        }
    }

    /**
     * @dev Returns an array of all the `tokenIds` held by `owner`.
     */
    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory tokenIds) {
        uint256 n = balanceOf(owner);
        tokenIds = new uint256[](n);
        uint256 end = nextTokenId;
        uint256 o;
        for (uint256 i = START_TOKEN_ID; i < end && o < n; ++i) {
            if (_ownerOf(i) == owner) tokenIds[o++] = i;
        }
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*              PUBLIC / EXTERNAL WRITE FUNCTIONS             */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Allows a Girlfren holder to burn a Girlfren, and redeem the shares inside it.
     */
    function redeemGirlfren(uint256 tokenId) external {
        ++totalRedeemed;

        // Get the amount of vault shares a NFT contains
        uint256 shares = _vaultShares[tokenId];

        require(
            ownerOf(tokenId) == msg.sender,
            "Must own Girlfren to redeem it."
        );

        // Burn the NFT before transferring the shares
        _burn(tokenId);

        // We can free the storage for some gas refund. `tokenId` will only increase.
        // We don't need to use the value again after the Girlfren has been redeemed.
        delete _vaultShares[tokenId];

        IGirlfrenAuction(_girlfrenAuction).emitGirlfrenRedeemedEvent(tokenId);

        // Transfer the vault shares to the user
        IGirlfrenTreasury(_girlfrenTreasury).withdrawAssets(msg.sender, shares);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                   MINTER WRITE FUNCTIONS                   */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Allows the minter to transfer `tokenId` to address `to`,
     * while accepting a ETH deposit to be stored inside the Bonkler,
     * to be redeemed if it is burned.
     */
    function transferPurchasedGirlfren(
        uint256 tokenId,
        address to
    ) external payable onlyGirlfrenAuction {
        // Check the initial balance of vault shares for this contract
        uint256 initialShares = IERC20(_girlfrenTreasury).balanceOf(
            address(this)
        );

        // Wrap ETH into WETH
        IWETH(WETH_ADDRESS).deposit{value: msg.value}();

        // Approve the GirlfrenTreasury to spend the WETH
        IWETH(WETH_ADDRESS).approve(_girlfrenTreasury, msg.value);

        // Deposit the WETH into the vault (GirlfrenTreasury)
        IGirlfrenTreasury(_girlfrenTreasury).depositAssets(
            address(this),
            msg.value
        );

        // Check new balance of vault shares after deposit
        uint256 newShares = IERC20(_girlfrenTreasury).balanceOf(address(this));

        // Calculate the number of shares issued due to this deposit
        uint256 sharesIssued = newShares - initialShares;

        // Update the mapping for the tokenId with the new shares issued
        _vaultShares[tokenId] = sharesIssued;

        // Transfer the NFT to the new owner
        _transfer(msg.sender, to, tokenId);
    }

    /**
     * @dev Allows the minting of a Girlfren
     */
    function mint()
        external
        payable
        onlyGirlfrenAuction
        returns (uint256 tokenId)
    {
        require(nextTokenId <= MAX_SUPPLY, "Public sale has ended");

        // Increment and mint the NFT
        tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);

        // Initiate random on-chain metadata generation
        IGirlfrenTraitsManager(_girlfrensTraitManager)
            .requestRandomnessForToken(tokenId);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                   ADMIN WRITE FUNCTIONS                    */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Sets the minter.
     */
    function setGirlfrenAuction(address minter) external onlyOwner {
        require(!minterLocked, "Locked.");
        _girlfrenAuction = minter;
    }

    /**
     * @dev Sets the treasury address.
     */
    function setGirlfrenTreasury(address girlfrenTreasury) external onlyOwner {
        require(!minterLocked, "Locked.");
        _girlfrenTreasury = girlfrenTreasury;
    }

    /**
     * @dev Sets the trait manager.
     */
    function setGirlfrensTraitManager(
        address girlfrenTraitManager
    ) external onlyOwner {
        require(!minterLocked, "Locked.");
        _girlfrensTraitManager = girlfrenTraitManager;
    }

    /**
     * @dev Sets the base URI.
     */
    // function setBaseURI(string memory baseURI) external onlyOwner {
    //     require(!baseURILocked, "Locked.");
    //     __baseURI = baseURI;
    // }

    /**
     * @dev Permanently locks the minter from being changed.
     */
    function lockMinter() external onlyOwner {
        minterLocked = true;
    }

    /**
     * @dev Permanently locks minting.
     */
    function lockMint() external onlyOwner {
        mintLocked = true;
    }

    /**
     * @dev Permanently locks the base URI.
     */
    // function lockBaseURI() external onlyOwner {
    //     baseURILocked = true;
    // }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                 INTERNAL / PRIVATE HELPERS                 */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Guards a function such that only the minter is authorized to call it.
     */
    modifier onlyGirlfrenAuction() virtual {
        require(msg.sender == _girlfrenAuction, "Unauthorized minter.");
        _;
    }
}

interface IGirlfrenAuction {
    function emitGirlfrenRedeemedEvent(uint256 bonklerId) external payable;
}

interface IGirlfrenTreasury {
    function depositAssets(address receiver, uint256 assets) external payable;

    function withdrawAssets(address receiver, uint256 assets) external payable;

    function transferShares(address to, uint256 amount) external;
}

interface IGirlfrenTraitsManager {
    function requestRandomnessForToken(uint256 tokenId) external payable;

    function getMetadata(uint256 tokenId) external view returns (string memory);
}

interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint value) external returns (bool);

    function withdraw(uint) external;

    function approve(address, uint) external returns (bool);
}
