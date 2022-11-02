var express = require('express')
var path = require('path')
var app = express();

app.use('/js', express.static(path.join(__dirname, '/js')))
app.use('/css', express.static(path.join(__dirname, '/css')))

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});