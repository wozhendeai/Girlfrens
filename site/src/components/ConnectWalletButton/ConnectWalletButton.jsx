import Button from 'react-bootstrap/Button';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { blastSepolia } from '@wagmi/core/chains';

// eslint-disable-next-line react/prop-types
function ConnectWalletButton({ variant, size, text, isButton = true }) {
  const { connect, connectors } = useConnect();
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  let connector = connectors[0];

  // Handle the connection and potential chain switch
  const handleConnectAndSwitch = async () => {
    if (!isConnected) {
      connect({ connector });
    } else if (chain?.id !== blastSepolia.id && switchChain) {
      switchChain(blastSepolia.id);
    }
  };

  useEffect(() => {
    if (isConnected && chain?.id !== blastSepolia.id) {
      switchChain({chainId: blastSepolia.id});
    }
  }, [isConnected, chain, switchChain]);

  if (isButton) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleConnectAndSwitch}
      >
        {isConnected ? "CONNECTED" : text}
      </Button>
    );
  } else {
    return <span onClick={handleConnectAndSwitch}>{isConnected ? "CONNECTED" : text}</span>;
  }
}

export default ConnectWalletButton;
