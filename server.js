var express = require('express');
var app = express();


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
		else{ res.json("Registered");}
});
//-------------------------------Services for Login page-------------------------------//
app.post('/forgotPassword',function(req,res) {
	
	if (req.param('email')=="vatsal@gmail.com") 
		{res.json("Valid User");
	//ToDo:Code to email the password 
	}
		else{ res.json("Invalid User");}
});

app.listen(3000);
console.log("server running on 3000");