import HomeCarousel from '../../components/Carousel/HomeCarousel'
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import MainFooter from '../../components/Footers/MainFooter';
import FollowUsFooter from '../../components/Footers/FollowUsFooter';
import "./Home.css";

function Home() {  
  return (
    <div className='home-container'>
      {/* Carousel Component */}
      <HomeCarousel />

      {/* Live Auction Header */}
      <div className="live-auction-header-container">
        <h2>Auctions</h2>
      </div>
      {/* Current Auction Card */}
      {/* Auction List */}
      <div className="auction-list-container">
          <div className="auction-card-container">
            <AuctionCard />
          </div>
      </div>
      
      {/* Footer */}
      <FollowUsFooter />
      <MainFooter />
    </div>
  )
}

export default Home
