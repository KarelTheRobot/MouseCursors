var express = require('express')
var path = require('path')
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var cookie_session = require('cookie-session');
var mysql = require('mysql');
var fs = require('fs');


app.use(bodyParser.urlencoded({extended: true}));

app.use(cookie_session({
    name: 'session',
    keys: ["alksdjfaasklejghuoihbvauodh", "amsndmabvkhoiuhuiopepoajkhnfjgahfbc"],
    cookie: {secure: false}
  }))

app.use('/js', express.static(path.join(__dirname, '/js')))
app.use('/css', express.static(path.join(__dirname, '/css')))

app.set('view engine', 'hbs');

app.set('trust proxy', 1) // trust first proxy 
/*app.get("/cookie_test", function(req, res){
    if (req.session.token == undefined) {
        req.session.token = 5;
    } else {
        req.session.token += 1;
        console.log(req.session.token);
    }
    res.send("hello!");
})*/

function generate_order(num) {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    arr = [0.2, 0.6, 1, 2, 4];
    shuffleArray(arr);
    return arr;
}

app.get("/clear_all", function(req, res) {
    req.session.completed_bits = 0;
    req.session.id = undefined;
    res.redirect("/");
})

app.get('/', function(req, res){

    var id = req.session.id;

    if (id == undefined) {
        res.redirect("/login");
    } else {
        var order = req.session.order;
        if (order == undefined) {
            order = generate_order(5);
            req.session.order = order;
        }

        if (req.session.completed_bits == undefined) {
            req.session.completed_bits = 0;
        }
        /*var completed0 = req.session.completed[0] || 0;
        var completed1 = req.session.completed[1] || 0;
        var completed2 = req.session.completed[2] || 0;
        var completed3 = req.session.completed[3] || 0;
        var completed4 = req.session.completed[4] || 0;*/

        text1 = "<div id='main_div'>"
        cutoff = false;
        for (i = 1; i <= 5; i++) {
            text1 +=    "<a class=\"btn "
            if (req.session.completed_bits & (2 << (i - 1))) {
                text1 += "btn-secondary disabled\""
            } else if (!cutoff) {
                cutoff = true;
                text1 += "btn-primary\""
            } else {
                text1 += "btn-outline-primary disabled\""
            }
            text1 += " href=\"/test?id=" + i + "\" role=\"button\">Part " + i + "</a>"
            //text1 +=    "<a href=\"/test?id=" + i + "\">Part " + i + "</a></button>"
        }
        text1 += "<a class=\"btn btn-danger\" href=\"/clear_all\" role=\"button\">Start Over</a> </div>"
        
        if (!cutoff) {
            text1 += "<p>All done! Make sure you've taken the survey <a href=\"https://docs.google.com/forms/d/e/1FAIpQLSc68eLjBw_8BNFndxkZlVOCn3Gv3sEKdBO4TXgJD8wL2MI_wQ/viewform?usp=sf_link\">here</a>. Thank you!</p>"
        }

        data = {
            id: id,
            inj: text1
        }
        res.render("homepage", data);
    }
//res.sendFile(__dirname + "/index.html");
});

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/register", function(req, res){
    req.session.id = req.body.compid;
    res.redirect("/");
})

app.get('/test', function(req, res){
    //var id = 6;
    var index = req.query.id;
    var id = req.session.id;
    var order = req.session.order;
    var completed_bits = req.session.completed_bits;
    if (order == undefined) {
        res.redirect("/");
    } else if (completed_bits == undefined) {
        res.redirect("/");
    } else {
        var data = {
            circles: 11,
            inner_radius: 50,
            outer_radius: 300,
            mouse_speed: req.session.order[index-1],
            index: index
        }
        res.render('fittstest', data);
    }

    
});

app.post("/result", function(req, res){
    o = req.session.order;

    string = req.body.index + "," + o[req.body.index - 1] + "," + req.session.id + "," + String(req.body.average_time) + "," + String(req.body.first_5_avg) + "," + String(req.body.last_5_avg) + "," + String(req.body.total_correct) + "," + String(req.body.percent_correct) + "\n";
    fs.appendFileSync('output.csv', string);
    console.log(string);
    
    a = req.session.completed_bits;

    index = req.body.index - 1;

    a |= (2 << index);

    req.session.completed_bits = a;

    res.send("hi");
})

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});