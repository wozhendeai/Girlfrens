const express = require('express');
const contractRoutes = require('./routes/contractRoutes.js');
const auctionRoutes = require('./routes/auctionRoutes.js');
const setupEventListeners = require('./routes/eventRoutes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Set up blockchain event listeners
setupEventListeners()
  .then(() => console.log('Event listeners are set up.'))
  .catch((error) => console.error('Error setting up event listeners:', error));

// Use the contracts router for all requests to /contracts
app.use('/contracts', contractRoutes);

// Use the auction router for all requests to /auction
app.use('/auction', auctionRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});