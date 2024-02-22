import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function Auction() {

    const [bidAmount, setBidAmount] = useState(0);

    // Handle the change in bid amount
    const handleBidChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // Parse the input value as a float and add 0.1 ETH or set to the current value if parsing fails
        const newBid = parseFloat(event.target.value);
        setBidAmount(newBid || bidAmount);
    };

    const bids = [
        { id: 1, amount: "0.2", bidder: "0x123...", time: "2022-07-24T12:00:00.000Z" },
        { id: 2, amount: "0.3", bidder: "0x456...", time: "2022-07-24T13:00:00.000Z" },
        // Add more bids as needed
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={15}>
                {/* Current Auction */}
                <Grid item xs={12} md={5} lg={4}>
                    <Card raised sx={{ mb: 5, }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14, textAlign: "right" }} color="text.secondary" gutterBottom>
                                CURRENT AUCTION
                            </Typography>
                        </CardContent>
                        <CardMedia
                            component="img"
                            image="/public/vite.svg" // replace with your live auction image
                            alt="Live auction item"
                            sx={{ objectFit: 'contain', minHeight: 300 }}
                        />
                    </Card>
                    <Typography sx={{ fontSize: 14, textAlign: "center", color: "white" }} color="text.secondary" gutterBottom>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Typography>
                </Grid>

                {/* Auction Data & Bid History */}
                <Grid item xs={12}  lg={8} container spacing={4}>
                    <Grid item xs={12} >
                        {/* Auction Data */}
                        <Card raised sx={{ mb: 5 }}>
                            <CardContent>
                                {/* Token ID */}
                                <Typography variant='h5' gutterBottom>
                                    Girlfren #1
                                </Typography>

                                {/* End Date */}
                                <Typography variant="h6" component="div">Lot closes</Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">{new Date(0).toISOString()}</Typography>

                                {/* Estimate */}
                                <Typography variant="h6" component="div">Estimate</Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">0.1 ETH - 1 ETH</Typography>

                                {/* Current highest bid */}
                                <Typography variant="h6" component="div">Current Bid</Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">0.1 ETH</Typography>

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
                                    sx={{ width: '25%', my: 2 }} // Set the width to 25%
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                // Add your bid submission logic here
                                >
                                    Place Bid
                                </Button>

                            </CardContent>

                        </Card>
                        
                        {/* Bid History */}
                        <TableContainer component={Paper} elevation={3}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bid Amount</TableCell>
                                        <TableCell align="right">Bidder</TableCell>
                                        <TableCell align="right">Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bids.map((bid) => (
                                        <TableRow
                                            key={bid.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {bid.amount} ETH
                                            </TableCell>
                                            <TableCell align="right">{bid.bidder}</TableCell>
                                            <TableCell align="right">{new Date(bid.time).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Auction