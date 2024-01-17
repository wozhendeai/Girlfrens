// SPDX-License-Identifier: GPL-3.0
// forked from REMILIA COLLECTIVE

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract BlastersNFT is ERC721, Ownable {
    // Constants
    /**
     * @dev The starting `tokenId`.
     */
    uint256 public constant START_TOKEN_ID = 1;

    /**
     * @dev The max supply of Blasters.
     */
    uint256 public constant MAX_SUPPLY = 10000;

    // Storage
    /**
     * @dev The base URI.
     */
    string internal __baseURI;

    /**
     * @dev The Blaster auction contract.
     */
    address internal _minter;

    /**
     * @dev The Blaster treasury contract.
     */
    address internal _blasterTreasury;

    /**
     * @dev The next `tokenId` to be minted.
     */
    uint32 public nextTokenId;

    /**
     * @dev Total number of Blasters redeemed (burned).
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
     * @dev Mapping of `tokenId` to shares (amount of vault shares stored in each Blaster).
     */
    mapping(uint256 => uint256) private _vaultShares;

    // Constructor
    constructor(
        address blasterTreasury
    ) ERC721("Blasters", "BLSTR") Ownable(msg.sender) {
        nextTokenId = uint32(START_TOKEN_ID);
        _blasterTreasury = blasterTreasury;
    }

    // Public Functions
    /**
     * @dev ERC721 override to return the token URI for `tokenId`.
     */
    // function tokenURI(
    //     uint256 tokenId
    // ) public view virtual override returns (string memory result) {
    //     require(ownerOf(tokenId) == address(0), "Token does not exist.");

    //     // TODO: Implement on-chain art
    // }

    /**
     * @dev Returns the amount of vault shares stored in `tokenId`.
     */
    function getBlasterShares(uint256 tokenId) public view returns (uint256) {
        return _vaultShares[tokenId];
    }

    /**
     * @dev Returns the total number of Blasters minted.
     */
    function totalMinted() external view returns (uint256) {
        return nextTokenId - START_TOKEN_ID;
    }

    /**
     * @dev Returns the total number of Blasters in existence.
     */
    function totalSupply() external view returns (uint256) {
        return nextTokenId - START_TOKEN_ID - totalRedeemed;
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
     * @dev Allows a Blaster holder to burn a Blaster, and redeem the shares inside it.
     */
    function redeemBlaster(uint256 tokenId) external {
        ++totalRedeemed;

        // Get the amount of vault shares a NFT contains
        uint256 shares = _vaultShares[tokenId];

        require(
            ownerOf(tokenId) == msg.sender,
            "Must own Blaster to redeem it."
        );

        // Burn the NFT before transferring the shares
        _burn(tokenId);

        // We can free the storage for some gas refund. `tokenId` will only increase.
        // We don't need to use the value again after the Blaster has been redeemed.
        delete _vaultShares[tokenId];

        // Transfer the vault shares to the user
        IBlasterTreasury(_blasterTreasury).withdrawAssets(msg.sender, shares);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                   MINTER WRITE FUNCTIONS                   */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Allows the minter to transfer `tokenId` to address `to`,
     * while accepting a ETH deposit to be stored inside the Bonkler,
     * to be redeemed if it is burned.
     */
    function transferPurchasedBonkler(
        uint256 tokenId,
        address to
    ) external payable onlyMinter {
        // Check current balance of shares before deposit
        uint256 initialShares = IERC20(_blasterTreasury).balanceOf(
            address(this)
        );

        // Deposit ETH to vault
        IBlasterTreasury(_blasterTreasury).depositAssets(
            address(this),
            msg.value
        );

        // Check new balance of shares after deposit
        uint256 newShares = IERC20(_blasterTreasury).balanceOf(address(this));

        // Calculate number of shares issued for this deposit
        uint256 sharesIssued = newShares - initialShares;
        
        
        _vaultShares[tokenId] = sharesIssued;

        _transfer(msg.sender, to, tokenId);
    }

    /**
     * @dev Allows the minting of a Blaster
     */
    function mint() external payable onlyMinter returns (uint256 tokenId) {
        require(nextTokenId <= MAX_SUPPLY, "Public sale has ended");

        // Increment and mint the NFT
        tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                   ADMIN WRITE FUNCTIONS                    */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /**
     * @dev Sets the minter.
     */
    function setMinter(address minter) external onlyOwner {
        require(!minterLocked, "Locked.");
        _minter = minter;
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
    modifier onlyMinter() virtual {
        require(msg.sender == _minter, "Unauthorized minter.");
        _;
    }
}

interface IBlasterTreasury {
    function depositAssets(address receiver, uint256 assets) external payable;

    function withdrawAssets(address receiver, uint256 assets) external payable;

    function transferShares(address to, uint256 amount) external;
}
