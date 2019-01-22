//Use the forge crypto library.
const forge = require('node-forge');
const ED25519 = forge.pki.ed25519;
const decode64 = forge.util.decode64;

/**
 * Transaction class
 * Extremely simple transaction class.
 */
class Transaction {

    /**
     * Creates a new transaction based on a specified source, destination, and amount.
     * @param {String} source 
     * @param {String} destination 
     * @param {Number} amount 
     */
    constructor(source, destination, amount) {
        this.source = source;
        this.destination = destination;
        this.amount = amount;
    }
    /**
     * Decodes a 64 bit encoded array containing information about a transaction. 
     * @param {String} data encode64([source, destination, parseInt(amount), signature]);
     */
    decode(data) {
        const arr = decode64(data).split(',');
        this.source = arr[0];
        this.destination = arr[1];
        this.amount = parseInt(arr[2]);
        this.signature = arr[3];
        if(this.verify() !== true) {
            throw new Error("Invalid transaction.");
        }
    }
    /**
     * 
     */
    encode() {
        return forge.util.encode64([this.source, this.destination, this.amount, this.signature].join(','));
    }

    digest() {
        return [this.source, this.destination, this.amount].join(',');
    }

    sign(key) {
        this.signature = ED25519.sign({
            message: this.digest(),
            // also accepts `binary` if you want to pass a binary string
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, binary string
            privateKey: Buffer.from(key, "hex")
        }).toString('hex');
    }
    verify() {
        // verify a signature on a UTF-8 message
        return ED25519.verify({
            message: this.digest(),
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            signature: Buffer.from(this.signature, "hex"),
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            publicKey: Buffer.from(this.source, "hex")
        });
    }
}

exports.Transaction = Transaction;
