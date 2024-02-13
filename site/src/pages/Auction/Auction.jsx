import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
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
        {/* Auction image */}
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
          {/* Auction details */}
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
                      <Badge bg="primary">{auctionData && auctionData.bids.length} Bids</Badge>
                    </>
                  )}
                </span>
              </div>
              <div className='line' />
              <ConnectWalletOrBid />
            </Card.Body>
          </Card>
          {/* Bid table */}
          <Card className="flex-grow-1 bid-history-card">
            <Card.Body className="bid-history-body">
              <Card.Title>Bid History</Card.Title>
              {/* Add a div with 'bid-history-table' class to contain the table */}
              <div className="bid-history-table">
                {isLoading ? (
                  <div>Loading bids...</div>
                ) : (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Amount (ETH)</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auctionData.bids && auctionData.bids.map((bid, index) => (
                        <tr key={index}>
                          <td>
                            {formatAddress(bid.bidder)}
                          </td>
                          <td>
                            {bid.amount}
                          </td>
                          <td>
                            <a href={"https://testnet.blastscan.io/tx/" + bid.txHash}>
                              {new Date(bid.timestamp).toLocaleDateString() + " " + new Date(bid.timestamp).toLocaleTimeString()}
                            </a>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
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

const formatAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4, address.length);
}

export default Auction;
