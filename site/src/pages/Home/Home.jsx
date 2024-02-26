// Home.jsx
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import ImageOne from "/Carousel/1.svg";
import "./Home.css";
import AuctionCard from "../../components/AuctionCard/AuctionCard";

function Home() {
  return (
    <Container fluid className="home-container">
      <Row className="content-container">
        {/* Left side of the page, 'current auction' */}
        <Col lg={4} md={6} className="current-auction-container">
          <Card className="current-auction-card" style={{ backgroundColor: "transparent", borderColor: "#5bc488" }}>
            <h4 style={{ textAlign: "right", color: "white", padding: "10px" }}>Current Auction</h4>
            <Card.Img variant="top" src={ImageOne} />
            <Card.Body>
              <div className="bid-status-container">
                <Card.Text>
                  <span style={{ color: "white" }}>STATUS: </span><span className="live-status">LIVE</span>
                </Card.Text>
                <Button className="bid-now-button">BID NOW</Button>
              </div>
            </Card.Body>
          </Card>
          <p className="auction-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry...
          </p>
        </Col>

        {/* Right side of the page, 'past auctions' */}
        <Col lg={8} md={6} className="past-auction-container">
          <Row>
            {[...Array(6)].map((_, index) => (
              <Col md={4} key={index} className="mb-3">
                <AuctionCard />
              </Col>

            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
