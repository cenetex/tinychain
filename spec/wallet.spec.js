const wallet = require('../lib/wallet');

// TRANSACTION TEST VARIABLES
const WALLET_SECRET = '6d9ea861255db9af9a71d1c1e25d8188a814598a4155e9db3eb05b5a1f0f0bc85c0c6db88972803ff44405ff02d96630e5454958e10beb59940ff2b3f4931a5e';
const WALLET_ADDRESS = '5c0c6db88972803ff44405ff02d96630e5454958e10beb59940ff2b3f4931a5e';
const DESTINATION_ADDRESS = 'ef42b78e9b16c7bf37ef2b122dcde4d96ce4a428363af9777eebbc9078f9dd1c';
const AMOUNT = 100;
const SIGNATURE = '16c398cd5f8a5d2ff6d1acceb33149a69d663739d949fc3bb0af50c4ab7303dae9bf2e75d1892978b72cec8397a6614ad4a10fd1cbf6cdb823ca30d726535501';

//Use the forge crypto library for independent verification.
const forge = require('node-forge');
const ED25519 = forge.pki.ed25519;
const decode64 = forge.util.decode64;

/**
 * Jasmine Test file for wallet.js functionality.
 */
describe('Wallet', () => {
    const w = new wallet.Wallet();

    it('can be created', () => {
        expect(w).toBeDefined();
    });

    it('has an assignable address and secret key', () => {
        expect(typeof w.secret).toBe('string');
        expect(typeof w.address).toBe('string');

        w.secret = WALLET_SECRET;
        w.address = WALLET_ADDRESS;

        expect(w.secret).toBe(WALLET_SECRET);
        expect(w.address).toBe(WALLET_ADDRESS);
    });

    it('can sign transactions', () => {
        let transaction = decode64(w.transaction(DESTINATION_ADDRESS, AMOUNT)).split(',');
        ED25519.verify({
            message: [transaction[0], transaction[1], transaction[2]].join(','),
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            signature: Buffer.from(transaction[3], "hex"),
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            publicKey: Buffer.from(transaction[0], "hex")
        });
    });
});