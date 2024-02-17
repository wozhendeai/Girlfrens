// CustomNavbar.jsx
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';

// Import the specific icons from your chosen library
import { FaTwitter } from 'react-icons/fa';
import { GiBowTieRibbon } from "react-icons/gi";

function CustomNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="Navbar">
      <Container>
        <Navbar.Brand as={Link} to="/"><GiBowTieRibbon />{" "}Girlfrens</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/auction">CURRENT AUCTION</Nav.Link>
            <Nav.Link as={Link} to="/manage">MANAGE</Nav.Link>
            <Nav.Link as={Link} to="/about">ABOUT US</Nav.Link>
          </Nav>
          <div className="icons-container">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="icon-twitter">
              <FaTwitter />
            </a>
            <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="icon-etherscan">
              <FaTwitter />
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
