import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import LiveAuctionCard from '../../components/LiveAuctionCard/LiveAuctionCard';
import useAuctionData from '../../hooks/useAuctionData';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { blastSepolia } from 'viem/chains';
import { abi, config } from '../../contractConfig';
import { parseEther } from 'viem';

function Auction() {

    const { auctionData, isLoading } = useAuctionData();
    const [bidAmount, setBidAmount] = useState(0.1);

    // Handle the change in bid amount
    const handleBidChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // Parse the input value as a float and add 0.1 ETH or set to the current value if parsing fails
        const newBid = parseFloat(event.target.value);
        setBidAmount(newBid || bidAmount);
    };
    console.log(auctionData?.bids[0].timestamp)
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={15}>
                {/* Current Auction */}
                <Grid item xs={12} md={5} lg={4}>
                    <LiveAuctionCard includeBottomButton={false} />
                    <Typography sx={{ fontSize: 14, textAlign: "center", color: "white" }} color="text.secondary" gutterBottom>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Typography>
                </Grid>

                {/* Auction Data & Bid History */}
                <Grid item xs={12} lg={8} container spacing={4}>
                    <Grid item xs={12} >
                        {/* Auction Data */}
                        <Card raised sx={{ mb: 5, backgroundColor: "transparent", color: 'white', borderColor: '#76ba96' }} style={{ borderColor: '#76ba96', borderWidth: '2px', borderStyle: 'solid' }}>
                            <CardContent>
                                {/* Token ID */}
                                <Typography variant='h5' gutterBottom>
                                    Girlfren #{auctionData?.tokenId ?? '-'}
                                </Typography>

                                {/* End Date */}
                                <Typography variant="h6" component="div">Lot closes</Typography>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic' }}>
                                    {auctionData?.inProgress
                                        ? auctionData?.endTime ?? 'Loading...'
                                        : "Auction hasn't started yet."}
                                </Typography>

                                {/* Estimate */}
                                <Typography variant="h6" component="div">Estimate</Typography>
                                <Typography sx={{ mb: 1.5 }}>
                                    {auctionData?.reservePrice ?? 'Loading...'} - 1 ETH
                                </Typography>

                                {/* Current highest bid */}
                                <Typography variant="h6" component="div">Current Bid</Typography>
                                <Typography sx={{ mb: 1.5 }}>
                                    {auctionData?.inProgress
                                        ? auctionData?.endTime ?? 'Loading...'
                                        : "Auction hasn't started yet. Bid now to begin the auction for the next token"}
                                </Typography>

                                <TextField
                                    label="Your Bid (ETH)"
                                    type="number"
                                    variant="outlined"
                                    value={bidAmount}
                                    onChange={handleBidChange}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                                        inputProps: {
                                            min: 0.1,  // Minimum bid amount
                                            step: 0.1  // Step for the number input
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'rgba(255, 255, 255, 0.7)', // Light text color for the label
                                            '&.Mui-focused': {
                                                color: '#85e1a4', // Light green color when the label is focused
                                            }
                                        }
                                    }}
                                    sx={{
                                        width: { xs: '100%', sm: '50%', md: '25%' }, // Responsive width
                                        my: 2,
                                        '.MuiOutlinedInput-input': {
                                            color: '#FFF', // Light text color for input text
                                        },
                                        '.MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.7)', // Light border color
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#85e1a4', // Light green border color on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#85e1a4', // Light green border color when the input is focused
                                            },
                                        },
                                        '.MuiInputAdornment-root': {
                                            color: 'rgba(255, 255, 255, 0.7)', // Light text color for the adornment
                                        }
                                    }}
                                />

                                <BidNowButton bidAmount={bidAmount} tokenId={auctionData?.tokenId ?? 0} />

                            </CardContent>

                        </Card>

                        {/* Bid History */}
                        <TableContainer component={Paper} elevation={3} sx={{ backgroundColor: 'transparent', color: 'white' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                        <TableCell sx={{ color: 'white' }}>Bid Amount</TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>Bidder</TableCell>
                                        <TableCell align="right" sx={{ color: 'white' }}>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : auctionData && auctionData.bids && auctionData.bids.length > 0 ? (
                                        auctionData.bids.map((bid, index) => (
                                            <TableRow
                                                key={index} // In case txHash is not unique, use index or a combination
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    },
                                                }}
                                            >
                                                <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                                                    {bid.amount} ETH
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: 'white' }}>
                                                    {bid.bidder} {/* Consider formatting the address if needed */}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: 'white' }}>
                                                    {new Date(bid.time).toISOString().slice(0,10) + " " + new Date(bid.time).toISOString().slice(11, 19)} {/* If timestamp is in seconds, multiply by 1000 */}
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ color: 'white' }}>
                                                No bids to display
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid >
        </Container >
    )
}

// Handles connect wallet -> (change network) -> bid flow
type BidNowButtonProps = {
    bidAmount: number;
    tokenId: number;
}

function BidNowButton({ bidAmount, tokenId }: BidNowButtonProps) {
    const { writeContract } = useWriteContract();
    const { isConnected, address, chain } = useAccount();
    const { switchChain } = useSwitchChain()

    const correctChainId = blastSepolia.id; // The chain ID for Blast (replace with actual chain ID)
    const handleBid = async () => {
        // If wallet is not connected, prompt user to connect
        if (!isConnected) {
            // Trigger connect wallet modal (this will be specific to your wallet connection implementation)
            // connectWallet();
            console.log("Please connect your wallet.");
            return;
        }

        // If connected to the wrong network, prompt user to switch
        if (chain?.id !== correctChainId) {
            try {
                switchChain({ chainId: correctChainId });
            } catch (error) {
                console.error("Error switching network: ", error);
                return;
            }
        }

        // If connected to the correct network, send bid
        console.log(`Sending bid of ${bidAmount} ETH from ${address}`);
        console.log(parseEther(String(bidAmount)))
        writeContract({
            address: config.girlfrenAuction,
            abi: abi.abi,
            chainId: blastSepolia.id,
            functionName: 'createBid',
            args: [tokenId],
            value: parseEther(String(bidAmount))
        });
    };



    return (
        <Button
            onClick={handleBid}
            size="large"
            fullWidth
            sx={{
                border: '1px solid #85e1a4',
                color: '#85e1a4',
                borderRadius: '20px',
                padding: '8px',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: 'rgba(133, 225, 164, 0.1)',
                    borderColor: '#85e1a4',
                },
                width: '100%',
                my: 2,
            }}
        >
            {isConnected ? (chain?.id === correctChainId ? 'Bid Now' : 'Switch to Blast') : 'Connect Wallet'}
        </Button>
    );
}

export default Auction