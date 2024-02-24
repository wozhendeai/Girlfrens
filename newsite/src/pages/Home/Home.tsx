import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, CardActions } from "@mui/material";
import "./Home.css";

type AuctionData = {
    image: string;
    title: string;
}

function App() {
    const auctionItems: AuctionData[] = [
        { image: "/public/vite.svg", title: "Girlfren #1" },
        { image: "/public/vite.svg", title: "Girlfren #1" },
        { image: "/public/vite.svg", title: "Girlfren #1" },
        { image: "/public/vite.svg", title: "Girlfren #1" },
        { image: "/public/vite.svg", title: "Girlfren #1" },
        { image: "/public/vite.svg", title: "Girlfren #1" },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={5} lg={4}>

                    {/* Current Auction */}
                    <Card raised sx={{ mb: 5, pl: 2, pr: 2, backgroundColor: "transparent" }} className="live-auction-card">
                        <CardContent sx={{ backgroundColor: "transparent" }}>
                            <Typography sx={{ fontSize: 16, textAlign: "right" }} color="#85e1a4" gutterBottom>
                                LIVE AUCTION
                            </Typography>
                        </CardContent>
                        <CardMedia
                            component="img"
                            image="/public/vite.svg" // replace with your live auction image
                            alt="Live auction item"
                            sx={{ objectFit: 'contain', minHeight: 300 }}
                        />
<Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
}}>
    <Typography sx={{ fontSize: 14, color: "white" }} gutterBottom>
        STATUS: Ended
    </Typography>
    <Button
        size="large"
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
            width: 'fit-content'
        }}
    >
        Bid Now
    </Button>
</Box>
                    </Card>
                    <Typography sx={{ fontSize: 14, textAlign: "center", color: "white" }} color="text.secondary" gutterBottom>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={7} lg={8} container spacing={2}>
                    {/* Nested grid for past auctions */}
                    {auctionItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card raised sx={{ minHeight: 300 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14, textAlign: "right" }} color="text.secondary" gutterBottom>
                                        PAST AUCTION
                                    </Typography>
                                </CardContent>
                                <CardMedia
                                    component="img"
                                    image="/public/vite.svg"
                                    alt="Live auction item"
                                    sx={{ objectFit: 'contain', maxHeight: 300 }}
                                />
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                            STATUS: Ended
                                        </Typography>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                            SOLD FOR: 0 ETH
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Container>
    )
}

export default App
