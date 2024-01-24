import HomeCarousel from './components/Carousel/HomeCarousel'
import CustomNavbar from './components/Navbar/Navbar'
import SecondaryNavbar from './components/Navbar/SecondaryNavbar'
import "./App.css";
import AuctionCard from './components/AuctionCard/AuctionCard';
import MainFooter from './components/Footers/MainFooter';
import FollowUsFooter from './components/Footers/FollowUsFooter';

function App() {

  return (
    <>
      {/* Secondary Navbar */}
      <SecondaryNavbar />
      {/* Main Navbar */}
      <CustomNavbar />

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

export default App
