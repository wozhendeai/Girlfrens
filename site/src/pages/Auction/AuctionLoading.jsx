import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import Placeholder from 'react-bootstrap/Placeholder';

function AuctionLoading() {
    return (
        <Container className="auction-container">
            <Row>
                {/* Placeholder for NFT image */}
                <Col lg={6} className="mb-4 image-col">
                    <Card className="border-0">
                        <Card.Img variant="top" src="holder.js/100px180" />
                    </Card>
                </Col>
                {/* Placeholder for Auction data/input */}
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            {/* Placeholder for NFT info */}
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder as={Badge} bg="success" className="mb-3" animation="glow">
                                <Placeholder xs={4} />
                            </Placeholder>

                            {/* Placeholder for auction end date */}
                            <Placeholder as="div" className="lot-details" style={{ margin: "5px" }} animation="glow">
                                <Placeholder xs={7} /> <br />
                            </Placeholder>

                            <div className='line' />

                            {/* Placeholder for reserve price and highest accepted bid */}
                            <Placeholder as="div" className="auction-estimate mb-2" style={{ margin: "5px" }} animation="glow">
                                <Placeholder xs={4} /> <Placeholder xs={2} />
                            </Placeholder>

                            <div className='line' />

                            {/* Placeholder for current bid */}
                            <Placeholder as="div" className="current-bid mb-2" style={{ margin: "5px" }} animation="glow">
                                <Placeholder xs={2} /> <Placeholder xs={1} />
                            </Placeholder>

                            <div className='line' />

                            {/* Placeholder for bid button or connect wallet button */}
                            <Placeholder.Button variant="primary" xs={6} animation="glow" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AuctionLoading;