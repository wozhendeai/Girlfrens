import HomeCarousel from './components/Navbar/Carousel/HomeCarousel'
import CustomNavbar from './components/Navbar/Navbar'
import SecondaryNavbar from './components/Navbar/SecondaryNavbar'
import "./App.css";

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
        <h2>Live Auction</h2>
      </div>

      {/* Footer */}
    </>
  )
}

export default App
