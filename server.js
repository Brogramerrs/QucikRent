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




app.listen(3000);
console.log("server running on 3000");