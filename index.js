const Blockchain = require('./lib/blockchain').Blockchain;
const Wallet = require('./lib/wallet').Wallet;
const forge = require('node-forge');

let chain = null;

module.exports = {
    create: (callback) => {
        chain = new Blockchain();
        callback(chain);
        //chain.load(callback);
    },
    wallet: {
        create: () => {
            return new Wallet();
        },
        load: (address, secret) => {
            let wallet = new Wallet();
            wallet.address = address;
            wallet.secret = secret;
            return wallet;
        }
    }
}
