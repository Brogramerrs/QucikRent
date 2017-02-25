delete process.env["DEBUG_FD"];
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var NodeGeocoder = require('node-geocoder');
var mongo = require('mongoskin');
var index = require('./routes/index');

var app = express();
db = mongo.db('mongodb://admin:root@ds153669.mlab.com:53669/quick_rent_database');
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyBzV0yOmGhO_ZDCzGa1uhA2O6xwAhQXuvo',
    formatter: null
};

// view engine setup
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Up Logger and Body Parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set Up Cookie Parser
app.use(cookieParser());

//Set Up '/public' as static folder
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', index);

//-------------------------------Services for Login page-------------------------------//
app.post('/CheckUser',function(req,res) {
     db.collection("personal_info").findOne({username: req.body.username, password: req.body.password},function (err, data) {
            console.log("entered function");
            if (err) {
                console.log("entered if");
                res.json({"data":"failed" + err});
                console.log(err);
            }
            else if (data==null ||data.length == 0) {
                console.log("entered else if");
                //res.json(err);
                res.json({"data":"Empty Data"});
            }
            else {
                console.log("entered else");
                //console.log(data);
                res.json({"data" : "Valid"});
            }

        }
    );

});



            /* var name = getName();
            var pass = get();
            console.log(name); // this prints "undefined"*/
    /*if (db.model("personal_info").find(username:req.body.username, password:req.body.password) != null)
    {
        res.json({"data" : "Valid User"});
    } else {
        res.json({"data" : "Invalid User"});
    }*/





/*function getName(){
    db.test.find({name: req.body.username}, function(err, objs){
        var returnable_name;
        if (objs.length == 1)
        {
            returnable_name = objs[0].name;
            console.log(returnable_name); // this prints "Renato", as it should
            return returnable_name;
        }
    });
}*/




//-------------------------------Services for Registration page-------------------------------//
app.post('/CheckregisterUser',function(req,res) {
    if (req.body.username === "tarun" && req.body.email === "tarun@gmail.com")
    {

        res.json({"data" : "This username has already taken"});
    }
    else{
        //-------------------------------database-------------------------------------------//

        db.collection('personal_info').save(req.body, function(err, result) {
            if (err)
                return console.log(err);

            console.log('saved to database');
        })

        //-------------------------------Encrypting password-------------------------------//
            var ciphertext = CryptoJS.AES.encrypt(req.body.pwd, '100%sucker');

        // // Decrypt
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            console.log("cipher text"+ciphertext);
            res.json({"data":"Encrypted Password :"+ciphertext});
        }
});
//-------------------------------Services for forgot password page-------------------------------//
app.post('/forgotPassword',function(req,res) {

    if (req.body.email==="djethwa2810@gmail.com")
    {

        //res.json("Valid User");

        //ToDo:Code to email the password
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'brogrammerrs@gmail.com', // Your email id
                pass: '2541temple' // Your password
            }
        });
        var mailOptions = {
            from: 'brogrammerrs@gmail.com', // sender address
            to:req.body.email, // list of receivers
            subject: 'Recover Password', // Subject line
            text: "Your password is admin" // plaintext body

        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.json({"data" : "Valid User.Error sending mail"});
                res.json({yo: 'error'});
            }else{
                console.log('Message sent: ' + info.response);
                res.json({"data" : "Valid User.Message sent"});
                res.json({yo: info.response});
            };
        });
    }
    else{
        //res.json("Invalid User");
        res.json({"data" : "Invalid User"});
    }
});

//----------------------------Service for location----------------------------------//
app.post('/locate',function (req,res) {
    console.log("data recieved at server");
    var geocoder = NodeGeocoder(options);
    var address;
    geocoder.geocode(req.body.location ,function (err, RES) {
        address=RES;
        res.json({data: "location" +address});
    }).catch(function(err) {
        console.log(err);
    });

});
//----------------------------Service for product selected----------------------------------//
app.post('/ProductSelectCheck',function(req,res) {
    console.log("app js called");
    /*if(req.body.itemWanted === "Car" || req.body.itemWanted === "Books" || req.body.itemWanted === "admin") {
        res.json({"data" : "Valid User"});
    } else {
        res.json({"data" : "Invalid User"});
    }*/
    res.json({"data": "valid data"})
});

module.exports = app;