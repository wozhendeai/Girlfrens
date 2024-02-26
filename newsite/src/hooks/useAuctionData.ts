import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { abi, config } from '../contractConfig';
import { blastSepolia } from 'viem/chains';
import { formatUnits } from 'viem';

interface Bid {
  amount: string; // Assuming this is a string, but you can change it to the correct type
  bidder: string;
  txHash: string;
  time: string;
}

interface AuctionData {
  amount: string;
  withdrawable: string;
  startTime: string | null;
  endTime: string | null;
  reservePrice: string;
  bidIncrement: string;
  girlfrenBalance: string;
  girlfrensTotalRedeemed: string;
  tokenId: number | null;
  inProgress: boolean;
  bids: Bid[];
}

interface ContractData {
  amount?: string;
  reservePrice?: string;
  withdrawable?: string;
  startTime?: number; // Assuming startTime is a number (timestamp)
  endTime?: number; // Assuming endTime is a number (timestamp)
  bidIncrement?: string;
  girlfrenBalance?: string;
  girlfrensTotalRedeemed?: string;
  // Include other properties as needed
}

interface TokenData {
  tokenId: number;
  inProgress: boolean;
}

const useAuctionData = () => {
  const { data: rawData, error: contractError, isLoading: isContractLoading } = useReadContract({
    address: config.girlfrenAuction,
    abi: abi.abi,
    chainId: blastSepolia.id,
    functionName: "auctionData",
  });
  const data = rawData as ContractData | undefined;

  const [tokenId, setTokenId] = useState<number | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [inProgress, setInProgress] = useState(false);
  const [tokenError, setTokenError] = useState<Error | null>(null);
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
      // Use the returned tokenId here to fetch indexed bids for that tokenId
      .then(tokenId => {
        if (!tokenId) return; // Check if tokenId is not null
        return fetchBids(tokenId); // Now fetch bids with the valid tokenId
      })
      // Then we format bids data
      .then(data => {
        const bidData = data as { bids: Bid[] }; // Assuming data is of this structure
        console.log(bidData)
        setBids(bidData.bids.map(bid => ({
          amount: formatEther(BigInt(bid.amount)),
          bidder: bid.bidder,
          txHash: bid.txHash,
          time: bid.time
        })));
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
  const formattedData: AuctionData | null = data && !error ? {
    amount: data.amount ? getHighestBid(data.amount, inProgress, data.reservePrice ?? '') : '',
    withdrawable: data.withdrawable ? formatEther(data.withdrawable) : '',
    startTime: data.startTime ? formatDate(data.startTime) : null,
    endTime: data.endTime ? formatDate(data.endTime) : null,
    reservePrice: data.reservePrice ? formatEther(data.reservePrice) : '',
    bidIncrement: data.bidIncrement ? formatEther(data.bidIncrement) : '',
    girlfrenBalance: data.girlfrenBalance?.toString() ?? '',
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed?.toString() ?? '',
    tokenId: tokenId,
    inProgress: inProgress,
    bids: bids
  } : null;
  
  return { auctionData: formattedData, error, isLoading };
};

/**
 * @description Helper function to fetch data from the server
 */
const fetchCurrentTokenId = async (): Promise<TokenData> => {
  const endpoint = `${import.meta.env.VITE_SERVER_URL}/auction/current-token`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Network response was not ok, status: ${response.status}`);
  }
  const data = await response.json() as TokenData;
  return data;
};

const fetchBids = async (tokenId: number): Promise<{ bids: Bid[] }> => {
  const bidsResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/auction/bids/tokenId/${tokenId}`);
  if (!bidsResponse.ok) {
    throw new Error(`HTTP error! status: ${bidsResponse.status}`);
  }
  const bidsData = await bidsResponse.json() as { bids: Bid[] };
  return bidsData;
};

/**
 * @description If the auction is not in progress, then it will show the highest bid of the last auction.
 * Therefore, lets show reserve price when auction is not in progress
 * @param {bn} amount 
 * @param {boolean} inProgress 
 * @param {bn} reservePrice 
 * @returns Reserve price if auction hasn't started or highest bid amount if auction is in progress
 */
const getHighestBid = (amount: string, inProgress: boolean, reservePrice: string): string => {
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
const formatDate = (timestamp: number): string => {
  if (!timestamp) {
    return "0"; // Return null if timestamp is not valid
  }

  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric' as const, // 'as const' ensures that TypeScript treats this as a literal type
    month: 'long' as const,
    day: 'numeric' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
    timeZoneName: 'short' as const
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  return formattedDate;
};

/**
 * 
 * @param {bn} bn Value in WEI 
 * @returns Wei value converted to ether as a string
 */
// Update the formatEther function signature if it should accept string.
const formatEther = (value: string | bigint): string => {
  const bigintValue = typeof value === 'string' ? BigInt(value) : value;
  return formatUnits(bigintValue, 18);
};


export default useAuctionData;
