import { useReadContract } from 'wagmi';
import { abi, config } from '../contractConfig';
import { blastSepolia } from 'viem/chains';
import { formatUnits } from 'viem';

const useAuctionData = () => {
  const { data, error, isLoading } = useReadContract({
    address: config.girlfrenAuction,
    abi: abi.abi,
    chainId: blastSepolia.id,
    functionName: "auctionData"
  });

  // Transform the raw data into a more friendly format
  const formattedData = data ? {
    ...data,
    amount: formatEther(data.amount),
    withdrawable: formatEther(data.withdrawable),
    startTime: data.startTime !== 0 ? data.startTime : 0,
    endTime: data.endTime !== 0 ? formatDate(data.endTime) : 0, // Format endTime directly
    reservePrice: formatEther(data.reservePrice),
    bidIncrement: formatEther(data.bidIncrement),
    girlfrenBalance: data.girlfrenBalance.toString(),
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed.toString(),
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

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
