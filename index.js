var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/',function(req,res){
    console.log("Home");
    res.end("Chatbot");
})

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'busboybot') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.listen(port);
console.log("Magic happen in port: " + port);