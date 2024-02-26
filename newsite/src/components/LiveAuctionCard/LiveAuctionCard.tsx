import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import './LiveAuctionCard.css';

interface LiveAuctionCardProps {
    includeBottomButton: boolean;
}

// Update the component to accept props as an object
function LiveAuctionCard({ includeBottomButton }: LiveAuctionCardProps) {
    return (
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
                sx={{ objectFit: 'contain', minHeight: 300, mb:2 }}
            />
            {includeBottomButton && <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '10px'
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
            </Box>}
        </Card>

    )
}

export default LiveAuctionCard