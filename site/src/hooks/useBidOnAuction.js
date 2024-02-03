import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi, config } from '../contractConfig'; // Adjust the import path as necessary

const useBidOnAuction = () => {
    const { write: placeBid, data: transaction, error, isLoading: isBidding } = useWriteContract({
        addressOrName: config.girlfrenAuction,
        contractInterface: abi,
        functionName: 'createBid',
        // args will be passed dynamically in the bid function
    });

    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: transaction?.hash,
    });

    const bid = async (tokenId, bidAmount) => {
        return placeBid({ args: [tokenId, { value: bidAmount }] });
    };

    return { bid, transaction, receipt, error, isBidding, isConfirming };
};

export default useBidOnAuction;
