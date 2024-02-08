import { useReadContract } from 'wagmi';
import { GirlfrenNFTABI, config } from '../contractConfig';

export const useTokenURI = (tokenId) => {
  const { data: tokenURI, isLoading: isLoadingTokenURI, isError: errorTokenURI } = useReadContract({
    address: config.girlfrenNFT,
    abi: GirlfrenNFTABI.abi,
    functionName: 'tokenURI',
    args: [Number(tokenId)],
  });
  
  return { tokenURI, isLoadingTokenURI, errorTokenURI };
};
