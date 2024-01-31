import HomeCarousel from '../../components/Carousel/HomeCarousel'
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import MainFooter from '../../components/Footers/MainFooter';
import FollowUsFooter from '../../components/Footers/FollowUsFooter';
import "./Home.css";

function Home() {

  return (
    <>
      {/* Carousel Component */}
      <HomeCarousel />

      {/* Live Auction Header */}
      <div className="live-auction-header-container">
        <h2>Current Auction</h2>
      </div>
      {/* Current Auction Card */}
      <AuctionCard />
      
      {/* Footer */}
      <FollowUsFooter />
      <MainFooter />
    </>
  )
}

export default Home
