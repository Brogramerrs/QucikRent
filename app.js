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
var multer = require('multer');
var fs =require('fs');
var session = require('express-session');
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyBzV0yOmGhO_ZDCzGa1uhA2O6xwAhQXuvo',
    formatter: null
};
var app = express();
var sess;
const url = require('url');
app.use(session({secret: 'QUICKRENT'}));
db = mongo.db('mongodb://admin:root@ds153669.mlab.com:53669/quick_rent_database');
// view engine setup
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//Set Up Logger and Body Parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//changed to true
//Set Up Cookie Parser
app.use(cookieParser());
//Set Up '/public' as static folder
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', index);
/** Serving from the same express Server
 No cors required */
app.use(express.static('../client'));
app.get('/',function(req,res){
    sess = req.session;
    console.log("app.get(/) called ");
//Session set when user Request our app via URL
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        if(req.url.toString().include("getProduct"))
        {
            console.log("calling GetProductList");
            GetProductList(req,res);
        }
       // res.redirect('/product.html');
    }
    else {
        res.render('index.html');
    }
});
//-------------------------------Services for Login page-------------------------------//

app.post('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});
app.post('/CheckUser',function(req,res) {
    var userChecked=false;
     db.collection("personal_info").findOne({_id: req.body._id, password: req.body.password},function (err, data) {
            console.log("entered function CheckUser");
           // console.log(req);
         sess = req.session;
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
                userChecked=true;
                sess.username= req.body._id;
                console.log(data.email);
                sess.email=data.email;
                console.log(sess);
                res.json({"data" : "Valid"});
            }

        }
    );



});




