import { useReadContract } from 'wagmi';
import { abi, config } from '../contractConfig';
import { blastSepolia } from 'viem/chains';

const useAuctionData = () => {
  const { data, error, isLoading } = useReadContract({
    address: config.girlfrenAuction,
    abi: abi.abi,
    chainId: blastSepolia.id,
  });

  console.log(data)

  // Transform the raw data into a more friendly format
  const formattedData = data ? {
    bidder: data.bidder,
    amount: data.amount.toString(),
    withdrawable: data.withdrawable.toString(),
    // Incase the first auction hasn't started yet:
    startTime: data.startTime !== 0 ? new Date(data.startTime * 1000).toISOString() : null,
    endTime: data.endTime !== 0 ? new Date(data.endTime * 1000).toISOString() : null,
    girlfrenId: data.girlfrenId,
    settled: data.settled,
    reservePercentage: data.reservePercentage,
    girlfrensNFT: data.girlfrensNFT,
    reservePrice: data.reservePrice.toString(),
    bidIncrement: data.bidIncrement.toString(),
    duration: data.duration,
    timeBuffer: data.timeBuffer,
    girlfrenBalance: data.girlfrenBalance.toString(),
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed.toString(),
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

export default useAuctionData;
