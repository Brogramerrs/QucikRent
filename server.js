var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");


app.use(express.static(__dirname + "/public"));

//-------------------------------Services for Login page-------------------------------//
app.post('/CheckUser',function(req,res) {
	
	if (req.param('username')=="admin" && req.param('password')=="admin") 
		{res.json("Valid User");
	}
		else{ res.json("Invalid User");}
});
//-------------------------------Services for Registration page-------------------------------//
app.post('/CheckregisterUser',function(req,res) {
	if (req.param('username')=="tarun" && req.param('email')=="tarun@gmail.com") 
		{
			res.json("This username has already taken");
	}
		else{
		 //-------------------------------Encrypting password-------------------------------//

 
// Encrypt 
var ciphertext = CryptoJS.AES.encrypt(req.param('pwd'), '100%sucker');
 
// // Decrypt 
// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log("cipher text"+ciphertext); 
			res.json("Encrypted Password :"+ciphertext);
		}
});
//-------------------------------Services for Login page-------------------------------//
app.post('/forgotPassword',function(req,res) {
	
	if (req.param('email')=="djethwa2810@gmail.com") 
		{

			res.json("Valid User");

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
    to: req.param('email'), // list of receivers
    subject: 'Recover Password', // Subject line
    text: "Your password is admin" // plaintext body
    
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
	}
		else{ res.json("Invalid User");}
});



 


app.listen(3000);
console.log("server running on 3000");