var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/',function(req,res){
    console.log("Home");
    res.end("Chatbot");
})

app.listen(port);
console.log("Magic happen in port: " + port);