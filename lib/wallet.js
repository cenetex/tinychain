const cryptography = require('./cryptography'),
    MD5 = cryptography.MD5,
    ED25519 = cryptography.ED25519,
    encode64 = cryptography.encode64;

// A Wallet is used to CREATE and SIGN transactions
const Transaction = require('./transaction').Transaction;

/**
 * Wallet is an address and secret
 */
class Wallet {
    constructor(address, secret) {
        // generate a random ED25519 keypair
        let keypair = ED25519.generateKeyPair();
        //Override these to load a wallet, see index.js
        this.secret = keypair.privateKey.toString('hex');
        this.address = keypair.publicKey.toString('hex');

        if(address && secret) {
            this.secret = secret;
            this.address = address;
        }
    }

    static HDWallet(passphrase, index) {
        let seed = MD5(encode64(passphrase + (index || 0)));
        let keypair = ED25519.generateKeyPair({ seed: seed });
        return new Wallet(
            keypair.publicKey.toString('hex'),
            keypair.privateKey.toString('hex')
        );
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
};
