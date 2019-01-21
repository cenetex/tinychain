
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

    decode(data) {
        const arr = forge.util.decode64(data).split(',');
        this.source = arr[0];
        this.destination = arr[1];
        this.amount = arr[2]
        this.signature = arr[3];
        if(this.verify !== true) {
            throw new Error("Invalid transaction.");
        }
    }

    encode() {
        return forge.util.encode64([this.source, this.destination, this.amount, this.signature].join(','));
    }

    sign(key) {
        this.signature = ED25519.sign({
            message: [this.source, this.destination, this.amount].join(','),
            // also accepts `binary` if you want to pass a binary string
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, binary string
            privateKey: Buffer.from(key, "hex")
        }).toString('hex');
    }
    verify() {
        // verify a signature on a UTF-8 message
        return ED25519.verify({
            message: [this.source, this.destination, this.amount].join(','),
            encoding: 'utf8',
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            signature: this.data.source,
            // node.js Buffer, Uint8Array, forge ByteBuffer, or binary string
            publicKey: Buffer.from(this.data.source, "hex")
        });
    }
}

exports.Transaction = Transaction;
