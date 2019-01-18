const forge = require('node-forge');
const http = require('http');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('reddit.config.json', 'utf8'));

function download (url, callback) {
    var url = config.url;

    http.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            var response = JSON.parse(body);
            callback(response);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}

exports.load = () => {
    const data = fs.readFileSync(config.filename, 'utf8');

    return JSON.parse(forge.util.decode64(data));
}

exports.save = (blockchain) => {
    if(!fs.existsSync('chains/')) {
        fs.mkdirSync('chains');        
    }
    fs.writeFileSync('chains/' + blockchain.hash + ".chain", forge.util.encode64(JSON.stringify(blockchain)))
}