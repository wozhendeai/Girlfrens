// SecondaryNavbar.jsx
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './SecondaryNavbar.css'; // Make sure to include your custom CSS file

function SecondaryNavbar() {
    return (
        <Navbar className="secondary-navbar" expand="lg">
            <Nav className="mx-auto">
                <Nav.Link href="#connect-wallet"><strong>CONNECT WALLET</strong></Nav.Link>
                <Nav.Link href="#about">ABOUT</Nav.Link>
                <Nav.Link href="#contact-us">CONTACT US</Nav.Link>
                <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="LANGUAGE"
                    menuVariant="dark"
                >
                    <NavDropdown.Item href="#action/3.1">中文</NavDropdown.Item>
                </NavDropdown>

            </Nav>

        </Navbar>
    );
}

export default SecondaryNavbar;
