const Wallet = require('../lib/wallet').Wallet;

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
    const w = new Wallet();

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

describe("HD Wallet", () => {
    const PASSPHRASE = 'correct horse battery staple';
    const wallets = [{
        secret: '333534663035376663333732343763326536313664613038663635666661346130b4481984b1df116434a344be6f085c6397ff9e74f4468f8a8532df5a30d440',
        address: '30b4481984b1df116434a344be6f085c6397ff9e74f4468f8a8532df5a30d440'
    }, {
        secret: '356539666464633831336463313637346532336534633632363734343830383421764251a280075e5dc75352a25189c38c3009b58908362ad3f07cd7ec2a861d',
        address: '21764251a280075e5dc75352a25189c38c3009b58908362ad3f07cd7ec2a861d'
    }, {
        secret: '6537633562386530396264633034376632333631306632353635626164303330156c5c87ceab70ab57542f90bee316d55302f02a6aa4e43e96d14c3744dc3774',
        address: '156c5c87ceab70ab57542f90bee316d55302f02a6aa4e43e96d14c3744dc3774'
    }, {
        secret: '62373662333736653261643839323966616564333431393732343430666335372bb860a26c6218a9d30955968d29fa283b49592fd69feb33805f3ac5f04f44af',
        address: '2bb860a26c6218a9d30955968d29fa283b49592fd69feb33805f3ac5f04f44af'
    }, {
        secret: '3031303032313964616163313933363463656534613334323933376565343362cdfc95507357cf55033b6390582fd397eb3f82b8c1b45ce386e256e1b2b0df9c',
        address: 'cdfc95507357cf55033b6390582fd397eb3f82b8c1b45ce386e256e1b2b0df9c'
    }, {
        secret: '3562363834346437623831323164623365323064613135313838656439373661f6a845e9caa7f244e34cf23ad0b0a82f925c46a99ab448a95fbc95193cc2d89c',
        address: 'f6a845e9caa7f244e34cf23ad0b0a82f925c46a99ab448a95fbc95193cc2d89c'
    }, {
        secret: '65336139376338633534376133383739613039653032663266336137646165328483a4a0c0bf9335bf14b01287685f057818a51c818bbf349aaf232d1dc1d904',
        address: '8483a4a0c0bf9335bf14b01287685f057818a51c818bbf349aaf232d1dc1d904'
    }, {
        secret: '6462313535323237323436336435363834623065633861316336363034633133771d69bd8d023e3253a2b457397df2fde2f73784de118072343d3659c8f06148',
        address: '771d69bd8d023e3253a2b457397df2fde2f73784de118072343d3659c8f06148'
    }, {
        secret: '6335373561343035623432346162323561326433316330393130313933633438b427645505085eb914029c343e6f8ac514e85ad8bed9dd3a1cc288444d7c57fc',
        address: 'b427645505085eb914029c343e6f8ac514e85ad8bed9dd3a1cc288444d7c57fc'
    }, {
        secret: '346466316230333266653130313064636330636438633336373231306239663186997d495cee7aa835d146cd1db8fa2884e5d90ac558a863dcb36bd32000432f',
        address: '86997d495cee7aa835d146cd1db8fa2884e5d90ac558a863dcb36bd32000432f'
    }
    ];
    let wallet = Wallet.HDWallet(PASSPHRASE);
    it('can be generated from a passphrase', () => {
        expect(wallet.address)
            .toBe(wallets[0].address);
        expect(wallet.secret)
            .toBe(wallets[0].secret);
    });
    for (let i = 0; i < 10; i += 1) {
        let wallet = Wallet.HDWallet(PASSPHRASE, i);
        it('can be generated from a passphrase for a specified index', () => {
            expect(wallet.address)
                .toBe(wallets[i].address);
            expect(wallet.secret)
                .toBe(wallets[i].secret);
        });
    }
});