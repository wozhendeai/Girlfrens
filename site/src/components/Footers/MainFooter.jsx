import { Container, Row, Col, Nav } from 'react-bootstrap';
import './MainFooter.css'; // Ensure you have a corresponding CSS file

function MainFooter() {
  return (
    <footer className="main-footer">
      <Container>
        <Row>
          <Col xs={6} md={4}>
            <h5>SUPPORT</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Help Center</Nav.Link>
            </Nav>
          </Col>
          <Col xs={6} md={4}>
            <h5>CORPORATE</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Press</Nav.Link>
              <Nav.Link href="#">Privacy Policy</Nav.Link>
              <Nav.Link href="#">Corporate Governance</Nav.Link>
              <Nav.Link href="#">Careers</Nav.Link>
            </Nav>
          </Col>
          <Col xs={6} md={4}>
            <h5>MORE...</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Terms and Conditions</Nav.Link>
              <Nav.Link href="#">Modern Slavery Statement</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default MainFooter;
