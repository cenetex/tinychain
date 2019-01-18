const express = require('express'), 
      bodyParser = require('body-parser');
      const app = express();
      const PORT = 3030;

      let chain = null;
      
      app.use(bodyParser.json());
      //support parsing of application/x-www-form-urlencoded post data
      app.use(bodyParser.urlencoded({ extended: true }));
      
      app.use('/', express.static('static'));


const blockchain = require('.');
blockchain.create(chain => {
      app.get('/chains/test', (request, response) => {
          response.send(JSON.stringify(chain, null, 4));
      });
  
      app.put("/chain/mine", (request, response) => {
          let data = request.body;
          let counter = 0;
          let blocks = chain.mine(0, data.address);
  
          while (counter < 1000 && blocks === null) {
              blocks = chain.mine(0, data.address)
          }
          if (blocks !== null) {
              chain.blocks = blocks;
              chain.save();
              response.send("Successfully mined a block and saved the chainfile!");
              return;
          }
          response.send("Failed to mine a block after 1000 attempts!");
      });
  
      app.put("/chain/save", (request, response) => {
          chain.save();
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