import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";
import { parseEther } from 'viem';
import useBidOnAuction from '../../hooks/useBidOnAuction';
import useCurrentTokenId from '../../hooks/useCurrentTokenId';

function AuctionBidButton() {
    const [bidAmount, setBidAmount] = useState('');
    const { bid, error, isBidding, isConfirming } = useBidOnAuction();
    const { tokenId, loading: isLoadingTokenId, error: tokenIdError } = useCurrentTokenId(); // Use the hook

    async function handleOnClick(e) {
        e.preventDefault();
        if (!tokenId || !bidAmount) return;
        
        // Use the tokenId from the hook instead of auctionData
        bid(tokenId, parseEther(bidAmount));
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
                    disabled={isBidding || isConfirming || isLoadingTokenId}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleOnClick} disabled={isBidding || isConfirming || isLoadingTokenId}>
                    Place Bid
                </Button>
            </InputGroup>
            {isConfirming && <div>Waiting for confirmation...</div>}
            {error && <div>Error: {error.message}</div>}
            {tokenIdError && <div>Error: {tokenIdError.message}</div>}
            {tokenId === -1 && <div>Max supply reached. No more auctions available.</div>}

        </>
    );
}

export default AuctionBidButton;
