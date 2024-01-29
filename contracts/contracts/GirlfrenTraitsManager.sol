// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol"; // Import the Entropy SDK
import "hardhat/console.sol";

contract GirlfrenTraitManager {
    // State Variables
    string public constant BASE_URI = "ipfs://[id]/";
    // Address of Girlfrens NFT contract
    address private _girlfrenNFT;
    // Address of entropy provider
    address private _entropyProvider;

    struct GirlfrenTraits {
        string race;
        string eyeColor;
        string hairColor;
        string hairType;
    }

    mapping(uint256 => GirlfrenTraits) private _girlfrenTraits;
    mapping(uint64 => uint256) private entropyRequests; // Maps sequence numbers to token IDs

    // Trait Options
    string[] private raceOptions = ["asian", "white"];
    string[] private eyeColorOptions = ["blue", "black"];
    string[] private hairColorOptions = ["blonde", "black"];
    string[] private hairTypeOptions = ["curly", "straight"];

    // Events
    event RandomnessRequested(uint64 sequenceNumber, uint256 tokenId);
    event TraitsAssigned(uint256 tokenId, GirlfrenTraits traits);

    // Constructor
    constructor(address girlfrenNFT, address entropyProvider) {
        _girlfrenNFT = girlfrenNFT;
        _entropyProvider = entropyProvider;
    }

    // Modifiers
    modifier onlyGirlfrenNFT() {
        require(
            msg.sender == _girlfrenNFT,
            "GirlfrenTraitManager: Caller is not Girlfren NFT contract"
        );
        _;
    }

    // External Functions
    function requestRandomnessForToken(
        uint256 tokenId
    ) external payable onlyGirlfrenNFT {
        uint256 fee = IEntropy(_entropyProvider).getFee(_entropyProvider);
        console.log("fee: %s", fee);

        require(
            msg.value >= fee,
            "GirlfrenTraitManager: Insufficient fee for randomness request"
        );
        // Convert uint256 to bytes32
        bytes32 hashedValue = bytes32(
            keccak256(abi.encodePacked(block.timestamp, tokenId))
        );
        bytes32 userCommitment = IEntropy(_entropyProvider)
            .constructUserCommitment(hashedValue);
        console.log("constructed");
        uint64 sequenceNumber = IEntropy(_entropyProvider).request{value: fee}(
            _entropyProvider,
            userCommitment,
            true
        );
        console.log("requested? %s", sequenceNumber);
        entropyRequests[sequenceNumber] = tokenId;

        emit RandomnessRequested(sequenceNumber, tokenId);
    }

    function revealRandomTrait(
        uint64 sequenceNumber,
        bytes32 userRandom,
        bytes32 providerRandom
    ) external {
        // Check if there's an existing request
        uint256 tokenId = entropyRequests[sequenceNumber];
        require(
            tokenId != 0,
            "GirlfrenTraitManager: No entropy request found for this sequence number"
        );

        // Proceed to reveal and assign traits
        bytes32 randomNumber = IEntropy(_entropyProvider).reveal(
            _entropyProvider,
            sequenceNumber,
            userRandom,
            providerRandom
        );
        _generateRandomTraitForToken(randomNumber, tokenId);

        // Clear the request to prevent re-use
        delete entropyRequests[sequenceNumber];
    }

    // Internal Functions
    function _generateRandomTraitForToken(
        bytes32 randomNumber,
        uint256 tokenId
    ) internal {
        GirlfrenTraits memory traits = GirlfrenTraits({
            race: _pickRandomTrait(raceOptions, uint256(randomNumber)),
            eyeColor: _pickRandomTrait(
                eyeColorOptions,
                uint256(randomNumber >> 64)
            ),
            hairColor: _pickRandomTrait(
                hairColorOptions,
                uint256(randomNumber >> 128)
            ),
            hairType: _pickRandomTrait(
                hairTypeOptions,
                uint256(randomNumber >> 192)
            )
        });

        _girlfrenTraits[tokenId] = traits;
        emit TraitsAssigned(tokenId, traits);
    }

    function _pickRandomTrait(
        string[] memory options,
        uint256 randomValue
    ) internal pure returns (string memory) {
        require(
            options.length > 0,
            "GirlfrenTraitManager: Trait options are empty"
        );
        return options[randomValue % options.length];
    }

    // Public View Functions
    // TODO: Implement checks
    function getMetadata(uint256 tokenId) public view returns (string memory) {
        GirlfrenTraits memory traits = _girlfrenTraits[tokenId];

        string memory attributes = string(
            abi.encodePacked(
                _getAttribute("Race", traits.race),
                ",",
                _getAttribute("Eye Color", traits.eyeColor),
                ",",
                _getAttribute("Hair Color", traits.hairColor),
                ",",
                _getAttribute("Hair Type", traits.hairType)
            )
        );

        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "Girlfren #',
                    Strings.toString(tokenId),
                    '", "description": "Unique traits and characteristics.", "image": "',
                    BASE_URI,
                    Strings.toString(tokenId),
                    '", "attributes": [',
                    attributes,
                    "]}"
                )
            )
        );

        return string(abi.encodePacked(json));
    }

    // Private Helper Functions
    function _getAttribute(
        string memory traitType,
        string memory value
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{ "trait_type": "',
                    traitType,
                    '", "value": "',
                    value,
                    '" }'
                )
            );
    }
}
