import { Button, Form, InputGroup } from "react-bootstrap"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import {abi, address} from "../../contractConfig.js";

// CSS
import "./AuctionBidButton.css";

function AuctionBidButton() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    async function handleOnClick(e) {
        e.preventDefault()
        writeContract({
            address: address,
            abi: abi,
            functionName: 'createBid',
            args: [ 1 ], // TODO: Fetch latest tokenId
        })
    }

    return (<>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder={"Enter bid".toUpperCase()}
                aria-label="Enter bid"
                aria-describedby="basic-addon2"
                disabled={isPending}
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={handleOnClick}>
                Place Bid
            </Button>
        </InputGroup>
        {/* TODO: Use notifications instead */}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
            <div>Error: {(error).shortMessage || error.message}</div>
        )}
    </>
    )
}

export default AuctionBidButton