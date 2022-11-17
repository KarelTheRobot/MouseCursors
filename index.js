var express = require('express')
var path = require('path')
var app = express();
var hbs = require('hbs');

app.use('/js', express.static(path.join(__dirname, '/js')))
app.use('/css', express.static(path.join(__dirname, '/css')))

app.set('view engine', 'hbs');

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/test', function(req, res){
    var id = req.query.id;
    console.log(id);
    var data = {
        circles: 11,
        inner_radius: 50,
        outer_radius: 300,
        mouse_speed: 2
    }
    res.render('fittstest', data);
});

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});