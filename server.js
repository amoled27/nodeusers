var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require("path"),
    morgan = require('morgan'),
    bcrypt = require('bcrypt-nodejs');
    hbs = require('hbs');
var User = require('./models/User');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/appsession";
var session = require('express-session');

   


    // ==================setting up Database=============================
     // Connect to the db
      MongoClient.connect(url, function(err, db) {
          if(!err) {
            console.log("We are connected");
          }else{
            throw err;
          }
        });


    // ============================Setting up view engine===================

    app.set('view engine','html'); //html is specifies to tell server that only html files are included
    app.engine('html',hbs.__express);

    // ==================setting up body-parser==============================

	    //support parsing of application/json type post data
	app.use(bodyParser.json());
	 
	//support parsing of application/x-www-form-urlencoded post data
	app.use(bodyParser.urlencoded({ extended: true }));

	//tell express that www is the root of our public web folder
	app.use(express.static(path.join(__dirname, 'views')));
   



    app.use(express.static(__dirname + '/views'));                 // sets the static files location to public
    app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
    app.use(morgan('dev'));   


// ========================HASHING FUNCTIONS=======================================
var generateHash = function(password){
        var count = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(password,count,null);
        }


   
 // ========================Routes======================================================


// ---------------------------home route---------------------------

    app.get('/',function(req,res){
        res.render('index');
    });

// ---------------------------Signup route---------------------------

    app.get('/signup',function(req,res){
        res.render('signup');
    });

    app.post('/signup', function(req, res){

        MongoClient.connect(url, function(err, db) {
        var collection = db.collection('users');
        if (req.body.password===req.body.cpassword)
        {
            var pass = generateHash(req.body.password);
                    var user = {'email':req.body.email,'password':pass,'name': req.body.name};
                    collection.insert(user);
                    console.log('inserted');
                    res.redirect('/login');
                }else{
                    console.log('password does not match');
                    res.redirect('/signup');
                }
        });
     });

// ---------------------------login route---------------------------


    app.get('/login', function(req,res){
        res.render('login');
    });

    app.post('/login',function(req,res){
        MongoClient.connect(url,function(err,db){

            var collection = db.collection('users');
            var password = req.body.password;
           collection.findOne({email:req.body.email},function(err,docs)
            {
                    if(bcrypt.compareSync(password,docs.password)){
                        console.log('logged in');
                        res.redirect('/');
                    }else{
                        res.redirect('/login');
                    }
            });
            
            });

        });


    
 // ========================setting up connection==============================
	//wait for a connection
	app.listen(3000, function () {
  	console.log('Server is running. Point your browser to: http://localhost:3000');
	});
