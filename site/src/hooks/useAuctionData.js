import { useReadContract } from 'wagmi';
import { abi, config } from '../contractConfig';

const useAuctionData = () => {
  const { data, error, isLoading } = useReadContract({
    addressOrName: config.girlfrenAuction, // GirlfrenAuction contract address
    contractInterface: abi, // ABI of the GirlfrenAuction contract
    functionName: 'auctionData',
  });

  console.log(data, error, isLoading)

  // Transform the raw data into a more friendly format
  const formattedData = data ? {
    bidder: data.bidder,
    amount: data.amount.toString(),
    withdrawable: data.withdrawable.toString(),
    startTime: new Date(data.startTime.toNumber() * 1000).toISOString(),
    endTime: new Date(data.endTime.toNumber() * 1000).toISOString(),
    girlfrenId: data.girlfrenId.toNumber(),
    settled: data.settled,
    reservePercentage: data.reservePercentage,
    girlfrensNFT: data.girlfrensNFT,
    reservePrice: data.reservePrice.toString(),
    bidIncrement: data.bidIncrement.toString(),
    duration: data.duration.toNumber(),
    timeBuffer: data.timeBuffer.toNumber(),
    girlfrenBalance: data.girlfrenBalance.toString(),
    girlfrensTotalRedeemed: data.girlfrensTotalRedeemed.toString(),
  } : null;

  return { auctionData: formattedData, error, isLoading };
};

export default useAuctionData;
