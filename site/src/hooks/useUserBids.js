// TODO: Get whether winning bid
// TODO: Get whether bid won and waiting to be settled
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export const useUserBids = () => {
    const { address } = useAccount();
    const [userBids, setUserBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to format fetched bid data
    const formatBidData = (bidData) => bidData.map((bid) => ({
        ...bid,
        tokenId: bid.auction.tokenId,
        amount: formatEther(bid.amount), // Convert amount from Wei to Ether
        startTime: new Date(bid.auction.startTime).toLocaleString(),
        endTime: new Date(bid.auction.endTime).toLocaleString(),
        // Additional formatting logic can be placed here
    }));

    useEffect(() => {
        if (!address) return;

        setLoading(true);
        fetch(import.meta.env.VITE_SERVER_URL + `/auction/bids/address/${address}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                const formattedData = formatBidData(data);
                setUserBids(formattedData);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [address]);

    return { userBids, loading, error };
};