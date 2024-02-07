# Features

- get current token id to bid on
  - if auction not started at all yet: 0
  - if auction in progress: current token id returned by auction data
  - if auction is over: next token id returned by auction data

- read/update currently deployed contract addresses

- track & store bids for each NFT in a database