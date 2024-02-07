import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";
import { parseEther } from 'viem';
import useBidOnAuction from '../../hooks/useBidOnAuction';
import useAuctionData from '../../hooks/useAuctionData';

function AuctionBidButton() {
    const [bidAmount, setBidAmount] = useState('');
    const { bid, error, isBidding, isConfirming } = useBidOnAuction();
    const { auctionData, isLoading: isLoadingAuctionData } = useAuctionData();

    const isLoading = isBidding || isConfirming || isLoadingAuctionData;

    async function handleOnClick(e) {
        e.preventDefault();
        if (!bidAmount) return;
        
        // Use the tokenId from the hook instead of auctionData
        bid(auctionData.tokenId, parseEther(bidAmount));
    }

    return (
        <>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Enter bid (ETH)"
                    aria-label="Enter bid"
                    aria-describedby="basic-addon2"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    disabled={isLoading}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleOnClick} disabled={isLoading}>
                    Place Bid
                </Button>
            </InputGroup>
            {isConfirming && <div>Waiting for confirmation...</div>}
            {error && <div>Error: {error.message}</div>}
            {auctionData.tokenId === -1 && <div>Max supply reached. No more auctions available.</div>}

        </>
    );
}

export default AuctionBidButton;
