import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import ImageOne from "/Carousel/1.svg";
import './AuctionCard.css';

function AuctionCard() {

    // Current token id being bid on
    // TODO: Grab from contract
    const [tokenId, ] = useState(Math.floor(Math.random() * 1000));

    // Current auction end date [excluding possible time buffer]
    // TODO: Grab from contract
    const [endDate, ] = useState("25 January 2024 | 2:00 PM EST");

    return (
        <Card className="auction-card my-3">
            <div className="auction-image-container">
                <Card.Img variant="top" src={ImageOne} />
                <span className="auction-badge">LIVE</span>
            </div>
            <Card.Body>
                <Card.Title>Girlfren #{tokenId}</Card.Title>
                <Card.Text>
                     {endDate}
                </Card.Text>
                <Button variant="outline-dark" style={{paddingLeft: "50px", paddingRight: "50px"}}>BID</Button>
            </Card.Body>
        </Card>
    );
}

export default AuctionCard;
