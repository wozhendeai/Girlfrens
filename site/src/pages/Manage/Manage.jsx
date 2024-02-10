// Manage NFTs,
//      - Burn NFTs
//      - View backed ETH
// Manage Auction data
//      - All bids
//      - Unsuccesful bids
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
import BidCard from "../../components/BidCard/BidCard";
import ManageNFTCard from "../../components/ManageNFTCard/ManageNFTCard";

// Hooks
import useTokensOfOwner from "../../hooks/useTokensOfOwner";
import { useUserBids } from "../../hooks/useUserBids";
import "./Manage.css";

function Manage() {

    const { userBids, loading: isUserBidsLoading } = useUserBids(); // Adjusted to destructure directly
    const { tokensOfOwner: ownedTokens, isTokenIdsLoading } = useTokensOfOwner();

    if (isTokenIdsLoading || !ownedTokens || isUserBidsLoading) return <div>Loading...</div>;

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
            <h1>Manage Bids</h1>
            <div className="bid-list-container">
                {userBids && userBids.length > 0 ? (
                    userBids.map((bid, index) => (
                        <BidCard key={index} bid={bid} />
                    ))
                ) : (
                    <p>No bids to display.</p>
                )}
            </div>
        </div>
    )
}

export default Manage;