import { useWriteContract } from 'wagmi';
import { abi, config } from '../contractConfig'; // Ensure paths are correct
import { blastSepolia } from 'viem/chains'; // Ensure paths are correct

const useBidOnAuction = () => {
    const { writeContract, data, error, isLoading } = useWriteContract();

    const bid = async (tokenId, bidAmount) => {        

        return writeContract({
            address: config.girlfrenAuction,
            abi: abi.abi,
            chainId: blastSepolia.id,
            functionName: 'createBid',
            args: [tokenId],
            value: bidAmount
        });
    };

    return { bid, transaction: data, error, isBidding: isLoading };
};

export default useBidOnAuction;
