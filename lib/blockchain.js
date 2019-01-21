const BLOCK_REWARD = 100;

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
const Transaction = require('./transaction').Transaction;

class Block {
    constructor(timestamp, data) {
        this.timestamp = timestamp || new Date().toISOString();
        this.data = forge.util.encode64(JSON.stringify(data || {}));
        this.previousHash = "0";
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    static load(data) {
        var block = new Block();
        block.timestamp = data.timestamp;
        block.data = forge.util.encode64(JSON.stringify(data.data));
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
        this.transactions = [];
        this.wallets = {};
        this.difficulty = 0;
        this.max_difficulty = 4;
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
            this.wallets = this.getLatestBlock().wallets;
            this.transactions = data.transactions;
            this.difficulty = data.difficulty;

            if(this.checkValid() !== true) {
                throw new Error("Invalid Blockchain");
            };

            callback(this);
        });
    }

    createGenesis(name) {
        return new Block(new Date().toISOString(), null, "0")
    }

    latestBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    addTransaction(data) {
        // TODO: Validate Transaction
        const transaction = Transaction.decode(data);
        this.transactions.push(transaction);
        return true;
    }

    reconcile() {
        let wallets = {};

        for(let k in this.wallets) {
            wallets[k] = this.wallets[k];
        }
        
        this.transactions.forEach(T => {
            let amount = Math.abs(parseInt(T.amount))
            wallets[T.source] = (wallets[T.source] || 0) - amount;
            wallets[T.destination] = (wallets[T.destination] || 0) + amount;
        });

        for(let key in wallets) {
            if(parseInt(wallets[key]) < 0) {
                console.log(wallets);
                throw new Error(`Failed to reconcile transactions: ${key} has a negative balance.`);
            }
        }
        return wallets;
    }

    mine(address){
        let newBlock = new Block(new Date().toISOString())
        newBlock.previousHash = this.latestBlock().hash;
        //Generate a nonce for this attempt
        newBlock.nonce = MD5(address + ":" + Math.random());
        //Set the difficulty
        newBlock.difficulty = this.difficulty;

        //reconcile the transactions
        let wallets = this.reconcile();
        wallets[address] = (wallets[address] || 0) + BLOCK_REWARD;
        newBlock.data = forge.util.encode64(JSON.stringify({
            wallets: wallets,
            transactions: MD5(JSON.stringify(this.transactions + this.wallets))
        }));

        //Calculate the hash
        newBlock.hash = newBlock.calculateHash();

        // Determine the success ratio
        const test_hash = newBlock.hash.substring(0,this.difficulty);
        const test_result = (test_hash.match(/0/g) || []).length;
        if(test_result === this.difficulty) {
            this.blocks.push(newBlock);
            this.transactions = [];
            this.wallets = wallets;
            if (this.difficulty < this.max_difficulty) {
                this.difficulty += 1;
            }
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