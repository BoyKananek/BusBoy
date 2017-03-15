var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();
var apiai = require('apiai');
var appapi = apiai('974fb470592f489cb5e768f79c2cb508');


app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
var port = process.env.PORT || 3000;

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'busboybot') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            text = event.message.text;
            //sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
            sendMessage(event);
        }
    }
    res.sendStatus(200);
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    // Got a response from api.ai. Let's POST to Facebook Messenger
    let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}


// generic function sending messages
/*
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};
*/

app.listen(port);
console.log("Magic happen in port: " + port);