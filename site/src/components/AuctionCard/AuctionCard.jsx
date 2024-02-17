import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import ImageOne from "/Carousel/1.svg";
import './AuctionCard.css';

// TODO: Take token ID and get info about it
// eslint-disable-next-line react/prop-types
function AuctionCard({ tokenId }) {

    // Current token id being bid on

    // Current auction end date [excluding possible time buffer]
    // TODO: Grab from contract
    const [endDate, ] = useState("25 January");

    return (
        <Card className="past-auction-card" style={{ backgroundColor: "transparent", borderColor: "#5bc488" }}>
            <div className="auction-image-container">
                <Card.Img variant="top" src={ImageOne} />
            </div>
            <Card.Body>
            <div className="bid-status-container">
                <Card.Text>
                  <span style={{ color: "white" }}>STATUS:</span><span style={{color: "#bfbb32"}}> ENDED {endDate}</span>
                </Card.Text>
                <Button className="bid-now-button">0.2 ETH</Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default AuctionCard;
