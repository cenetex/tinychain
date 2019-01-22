const validator = require('../lib/validator');

describe("Blockchain", () => {
    const Blockchain = require('../lib/blockchain').Blockchain;
    const REWARD_ADDRESS = '30b4481984b1df116434a344be6f085c6397ff9e74f4468f8a8532df5a30d440';
    
    const chain = new Blockchain();
    for (let i = 0; i < 1; i += 1) {
        chain.mine(REWARD_ADDRESS);
    }
    it('complies with the schema', () => {
        validator.test(chain);
    });
});