//-------------------------------Services for Registration page-------------------------------//
app.post('/CheckregisterUser',function(req,res) {
    db.collection("personal_info").findOne({_id: req.body._id},function (err, data) {
            console.log("entered function");
            if (data==null) {


                db.collection('personal_info').save(req.body, function(err, result) {
                    console.log("entered databse");
                    if (err)
                        return console.log(err);
                    else {
                        sess = req.session;
                        sess.username= req.body._id;
                        var email="";
                            db.collection('personal_info').findOne( {_id: req.body._id},function (err, data)
                            {
                                if(data!=null)
                                {
                                    email=data.email;
                                }
                            });
                            console.log("email"+email);

                        sess.email= email;
                        res.json({"data":"saved to database"});
1
                    }
                })
            }
            else {
                console.log("entered else if");
                //res.json(err);
                res.json({"data":"data exist"});
            }

        }
    );
    /*
     //-------------------------------Encrypting password-------------------------------//
     var ciphertext = CryptoJS.AES.encrypt(req.body.pwd, '100%sucker');


     console.log("cipher text"+ciphertext);
     res.json({"data":"Encrypted Password :"+ciphertext});
     }*!/*/
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
app.post('/searchMyProduct',function (req,res) {
    console.log("data recieved at server");


        console.log("------------entered search my product at home page------------");
        console.log(req.body);
        db.collection("products").find({productName:{ $regex : new RegExp(req.body.mysearch, "i") }}).toArray(function (err, data) {
            console.log("entered function for getting my own data  function");
            console.log(data);
            if (err) {
                console.log("entered if ");
                res.json({"data": "failed to get any data" + err});
                console.log(err);
            }
            else if (data == null || data.length == 0) {
                console.log("entered else if for all get");
                //res.json(err);
                res.json({"data": "oops!...there is no data matching your request"});
            }
            else {
                console.log("-----------------entered else for my data product------------");
                console.log(data);
                res.send(data);
            }

        });





});
//------------------------------service for image uploads-----------------------------//
var name;

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/image_upload')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        name = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/imagetodb',function(req,res) {
    console.log("the main function jrurati");
    upload(req,res,function(err){
        console.log("uploading...wait..........");
        if(err){
            console.log(err);
            res.json({error_code:1,err_desc:err});
            return;
        }
        else{console.log("Upload successfull");
            console.log(name);
            res.send(name);
        }

    })

});













//----------------------------Service for product add----------------------------------//
app.post('/productToDb',function(req,res) {
    console.log("req.session"+req.session);
    sess = req.session;
if(sess.username) {
    console.log("username ="+sess.username);
    console.log("app js called");
    req.body.productusername = sess.username;
    console.log(req.body);
    db.collection('products').save(req.body, function (err, result) {
        console.log("enter Product");
        console.log(req.body.productName);
        if (err) {
            return (err);
            console.log("error");
        }
        else {
            res.json({"data": "valid data"});
        }
    })
}
else{console.log("session not found");res.redirect("/");}
});

//----------------------------Service for product selected----------------------------------//

app.post('/searchData',function(req,res) {
   console.log("searchdata entered");
    sess = req.session;
    console.log(sess);
   // if (sess.username) {
        console.log("------------------------search data -----------------------------------");

        //console.log(req.body);
        console.log(req.body);
        /*console.log(req.body.itemName.toString().toLowerCase());
        console.log(req.body.itemPrice);*/
      /*  var name=new RegExp('/' + +req.body.itemName+'/', 'i');*/

        db.collection("products").find({productType:{ $regex : new RegExp(req.body.itemName, "i") }}).toArray(function (err, data) {
            console.log("entered function for getting categorized data function");
            console.log(data);
            if (err) {
                console.log("entered if ");
                res.json({"data": "failed to get any data" + err});
                console.log(err);
            }
            else if (data == null || data.length == 0) {
                console.log("entered else if for all get");
                //res.json(err);
                res.json({"data": "oops!...there is no data matching your request"});
            }
            else {
                console.log("-----------------entered else for all get product------------");
                console.log(data);
                res.send(data);
            }

        });

   // }

       // else{res.redirect("/");}
});

//--------------------------------------specific product-----------------------------------//

app.get('/getSpecificdata',function(req,res) {
    console.log("specific data is called inside app js ");

    console.log(req.query.clicked);
    db.collection("products").find({productType:{ $regex : new RegExp(req.body.clicked, "i") }}).toArray(function (err, data) {
            console.log("entered function");
            console.log(data);
            if (err) {
                console.log("entered if");
                res.json({"data":"failed" + err});
                console.log(err);
            }
            else if (data==null ||data.length == 0) {
                console.log("entered else if");
                //res.json(err);
                res.json({"data" : "empty"});
            }
            else {
                console.log("entered else");
                console.log(data);
                res.send(data);
            }

        }
    );


});
//--------------------------------------get product---------------------------------------//
app.post('/allData',function (req,res) {
    console.log(req.session);
    sess = req.session;
    console.log(sess);
   // if (sess.username) {
    console.log("entered the function");
    db.collection("products").find({productName:{ $regex : new RegExp(req.body.productName, "i") },productType:{ $regex : new RegExp(req.body.productType, "i") }}).toArray(function (err, data) {
            console.log("entered get all data function");
            console.log(sess.username);
            console.log(data);
            if (err) {
                console.log("entered if for all product");
                res.json({"data":"failed" + err});
                console.log(err);
            }
            else if (data==null ||data.length == 0) {
                console.log("entered else if for all get");
                //res.json(err);
                res.json({"data" : "empty"});
            }
            else {
                console.log("entered else for all get product");
                console.log(data);
                res.send(data);
            }

        }
    );
    //}
    //else{console.log("not valid USER");res.status(300).send({"redirect":"/"});}
});
module.exports = app;
//---------------------------------------------send email to tanent----------------------------------------//

app.post('/sendEmail',function(req,res) {


        console.log("entering the sending game");
        console.log(req.body.texttosend);

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
            to: req.body.emailaddress, // list of receivers
            subject: 'Rent Your Product', // Subject line;
            /*text: 'sender email address:'+ sess.email,*/
            html: req.body.texttosend +'<br> <b>sender email address:</b>' + sess.email  // plaintext body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({"data": "Valid User.Error sending mail"});
            } else {
                console.log("sending...wait...");
                console.log(text);
                console.log(req.body.texttotsend);
                console.log('Message sent: ' + info.response);
                res.json({"data": "Valid User.Message sent"});
                res.json({yo: info.response});
            }
            ;
        });



});
