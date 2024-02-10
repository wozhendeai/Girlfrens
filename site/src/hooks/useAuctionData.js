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
  const [bids, setBids] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [isTokenLoading, setTokenLoading] = useState(false);

  // Fetches tokenId & inProgress from the server
  useEffect(() => {
    setTokenLoading(true);
    fetchCurrentTokenId()
      .then(data => {
        setTokenId(data.tokenId);
        setInProgress(data.inProgress);
        return data.tokenId; // Return the tokenId for the next .then
      })
      .then(tokenId => { // Use the returned tokenId here
        if (!tokenId) return; // Check if tokenId is not null
        return fetchBids(tokenId); // Now fetch bids with the valid tokenId
      })
      .then(bidsData => {
        if (bidsData && bidsData.bids) {
          setBids(
            bidsData.bids.map(data => {
              return {
                amount: formatEther(data["amount"]),
                bidder: data["bidder"]
              }
            })
          );
        }
      })
      .catch(error => {
        setTokenError(error);
      })
      .finally(() => {
        setTokenLoading(false);
      });

  }, [tokenId]);

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
    bids: bids
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

/**
 * @description Helper function to fetch data from the server
 */
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

const fetchBids = async (tokenId) => {
  if (tokenId === null) return;

  try {
    const bidsResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/auction/bids/tokenId/${tokenId}`);
    if (!bidsResponse.ok) {
      throw new Error(`HTTP error! status: ${bidsResponse.status}`);
    }
    const bidsData = await bidsResponse.json();
    return bidsData;
  } catch (error) {
    console.log(`Failed to fetch bids:`, error);
  }
};

/**
 * @description If the auction is not in progress, then it will show the highest bid of the last auction.
 * Therefore, lets show reserve price when auction is not in progress
 * @param {bn} amount 
 * @param {boolean} inProgress 
 * @param {bn} reservePrice 
 * @returns Reserve price if auction hasn't started or highest bid amount if auction is in progress
 */
const getHighestBid = (amount, inProgress, reservePrice) => {
  if (!inProgress) {
    return formatEther(reservePrice);
  }

  // Show normal auction data if auction is in progress
  return formatEther(amount);
}

/**
 * 
 * @param {bn} timestamp 
 * @returns Formatted date
 */
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

/**
 * 
 * @param {bn} bn Value in WEI 
 * @returns Wei value converted to ether as a string
 */
const formatEther = (bn) => {
  return formatUnits(bn, 18);
}

export default useAuctionData;
