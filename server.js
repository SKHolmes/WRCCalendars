var express = require('express');
var app = express();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var router = express.Router();
var fs = require("fs");

var transport = nodemailer.createTransport({
	service: 'gmail',
  //secureConnection: false, // use SSL
  //port: 587, // port for secure SMTP
  auth: {
  	user: 'wrccalendars@gmail.com',
  	pass: 'ilikepie123'
  }
});

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.get('/orders', function(req, res){
	var file = __dirname + '/public/orders.csv';
  res.download(file); // Set disposition and send it.
});

// set the home page route
app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});

app.get('/send',function(req,res){
	var mailOptions={
		from : 'wrccalendars@gmail.com',
		to:'wrccommunications01@gmail.com',
		//to:'samualkholmes@gmail.com',
		subject : req.query.subject,
		text : req.query.text
	}
	//console.log(mailOptions);
	fs.readFile(__dirname + '/public/id.txt', 'utf8', function(error, data){
		if(error){
			return console.log(error);
		}
		var id = parseInt(data);
		var order = id + "," + req.query.name + "," + req.query.calNum + "," + req.query.address + "," + req.query.email + "," + req.query.number + "," + req.query.delOrPic + ",No,\n";
		fs.appendFile(__dirname + '/public/orders.csv', order, 'utf8', function(error, data){
			if(error){
				return console.log("Error writing order: "+order);
			}
		});

		
		fs.writeFile(__dirname + '/public/id.txt', (""+(id+1)), 'utf8', function(error, data){
			if(error){
				return console.log("Error writing ID.");
			}
		});
	});

	transport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end(error + '\n\n\n' + response);
		}else{
			console.log("Message sent: " + response);
			res.end("sent");
		}
	});
});

app.listen(port, function() {
	console.log('Running on http://localhost:' + port);
});