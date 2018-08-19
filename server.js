// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var salaryCalc = require('./salaryCalculator');
var nodemailer = require('nodemailer');

var time = '2018-08-24';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'uavdesignandtesting@gmail.com',
           pass: 'Elsa Alstrom'
       }
   });

const mailOptions = {
    from: 'Salary Calculation System', // sender address
    to: 'hdinhthinh@gmail.com', // list of receivers
    subject: 'Salary calculation for week of '+time, // Subject line
  };

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');
  
    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    });
  
    req.on('end', function() {
      next();
    });
  });
  app.use(bodyParser.raw());

  var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/', function(req, res) {
    var data = req.rawBody;
    var message = salaryCalc.calculateSalary(time, data);
    // console.log('Received data: ' + data);
    mailOptions.html = message;
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
     res.send('Sucessfully posted');
});

router.get('/', function(req,res){
  res.send('Server Test OK');
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
