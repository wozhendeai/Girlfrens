import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import ConnectWalletButton from '../../components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';

// Images
import Blank from "/Carousel/Blank.svg";
import ImageThree from "/Carousel/3.svg";

// CSS
import './Auction.css';
import AuctionBidButton from '../../components/AuctionBidButton/AuctionBidButton';
import useAuctionData from '../../hooks/useAuctionData';

function Auction() {
  const { auctionData, isLoading } = useAuctionData();

  // If the first auction hasn't started
  // Or if an auction has ended & the next one hasn't been created
  const auctionNotStarted = auctionData?.startTime == null;
  const reservePriceDisplay = isLoading ? 'Loading...' : `${auctionData?.reservePrice || '0.1'} - 1 ETH`;
  const currentTokenId = isLoading ? "Loading..." : `${auctionData?.girlfrenId || '0'}`;

  return (
    <Container className="auction-container">
      <Row>
        {/* NFT image */}
        <Col lg={6} className="mb-4 image-col">
          <Card className="border-0">
            {
              auctionNotStarted
                ? <Card.Img src={Blank} alt="Auction Item" className="img-fluid" />
                : <Card.Img src={ImageThree} alt="Auction Item" className="img-fluid" />
            }
          </Card>
        </Col>
        {/* Auction data/input */}
        <Col md={6}>
          <Card>
            <Card.Body>
              {/* NFT info */}
              <Card.Title>Girlfren ID #{currentTokenId}</Card.Title>

              <Badge bg="success" className="mb-3">No reserve</Badge>

              {/* Show auction end date */}
              <div className="lot-details" style={{ margin: "5px" }}>
                <span>Lot closes</span> <br />

                {
                  auctionNotStarted
                    ? <span><i>Auction hasn{`'`}t started yet. Bid now to start the auction</i></span>
                    : <span>20:48:51 • January 25, 02:02 PM EST</span>
                }

              </div>

              <div className='line' />

              {/* Show reserve price and highest accepted bid */}
              <div className="auction-estimate mb-2" style={{ margin: "5px" }}>
                <span>Estimate</span><br />
                <span>{reservePriceDisplay}   </span>
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
