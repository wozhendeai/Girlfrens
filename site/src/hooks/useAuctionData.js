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
    bidder: data.bidder,
    amount: formatEther(data.amount),
    withdrawable: formatEther(data.withdrawable),
    // Incase the first auction hasn't started yet:
    startTime: data.startTime !== 0 ? data.startTime : null,
    endTime: data.endTime !== 0 ? data.endTime : null,
    girlfrenId: data.girlfrenId,
    settled: data.settled,
    reservePercentage: data.reservePercentage,
    girlfrensNFT: data.girlfrensNFT,
    reservePrice: formatEther(data.reservePrice),
    bidIncrement: formatEther(data.bidIncrement),
    duration: data.duration,
    timeBuffer: data.timeBuffer,
    girlfrenBalance: data.girlfrenBalance.toString(),
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed.toString(),
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

const formatEther = (bn) => {
  return formatUnits(bn, 18);
}

export default useAuctionData;
