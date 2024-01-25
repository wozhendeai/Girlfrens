import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import ImageThree from "/Carousel/3.svg";
import './Auction.css';

function Auction() {
  return (
    <Container className="auction-container">
      <Row>
        <Col lg={6} className="mb-4 image-col">
          <Card className="border-0">
            <Card.Img src={ImageThree} alt="Auction Item" className="img-fluid" />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>RJ Barrett New York Knicks 2023-2024 Game Worn Statement Edition Jersey</Card.Title>
              <Badge bg="success" className="mb-3">No reserve</Badge>
              <div className="lot-details" style={{ margin: "5px" }}>
                <span>Lot closes</span> <br />
                <span>20:48:51 • January 25, 02:02 PM EST</span>
              </div>
              <div className='line' />
              <div className="auction-estimate mb-2" style={{ margin: "5px" }}>
                <span>Estimate</span><br />
                <span>2,000 - 5,000 USD</span>
              </div>
              <div className='line' />

              <div className="current-bid mb-2" style={{ margin: "5px" }}>
                <span>Current Bid</span> <br />
                <span> 1,000 USD <Badge bg="secondary">12 Bids</Badge></span>
              </div>
              <div className='line' />
              <Button variant="primary" size="lg">Register to Bid</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Auction;
