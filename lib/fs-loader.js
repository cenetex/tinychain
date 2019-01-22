const forge = require('node-forge');
const http = require('http');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('fs.config.json', 'utf8'));

exports.load = (callback) => {
    const data = fs.readFile(config.filename, 'utf8', (err, data) => {
        callback(
            JSON.parse(forge.util.decode64(data)));
    });
};

exports.save = (blockchain) => {
    if(!fs.existsSync('chains/')) {
        fs.mkdirSync('chains');        
    }
    fs.writeFileSync('chains/' + blockchain.hash + ".chain", forge.util.encode64(
        JSON.stringify(blockchain))
    );
};