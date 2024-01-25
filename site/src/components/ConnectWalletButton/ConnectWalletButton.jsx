import Button from 'react-bootstrap/Button';
import { useConnect } from 'wagmi'

// eslint-disable-next-line react/prop-types
function ConnectWalletButton({ variant, size, text }) {
  const { connect, connectors } = useConnect();
  let connector = connectors[0];

  return (
    <Button
      variant={variant}
      size={size}
      onClick={
        () => connect({ connector })
      }>
      {text}
    </Button>
  )
}

export default ConnectWalletButton