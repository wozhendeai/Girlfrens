// useBidOnAuction.js
import { useWriteContract } from 'wagmi';
import { abi, config } from '../contractConfig'; // Ensure paths are correct
import { blastSepolia } from 'viem/chains'; // Ensure paths are correct
import { parseEther } from 'viem';

const useBidOnAuction = () => {
    const { writeContract, data, error, isLoading, writeContractAsync } = useWriteContract();

    const bid = async (tokenId, bidAmount) => {
        console.log(tokenId, bidAmount)
        // Use writeContractAsync for an async/await pattern, if preferred
        return writeContract({
            address: config.girlfrenAuction,
            abi: abi.abi,
            chainId: blastSepolia.id,
            functionName: 'createBid',
            args: [0],
            value: bidAmount + parseEther('0.05')
        });
    };

    return { bid, transaction: data, error, isBidding: isLoading };
};

export default useBidOnAuction;
