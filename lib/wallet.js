// A Wallet is used to CREATE and SIGN transactions
//Use the forge crypto library.
const forge = require('node-forge');
const ED25519 = forge.pki.ed25519;
const Transaction = require('./transaction').Transaction;

/**
 * Wallet is an address and secret
 */
class Wallet {
    constructor(address, secret) {
        if (!address || !secret) {
            // generate a random ED25519 keypair
            let keypair = ED25519.generateKeyPair();
    
            //Override these to load a wallet, see index.js
            this.secret = keypair.privateKey.toString('hex');
            this.address = keypair.publicKey.toString('hex');
        }
    }

    // Creates a new signed transaction
    transaction(destination, amount) {
        let transaction = new Transaction(this.address, destination, amount);
        transaction.sign(this.secret);
        return transaction.encode();
    }
}

module.exports = {
    Wallet: Wallet
}
