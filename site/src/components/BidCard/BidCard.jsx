import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

const BidCard = ({ bid }) => {
    return (
        <Card className="mb-3" style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>Bid #{bid.id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Token ID: {bid.tokenId}</Card.Subtitle>
                <Card.Text>
                    Amount: {bid.amount} ETH
                    <br />
                    Status: {bid.isSuccessful ? 'Successful' : 'Pending/Outbid'}
                    <br />
                    Start Time: {bid.startTime}
                    <br />
                    End Time: {bid.endTime}
                </Card.Text>
                {bid.isSuccessful && (
                    <Button variant="success" disabled>
                        Winning Bid
                    </Button>
                )}
                {!bid.isSuccessful && (
                    <Button variant="warning" disabled>
                        Outbid
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

BidCard.propTypes = {
    bid: PropTypes.shape({
        id: PropTypes.number.isRequired,
        tokenId: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        isSuccessful: PropTypes.bool.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
    }).isRequired,
};

export default BidCard