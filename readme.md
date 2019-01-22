# Blockchain Sandbox

Your very own blockchain complete with the following components:

- Wallets (public/private key pairs)
- Transactions (signed by wallets)
- Mining (mine a block of transactions and reap the rewards)
- Ephemeral Testnet (the blockchain vanishes when the node stops) 

## Quick Start

    npm install
    npm start

http://localhost:3030/index.html shows blockchain and wallet controls.

## Files

Core Files
-- index.js - central module
-- lib/blockchain.js - The blockchain functionality; add transactions to a block and try to mine it.
-- lib/fs-loader.js - Load the blockchain from the file system
-- lib/reddit-loader - Load the blockchain from reddit
-- lib/wallet.js - Wallet functionality; create wallets and sign transactions

Developer Mode
-- server.js - imports index.js and sets up a rest API for development.
-- static/* - the UI for server.js

## Architecture

### Blockchain Schema


### Blockchain Node Functions

- Load chain
- Listen for transactions
- Validate transactions
- Mine Blocks
- Save chain

### Wallet

- Wallet Generation
- Signing Transactions

## Contribution Guidelines

- The use of third party libraries is a form of technical debt and should be avoided.
- All algorithms should be transparent and clearly explained.
- Include tests for all functionality.
- Create a pull request, and discuss with the community.
- This is a new project with very few contributors and needs help in all areas.
- Visit us on reddit: www.reddit.com/

## Copyright

- MIT licensed open source created by Cenetex Inc. (www.cenetex.com)