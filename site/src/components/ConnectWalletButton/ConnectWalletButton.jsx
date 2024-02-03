import Button from 'react-bootstrap/Button';
import { useAccount, useConnect } from 'wagmi';

// eslint-disable-next-line react/prop-types
function ConnectWalletButton({ variant, size, text, isButton = true }) { // Add isButton prop with default value true
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  let connector = connectors[0];

  if (isButton) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => connect({ connector })}
      >
        {isConnected ? "CONNECTED" : text}
      </Button>
    );
  } else {
    return <span onClick={() => connect({ connector })}>{isConnected ? "CONNECTED" : text}</span>;
  }
}

export default ConnectWalletButton;
