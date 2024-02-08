import abi from "../../contracts/artifacts/contracts/GirlfrenAuction.sol/GirlfrenAuction.json";
import GirlfrenNFTABI from "../../contracts/artifacts/contracts/GirlfrenNFT.sol/Girlfren.json";

const config = {
    treasuryStrategy: "0x75b1C7c88860c98B52B4C540aE7C2eFDFd5444F1",
    girlfrenTreasury: "0xB114665Bd2c39d9359480BcD861859EAb24809EF",
    girlfrenAuction: "0xa998c689E471AeE9E6f93b177CF4E90562903c62",
    girlfrenNFT: "0xBe30d4751F7661729e1d170B33D0fe2ED71C6Fa4",
}


export { abi, GirlfrenNFTABI, config };