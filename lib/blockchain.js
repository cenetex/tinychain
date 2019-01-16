const forge = require('node-forge');
function SHA256(message) {
    var md = forge.md.sha256.create();
    md.update(message);
    return md.digest().toHex()
}

class Block {
    constructor(timestamp, data) {
        this.timestamp = timestamp;
        this.data = forge.util.encode64(JSON.stringify(data));
        this.previousHash = "0";
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }
}

class Blockchain{
    constructor(name) {
        this.name = name;
        this.chain = [this.createGenesis(name)];
        this.transactions = { data: [] };
        this.difficulty = 0;
    }

    createGenesis(name) {
        return new Block(new Date().toISOString(), {name: name}, "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addTransaction(transaction) {
        // TODO: Validate Transaction
        this.transactions.data.push(JSON.stringify(transaction));
        return true;
    }

    mine(address){
        let newBlock = new Block(new Date().toISOString(), this.transactions)
        newBlock.previousHash = this.latestBlock().hash;
        // Claim the block
        newBlock.claim = address;
        //Generate a nonce for this attempt
        newBlock.nonce = SHA256(address + ":" + Math.random());
        //Set the difficulty
        newBlock.difficulty = this.difficulty;

        //Calculate the hash
        newBlock.hash = newBlock.calculateHash();

        // Determine the success ratio
        if((newBlock.hash.match(/0/g) || []).length > this.difficulty) {
            this.chain.push(newBlock);
            this.difficulty += 1;
        } else {
            throw new Error("Failed to mine block.");
        }
        return this.chain;
    }

    // Validate the blockchain
    checkValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

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