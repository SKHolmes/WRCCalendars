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
	console.log('here');
	var WRCMailOptions={
		from : 'wrccalendars@gmail.com',
		to:'wrccommunications01@gmail.com',
		//to:'samualkholmes@gmail.com',
		subject : req.query.subject,
		text : req.query.text
	}
	
	
	fs.readFile(__dirname + '/public/id.txt', 'utf8', function(error, data){
		if(error){
			return console.log(error);
		}
		var id = parseInt(data);
		var order = id + "," + req.query.name + "," + req.query.calNum + "," + req.query.address + "," + req.query.email + "," + req.query.number + "," + req.query.delOrPic+ "," + req.query.support + ",No,\n";
		fs.appendFile(__dirname + '/public/orders.csv', order, 'utf8', function(error, data){
			if(error){
				return console.log("Error writing order: "+order);
			}
		});

		var text = 'Thank you for supporting the Wellington Rowing Club!\n\nPlease put $25 per calendar you purchased into this account: 38-9015-0150619-06, named WRC Calendar 2018.\n\nPlease use this number as your reference when making payments '+id+'. If you with to pay with cash just get in touch with someone at the Wellington Rowing Club and we can sort something out.\n\n10% of all sales regardless go to the Mental Health Foundation! If you wish to learn more about mental health check out the MHF at www.mentalhealth.org.nz\n\nOnce again the Welliington Rowing Club appreciates your support.\n\nKind regards,\nThe Wider Wellington Rowing Club Community.';
		console.log(req.query.email);
		var userMailOptions ={
			from: 'wrccalendars@gmail.com',
			to: req.query.email,
			subject: 'Thank you for purchasing ' + req.query.calNum + req.query.plural + '!',
			text: text
		}
		transport.sendMail(userMailOptions, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log("Message sent: " + response);
			}
		});

		
		fs.writeFile(__dirname + '/public/id.txt', (""+(id+1)), 'utf8', function(error, data){
			if(error){
				return console.log("Error writing ID.");
			}
		});
	});

	transport.sendMail(WRCMailOptions, function(error, response){
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