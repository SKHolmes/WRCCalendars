var express = require('express');
var app = express();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var router = express.Router();

var transport = nodemailer.createTransport({
  service: 'gmail',
  //secureConnection: false, // use SSL
  //port: 587, // port for secure SMTP
  auth: {
    user: 'jonesautomotive.mailer@gmail.com',
    pass: 'tysclzukmvzsipmw'
  }
});

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});

app.get('/send',function(req,res){
	var mailOptions={
		from : 'jonesautomotive.mailer@gmail.com',
		to:'jonesautomotive@xtra.co.nz',
		subject : req.query.subject,
		text : req.query.text
	}
	console.log(mailOptions);
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