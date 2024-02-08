// Manage NFTs,
//      - Burn NFTs
//      - View backed ETH
// TODO: Use actual token URI
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useGirlfrenShares } from "../../hooks/useGirlfrenShares";
import { formatEther } from "viem";
// import { useTokenURI } from "../../hooks/useTokenUri";

// eslint-disable-next-line react/prop-types
const ManageNFTCard = ({ tokenId, }) => {
    // const { tokenURI, isLoadingTokenURI, errorTokenURI } = useTokenURI(tokenId);
    let tokenURI = "https://www.w3schools.com/images/w3schools_green.jpg", isLoadingTokenURI = false, errorTokenURI = false;
    const { shares, isLoadingShares, sharesError, redeemGirlfren } = useGirlfrenShares(tokenId);

    if (errorTokenURI || sharesError) return <div>Error loading data</div>;
    if (isLoadingTokenURI || isLoadingShares || !tokenURI || !shares) return <div>loading..</div>;

    const redeem = () => {
        redeemGirlfren(tokenId)
    }

    return (
        <Card>
            <Card.Img variant="top" src={tokenURI} />
            <Card.Body>
                <Card.Title>NFT #{Number(tokenId)}</Card.Title>
                <Card.Text>Shares: {formatEther(shares)}</Card.Text>
                <Button variant="primary" onClick={redeem}>
                    Redeem for ETH
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ManageNFTCard;