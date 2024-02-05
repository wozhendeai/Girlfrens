const express = require('express');
const cron = require('node-cron');

// Routes
const checkMissedBids = require('./backgroundTasks/checkMissedBids');
const contractRoutes = require('./routes/contractRoutes.js');
const auctionRoutes = require('./routes/auctionRoutes.js');
const setupEventListeners = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Set up blockchain event listeners
setupEventListeners()
  .then(() => console.log('Event listeners are set up.'))
  .catch((error) => console.error('Error setting up event listeners:', error));

// Ensure server did not miss any bids
cron.schedule('*/30 * * * *', () => {
  console.log('Checking for missed bids...');
  checkMissedBids()
    .catch(err => console.error('Check for missed bids failed:', err));
});

// Use the contracts router for all requests to /contracts
app.use('/contracts', contractRoutes);

// Use the auction router for all requests to /auction
app.use('/auction', auctionRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});