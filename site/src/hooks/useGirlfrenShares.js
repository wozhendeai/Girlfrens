import { useWriteContract, useReadContract } from 'wagmi';
import { GirlfrenNFTABI, config } from '../contractConfig';
import { blastSepolia } from 'viem/chains';

export const useGirlfrenShares = (tokenId) => {
  const { data: shares, isLoading: isLoadingShares, isError: sharesError } = useReadContract({
    address: config.girlfrenNFT,
    abi: GirlfrenNFTABI.abi,
    functionName: 'getGirlfrenShares',
    args: [tokenId],
  });

  // TODO: Handle errors / loading / etc
  const { writeContract } = useWriteContract();

  const redeemGirlfren = async (tokenId) => {        

      return writeContract({
          address: config.girlfrenNFT,
          abi: GirlfrenNFTABI.abi,
          chainId: blastSepolia.id,
          functionName: 'redeemGirlfren',
          args: [tokenId],
      });
  };

  return { shares, isLoadingShares, sharesError, redeemGirlfren };
};
