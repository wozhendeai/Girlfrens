// FollowUsFooter.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import './FollowUsFooter.css';

function FollowUsFooter() {
  return (
    <div className="follow-us-footer">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <div className="follow-us-content">
              <span className="follow-us-text">Follow Us</span>
              <a href="https://twitter.com" className="social-icon"><FaTwitter /></a>
              <a href="https://facebook.com" className="social-icon"><FaFacebookF /></a>
              <a href="https://instagram.com" className="social-icon"><FaInstagram /></a>
              <a href="https://youtube.com" className="social-icon"><FaYoutube /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FollowUsFooter;
