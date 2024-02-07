import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { abi, config } from '../contractConfig';
import { blastSepolia } from 'viem/chains';
import { formatUnits } from 'viem';

// TODO: Convert to `useContext`
const useAuctionData = () => {
  const { data, error: contractError, isLoading: isContractLoading } = useReadContract({
    address: config.girlfrenAuction,
    abi: abi.abi,
    chainId: blastSepolia.id,
    functionName: "auctionData",
  });

  const [tokenId, setTokenId] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [isTokenLoading, setTokenLoading] = useState(false);

  // Fetches tokenId & inProgress from the server
  useEffect(() => {
    setTokenLoading(true);
    fetchCurrentTokenId().then(data => {
      setTokenId(data.tokenId);
      setInProgress(data.inProgress);
      setTokenLoading(false);
      console.log(`Auction data:`, data)
    }).catch(error => {
      setTokenError(error);
      setTokenLoading(false);
    });
  }, []);

  // Combine isLoading and error states
  const isLoading = isContractLoading || isTokenLoading;
  const error = contractError || tokenError;

  // Transform the raw data into a more friendly format, including fetched tokenId & inProgress
  const formattedData = data && !error ? {
    ...data,
    amount: getHighestBid(data.amount, inProgress, data.reservePrice),
    withdrawable: formatEther(data.withdrawable),
    startTime: data.startTime !== 0 ? formatDate(data.startTime) : null,
    endTime: data.endTime !== 0 ? formatDate(data.endTime) : null,
    reservePrice: formatEther(data.reservePrice),
    bidIncrement: formatEther(data.bidIncrement),
    girlfrenBalance: data.girlfrenBalance.toString(),
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed.toString(),
    tokenId: tokenId,
    inProgress: inProgress,
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

// Helper function to fetch data from the server
const fetchCurrentTokenId = async () => {
  try {
    const endpoint = import.meta.env.VITE_SERVER_URL + '/auction/current-token';
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current token ID:', error);
    throw error; // Rethrow to be caught by the consuming function
  }
};

// If the auction is not in progress, then it will show the highest bid of the last auction.
// Therefore, lets show reserve price when auction is not in progress
const getHighestBid = (amount, inProgress, reservePrice) => {
  if (!inProgress) {
    return formatEther(reservePrice);
  }

  // Show normal auction data if auction is in progress
  return formatEther(amount);
}

const formatDate = (timestamp) => {
  if (!timestamp) {
    return null; // Return null or a sensible default
  }

  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

  return `${formattedTime} • ${formattedDate}`;
};

const formatEther = (bn) => {
  return formatUnits(bn, 18);
}

export default useAuctionData;
