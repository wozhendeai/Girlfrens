// Manage NFTs,
//      - Burn NFTs
//      - View backed ETH
// Manage Auction data
//      - All bids
//      - Unsuccesful bids
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
import { ManageNFTCard } from "../../components/ManageNFTCard/ManageNFTCard";
import useTokensOfOwner from "../../hooks/useTokensOfOwner";
import "./Manage.css";

function Manage() {

    const { tokensOfOwner: ownedTokens, isTokenIdsLoading } = useTokensOfOwner();

    if (isTokenIdsLoading || !ownedTokens) return <div>Loading...</div>;

    return (
        <div className="manage-container">
            {/* Header */}
            <h1>
                Manage NFTs
            </h1>
            <div className="auction-list-container">
                {ownedTokens.map((token, index) => (
                    <div key={index} className="auction-card-container">
                        <ManageNFTCard
                            tokenId={token}
                        />
                    </div>
                ))}
            </div>

            {/* Manage Bids */}
            <h1>
                Manage Bids
            </h1>
        </div>
    )
}

export default Manage;