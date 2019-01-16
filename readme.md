# Blockchain Sandbox

Your very own blockchain complete with the following components:

- Wallets (public/private key pairs)
- Transactions (signed by wallets)
- Mining (mine a block of transactions and reap the rewards)
- Ephemeral Testnet (the blockchain vanishes when the node stops) 

## Architecture

Core Files
-- index.js - central module
-- lib/blockchain.js - The blockchain functionality; add transactions to a block and try to mine it.
-- lib/wallet.js - Wallet functionality; create wallets and sign transactions

Developer Mode
-- server.js - imports index.js and sets up a rest API for development.
-- static/* - the UI for server.js