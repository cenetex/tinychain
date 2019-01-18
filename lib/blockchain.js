const forge = require('node-forge');

function SHA256(message) {
    var md = forge.md.sha256.create();
    md.update(message);
    return md.digest().toHex()
}
function MD5(message) {
    var md = forge.md.md5.create();
    md.update(message);
    return md.digest().toHex()
}

const loader = require('./fs-loader');

class Block {
    constructor(timestamp, data) {
        this.timestamp = timestamp || new Date().toISOString();
        this.data = forge.util.encode64(JSON.stringify(data || { data: []}));
        this.previousHash = "0";
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    static load(data) {
        var block = new Block();
        block.timestamp = data.timestamp;
        block.data = data.data;
        block.previousHash = data.previousHash;
        block.nonce = data.nonce;
        block.hash = data.hash;
        return block;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }
}

class Blockchain{
    constructor(name) {
        this.name = name;
        this.blocks = [this.createGenesis(name)];
        this.transactions = { data: [] };
        this.difficulty = 0;
    }

    save () {
        this.hash = MD5(JSON.stringify([
            this.name,
            this.blocks,
            this.transactions,
            this.difficulty
        ]));
        loader.save(this);
    }
    load (callback) {
        loader.load(data => {
            if(data.hash !== MD5(JSON.stringify([
                data.name,
                data.blocks,
                data.transactions,
                data.difficulty
            ]))) {
                throw new Error("Invalid hash.");
            }

            this.name = data.name;
            this.blocks = data.blocks.map(Block.load);
            this.transactions = data.transactions;
            this.difficulty = data.difficulty;

            if(this.checkValid() !== true) {
                throw new Error("Invalid Blockchain");
            };

            callback(this);
        });
    }

    createGenesis(name) {
        return new Block(new Date().toISOString(), { data: [] }, "0")
    }

    latestBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    addTransaction(transaction) {
        // TODO: Validate Transaction
        this.transactions.data.push(JSON.stringify(transaction));
        return true;
    }
    validateTransactions() {
        const wallets = {};

        this.blocks.forEach(block => { 
            let transactions = JSON.parse(forge.util.decode64(block.data)).data;
            transactions.forEach(T => {
                let transaction = JSON.parse(T);
                wallets[transaction.source] = (wallets[transaction.source] || 0) - parseInt(transaction.amount);
                wallets[transaction.destination] = (wallets[transaction.destination] || 0) - parseInt(transaction.amount);
            });
        });
        console.log(wallets);
    }

    mine(address){
        this.validateTransactions();
        let newBlock = new Block(new Date().toISOString(), this.transactions)
        newBlock.previousHash = this.latestBlock().hash;
        // Claim the block
        newBlock.claim = address;
        //Generate a nonce for this attempt
        newBlock.nonce = forge.util.encode64(SHA256(address + ":" + Math.random())).substr(0,16);
        //Set the difficulty
        newBlock.difficulty = this.difficulty;

        //Calculate the hash
        newBlock.hash = newBlock.calculateHash();

        // Determine the success ratio
        const test_hash = newBlock.hash.substring(0,this.difficulty);
        const test_result = (test_hash.match(/0/g) || []).length;
        if(test_result === this.difficulty) {
            this.blocks.push(newBlock);
            this.difficulty += 1;
        } else {
            return null;
        }
        return this.blocks;
    }

    // Validate the blockchain
    checkValid() {
        for(let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = {
    Blockchain: Blockchain
}