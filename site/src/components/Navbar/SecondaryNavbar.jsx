// SecondaryNavbar.jsx
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './SecondaryNavbar.css'; // Make sure to include your custom CSS file
import ConnectWalletButton from '../ConnectWalletButton/ConnectWalletButton';

function SecondaryNavbar() {
    return (
        <Navbar className="secondary-navbar" expand="lg">
            <Nav className="mx-auto">
                <Nav.Link>
                    <strong>
                        <ConnectWalletButton variant="transparent" size="lg" text={"CONNECT WALLET"} isButton={false} />
                    </strong>
                </Nav.Link>
                <Nav.Link>ABOUT</Nav.Link>
                <Nav.Link>CONTACT US</Nav.Link>
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
