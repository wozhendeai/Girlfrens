import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import ConnectWalletButton from '../../components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';

// Images
import ImageThree from "/Carousel/3.svg";

// CSS
import './Auction.css';
import AuctionBidButton from '../../components/AuctionBidButton/AuctionBidButton';

function Auction() {
  return (
    <Container className="auction-container">
      <Row>
        {/* NFT image */}
        <Col lg={6} className="mb-4 image-col">
          <Card className="border-0">
            <Card.Img src={ImageThree} alt="Auction Item" className="img-fluid" />
          </Card>
        </Col>
        {/* Auction data/input */}
        <Col md={6}>
          <Card>
            <Card.Body>
              {/* NFT info */}
              <Card.Title>RJ Barrett New York Knicks 2023-2024 Game Worn Statement Edition Jersey</Card.Title>

              <Badge bg="success" className="mb-3">No reserve</Badge>

              {/* Show auction end date */}
              <div className="lot-details" style={{ margin: "5px" }}>
                <span>Lot closes</span> <br />
                <span>20:48:51 • January 25, 02:02 PM EST</span>
              </div>

              <div className='line' />
              
              {/* Show reserve price and highest accepted bid */}
              <div className="auction-estimate mb-2" style={{ margin: "5px" }}>
                <span>Estimate</span><br />
                <span>2,000 - 5,000 USD</span>
              </div>
              <div className='line' />

              {/* Bid data */}
              <div className="current-bid mb-2" style={{ margin: "5px" }}>
                <span>Current Bid</span> <br />
                <span> 1,000 USD <Badge bg="secondary">12 Bids</Badge></span>
              </div>

              <div className='line' />

              {/* Show bid button or connect wallet button */}
              <ConnectWalletOrBid />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


function ConnectWalletOrBid() {
  const { isConnected } = useAccount()

  if (isConnected) {
    return (
      <AuctionBidButton />
    )
  }

  return <ConnectWalletButton variant="primary" size="lg" text={"CONNECT WALLET TO BID"} />;
}

export default Auction;
