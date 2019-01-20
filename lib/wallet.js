// A Wallet is used to CREATE, SIGN, and VERIFY transactions

//Use the forge crypto library.
const forge = require('node-forge');
const ED25519 = forge.pki.ed25519;

/**
 * Transaction class
 * Extremely simple transaction class.
 */
class Transaction {
    constructor(source, destination, amount) {
        this.source = source;
        this.destination = destination;
        this.amount = amount;
    }
}

/**
 * Wallet contains most of the functionality
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
    sign(message) {
        return ED25519.sign({
            message: message,
            // also accepts `binary` if you want to pass a binary string
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, binary string
            privateKey: Buffer.from(this.secret, "hex")
        }).toString('hex');
    }
    verify(message, signature) {
        // verify a signature on a UTF-8 message
        return ED25519.verify({
            message: message,
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            signature: signature,
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            publicKey: Buffer.from(this.address, "hex")
        });
    }

    // Creates a new signed transaction
    transaction(destination, amount) {
        let transaction = new Transaction(this.address, destination, amount);
        transaction.signature = this.sign(JSON.stringify(transaction));
        return transaction;
    }
}

module.exports = {
    Wallet: Wallet
}
