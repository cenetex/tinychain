//Use the forge crypto library for independent verification.
const forge = require('node-forge');
const ED25519 = forge.pki.ed25519;
const decode64 = forge.util.decode64;

const Transaction = require('../lib/transaction').Transaction;
const TEST = {
    TRANSACTION: 'OWEyNDk2NjhjNzc4NWUwZGRiOGE3ODQxNTMxZGFiOWFmMTUwNDVjMWU5YzUyMDI5N2U4MzFmODAxY2VlNDQ5Ziw3ODNlOTk4NTg2ZTk5MzMwZjJlZjFjNTZjMDU5NTAxZGJhMThjOWU5Mjk1YTU0ZjZiMmFkNWY4ZjBmNDE1MTM2LDEwMCxjOTI1MjQ3NGExZThmYjc2YWI5MGExNTk1MmFlMGM4YjlkMmU0NDU2ZWJhZWY4N2FkM2E0OThiZDFjMWE0YTAyMmQwZGZlM2MzYzY5ODhiYWEyOTQ3Njk0OWEyZmZiYmE5NDE0M2Y4NGQ3ZDhjNDU0ZDA1N2U0MWRhNTc0ZTIwMQ==',
    WALLET_SECRET: '3340ce117f542354de8611c491630f77f2e8497d242a75c073d314b65f8d8a9c9a249668c7785e0ddb8a7841531dab9af15045c1e9c520297e831f801cee449f',
    WALLET_ADDRESS: '9a249668c7785e0ddb8a7841531dab9af15045c1e9c520297e831f801cee449f',
    DESTINATION_ADDRESS: '783e998586e99330f2ef1c56c059501dba18c9e9295a54f6b2ad5f8f0f415136',
    AMOUNT: 100,
    SIGNATURE: 'c9252474a1e8fb76ab90a15952ae0c8b9d2e4456ebaef87ad3a498bd1c1a4a022d0dfe3c3c6988baa29476949a2ffbba94143f84d7d8c454d057e41da574e201',
};

describe("A Transaction", () => {
    // Create and sign a transaction
    const transaction = new Transaction(TEST.WALLET_ADDRESS, TEST.DESTINATION_ADDRESS, TEST.AMOUNT);
    transaction.sign(TEST.WALLET_SECRET);

    it('has the expected properties', () => {
        expect(transaction.source).toEqual(TEST.WALLET_ADDRESS);
        expect(transaction.destination).toEqual(TEST.DESTINATION_ADDRESS);
        expect(transaction.amount).toEqual(TEST.AMOUNT);
    });
    it("can be signed", () => {
        expect(transaction.signature).toEqual(TEST.SIGNATURE);
    });

    it("can be encoded and decoded", () => {
        let data = transaction.encode();
        transaction.decode(data);
        expect(transaction.source).toEqual(TEST.WALLET_ADDRESS);
        expect(transaction.destination).toEqual(TEST.DESTINATION_ADDRESS);
        expect(transaction.amount).toEqual(TEST.AMOUNT);
        expect(transaction.signature).toEqual(TEST.SIGNATURE);
    });
});
