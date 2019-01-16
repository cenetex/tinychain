const express = require('express'), bodyParser = require('body-parser');

const app = express();

const PORT = 3030;

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('static'));

const blockchain = require('.');
let chain = blockchain.create();

app.get('/chains/test', (request, response) => {
    response.send(JSON.stringify(chain, null, 4));
});

app.put("/chain/mine", (request, response) => {
    let data = request.body;
    try {
        chain.mine(0,data.address);
    } catch (err) {
        response.send(err.message);
    }
});

app.get('/wallet/new', (request, response) => {
    response.send(blockchain.wallet.create());
});
app.post('/wallet/sign', (request, response) => {
    let data = request.body;
    let wallet = blockchain.wallet.load(data.source, data.key);
    response.send(JSON.stringify(wallet.transaction(data.destination, data.amount)));
});
app.post('/transaction', (request, response ) => {
    let data = request.body;
    response.send(chain.addTransaction(data));
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})