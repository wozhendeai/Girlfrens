import HomeCarousel from '../../components/Carousel/HomeCarousel'
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import MainFooter from '../../components/Footers/MainFooter';
import FollowUsFooter from '../../components/Footers/FollowUsFooter';
import "./Home.css";

function Home() {
  const auctions = [
    { tokenId: 1 },
    { tokenId: 2 },
    { tokenId: 3 },
    { tokenId: 4 },
    { tokenId: 5 },
    // more auctions...
  ];

  return (
    <div className='home-container'>
      {/* Carousel Component */}
      <HomeCarousel />

      {/* Live Auction Header */}
      <div className="live-auction-header-container">
        <h2>Past Auctions</h2>
      </div>
      
      {/* Auction List */}
      <div className="auction-list-container">
        {auctions.map((auction, index) => (
          <div key={index} className="auction-card-container">
            <AuctionCard {...auction} />
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <FollowUsFooter />
      <MainFooter />
    </div>
  )
}

export default Home
