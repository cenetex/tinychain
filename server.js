const express = require('express'),
    bodyParser = require('body-parser'),
    blockchain = require('.');

const app = express(),
    PORT = 3030;

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('static'));

blockchain.create(chain => {
    app.get('/chains/test', (request, response) => {
        response.send(JSON.stringify(chain, null, 4));
    });

    app.put("/chain/mine", (request, response) => {
        let data = request.body;
        let counter = 0;
        let blocks = chain.mine(data.address);

        while (counter < 10000 && blocks === null) {
            blocks = chain.mine(data.address);
            counter++;
        }
        if (blocks !== null) {
            chain.blocks = blocks;
            chain.save();
            response.send("Successfully mined a block and saved the chainfile!");
            return;
        }
        throw new Error("Failed to mine a block after 1000 attempts!");
    });

    app.get("/chain/download", (request, response) => {
        response.send(chain);
    });
    app.get("/chain.json", (request, response) => {
        response.send(chain);
    });

    app.get('/wallet/new', (request, response) => {
        response.send(blockchain.wallet.create());
    });
    app.post('/wallet/sign', (request, response) => {
        let data = request.body;
        let wallet = blockchain.wallet.load(data.source, data.key);
        response.send(JSON.stringify(wallet.transaction(data.destination, data.amount)));
    });
    app.post('/transaction', (request, response) => {
        let data = request.body;
        response.send(chain.addTransaction(data));
    });
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });
});