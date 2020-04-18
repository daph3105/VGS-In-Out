const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { join } = require('path');
var session = require('express-session')
const path = require('path');


//Dotenv middle-ware to load variables from .env file.
require('dotenv').config();
const port = process.env.PORT || 8000;

//VGS credentials from .env file
const identifier =  process.env.IDENTIFIER;
const user = process.env.USER;
const pass = process.env.PASS

//file system module to read certificate under path/to/cert.pem
const fs = require('fs');
const request = require('request');
const tunnel = require('tunnel');

//body-parser middleware to extract form input and expose it on req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Express session middleware
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//outbound/forward proxy assigned to tunnelingAgent
const tunnelingAgent = tunnel.httpsOverHttp({
    ca: [ fs.readFileSync('path/to/cert.pem')],
    proxy: {
        host: identifier+'.sandbox.verygoodproxy.com',
        port: 8080,
        proxyAuth: user+':'+pass
    }
});



app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/success', (req, res, next)=>{
  var message = req.session.success;
  res.render('success',{message: message})
})

app.get('/revealed', (req, res, next)=>{
  var message = req.session.revealed;
  res.render('revealed',{message: message})
})

//Sending inbound request to vgs to secure data
app.post('/inbound', function (req, res) {
  var cardInput = JSON.parse(req.body.message);
  var card = {card_cvv : cardInput.card_cvv,
  card_expirationDate: cardInput.card_expirationDate,
  card_number:cardInput.card_number}
  request({
    url: 'https://tntipfh6dlx.SANDBOX.verygoodproxy.com/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(card)
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log('Status:', response.statusCode);
      req.session['success'] = JSON.stringify(JSON.parse(body).json, null, 4);
      res.redirect('/success');
    }
  })
})


//Sending outbound request to vgs echo server
app.post('/outbound', function (req, res) {
  var cardInput = JSON.parse(req.body.message);
  var card = {card_cvv : cardInput.card_cvv,
  card_expirationDate: cardInput.card_expirationDate,
  card_number:cardInput.card_number}
request({
    url: 'https://echo.apps.verygood.systems/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    agent: tunnelingAgent,
    body: JSON.stringify(card)
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.redirect('/revealed')
    } else {
// if successfull, revealed data is returned
      console.log('Status:', response.statusCode);
      req.session['revealed'] = JSON.stringify(JSON.parse(body).json, null, 4);
      res.redirect('/revealed')
    }
});
})




app.listen(port, () => console.log(`VGS app listening at http://localhost:${port}`))