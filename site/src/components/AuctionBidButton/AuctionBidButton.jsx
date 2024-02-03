import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";
import useBidOnAuction from '../../hooks/useBidOnAuction';
import useAuctionData from '../../hooks/useAuctionData';
import { parseEther } from 'viem';

function AuctionBidButton() {
    const [bidAmount, setBidAmount] = useState('');
    const { bid, error, isBidding, isConfirming } = useBidOnAuction();
    const { auctionData, isLoading: isLoadingAuctionData, error: auctionDataError } = useAuctionData();

    async function handleOnClick(e) {
        e.preventDefault();
        console.log(`Auction data:` + auctionData, `Bid amount:` + bidAmount)
        console.log()
        if (!auctionData || !bidAmount) return;
        // If auction hasn't started or is settled but next auction hasn't started, we add one to girlfren id
        if(auctionData.girlfrenId == 0 || auctionData.endTime == null) {
            auctionData.girlfrenId = auctionData.girlfrenId + 1;
        }
        bid(Number(auctionData.girlfrenId), parseEther(bidAmount));
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
                    disabled={isBidding || isConfirming || isLoadingAuctionData}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleOnClick} disabled={isBidding || isConfirming || isLoadingAuctionData}>
                    Place Bid
                </Button>
            </InputGroup>
            {isLoadingAuctionData && <div>Loading auction data...</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {error && <div>Error: {error.message}</div>}
            {auctionDataError && <div>Error fetching auction data: {auctionDataError.message}</div>}
        </>
    );
}

export default AuctionBidButton;
