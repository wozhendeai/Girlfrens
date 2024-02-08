import { useAccount, useReadContract } from 'wagmi';
import { GirlfrenNFTABI, config } from '../contractConfig';

const useTokensOfOwner = () => {
    const { address } = useAccount();
    const { data: tokensOfOwner, isLoading } = useReadContract({
        address: config.girlfrenNFT,
        abi: GirlfrenNFTABI.abi,
        chainId: 168587773,
        functionName: "tokensOfOwner",
        args: [address]
    });
    
    return { tokensOfOwner, isLoading };
};

export default useTokensOfOwner;
