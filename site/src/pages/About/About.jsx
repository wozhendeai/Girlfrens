// About.jsx
import { Container, Row, Col } from 'react-bootstrap';
import AnimeGirlSVG from './AnimeGirlSVG.svg'; // Assume this is the SVG component of the anime girl
import './About.css'; // Make sure to create an About.css file for styling
import AuctionCard from '../../components/AuctionCard/AuctionCard';

function About() {
  return (
    <Container fluid className="about-container">
      <Row>
        <Col md={4} className="about-image-container">
          <img src={AnimeGirlSVG} />
        </Col>
        <Col md={8} className="about-content-container">
          <h2>ABOUT US</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam...
          </p>
          <h2>HOW DOES IT WORK</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam...
          </p>
          <h2>CONTACT US</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam...
          </p>
        </Col>
      </Row>
      <Row className="about-auction-cards-container">
            {[...Array(6)].map((_, index) => (
              <Col md={4} key={index} className="mb-3">
          <img src={AnimeGirlSVG} />
              </Col>

            ))}
      </Row>
    </Container>
  );
}

export default About;
