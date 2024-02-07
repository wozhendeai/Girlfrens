import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import ConnectWalletButton from '../../components/ConnectWalletButton/ConnectWalletButton';
import AuctionLoading from './AuctionLoading';

// Images
import Blank from "/Carousel/Blank.svg";
import ImageThree from "/Carousel/3.svg";

// CSS
import './Auction.css';
import AuctionBidButton from '../../components/AuctionBidButton/AuctionBidButton';

// Hooks
import useAuctionData from '../../hooks/useAuctionData';
import { useAccount } from 'wagmi';

function Auction() {
  const { auctionData, isLoading } = useAuctionData();

  if (isLoading) return <AuctionLoading />;

  return (
    <Container className="auction-container">
      <Row>
        <Col lg={6} className="mb-4 image-col">
          <Card className="border-0">
            {!auctionData.inProgress ? (
              <Card.Img src={Blank} alt="Auction Item" className="img-fluid" />
            ) : (
              <Card.Img src={ImageThree} alt="Auction Item" className="img-fluid" />
            )}
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Girlfren ID #{auctionData.tokenId || '-1'}</Card.Title>
              <div className="lot-details" style={{ margin: "5px" }}>
                <span>Lot closes</span> <br />
                {!auctionData.inProgress ? (
                  // TODO: Handle end of auction
                  <span><i>Auction {`hasn't`} started yet.</i></span>
                ) : (
                  <span>{auctionData?.endTime}</span> // endTime is already formatted
                )}
              </div>
              <div className='line' />
              <div className="auction-estimate mb-2" style={{ margin: "5px" }}>
                <span>Estimate</span><br />
                <span>{`${auctionData?.reservePrice || '0.1'} - 1 ETH`}</span>
              </div>
              <div className='line' />
              <div className="current-bid mb-2" style={{ margin: "5px" }}>
                <span>Current Bid</span> <br />
                <span>
                  {!auctionData.inProgress ? (
                    // TODO: Handle end of auction
                    <span><i>Auction {`hasn't`} started yet. Bid now to start the auction for the next token</i></span>
                  ) : (
                    <>
                      <span>{auctionData?.amount}</span>
                      {/* TODO: Get number of actual bids from server */}
                      <Badge bg="primary">12 Bids</Badge>
                    </>
                  )}
                </span>
              </div>
              <div className='line' />
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
