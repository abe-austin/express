var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var url = require('url');
var fs = require('fs');
var app = express();
var app2 = express();
var basicAuth = require('basic-auth-connect');
  
var options = 
{
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};

var auth = basicAuth(function(user, pass) 
{
    return((user ==='cs360')&&(pass === 'test'));
});

app.use(bodyParser.json());
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app2.use(bodyParser.json());
app2.use('/', express.static('./html2', {maxAge: 60*60*1000}));

http.createServer(app).listen(3175);
https.createServer(options, app2).listen(3176);




//Support for http

app.get('/getcity', function (req, res)
{
    console.log("In getcity route");
 
	fs.readFile('cities.dat.txt', function (err, data) 
	{
		var urlObj = url.parse(req.url, true, false);
		var myRe = new RegExp("^"+urlObj.query["q"]);
		if(err) throw err;
		var cities = data.toString().split("\n");
		var jsonresult = [];
		for(var i = 0; i < cities.length; i++) 
		{
			var result = cities[i].search(myRe); 
			if(result != -1) 
			{
				console.log(cities[i]);
				jsonresult.push({city:cities[i]});
			}		 
		}	   
		console.log(jsonresult);
		
		res.status(200);
		res.write(JSON.stringify(jsonresult));
		res.end();
	});
});

app.get('/comment', function (req, res) 
{
    console.log("In GET");
			
	//Retrieve from the database
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) 
	{
		if(err) throw err;
		db.collection("comments", function(err, comments)
		{
			if(err) throw err;
			comments.find(function(err, items)
			{
				items.toArray(function(err, itemArr)
				{
					console.log("Document Array: ");
					console.log(itemArr);
						
					res.status(200);
					res.end(JSON.stringify(itemArr));
				});
			});
		});
	});
});




app.post('/comment', auth, function (req, res) 
{
	res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("In POST comment route");
	console.log(req.body);
	console.log(req.user);
    console.log("Remote User");
    console.log(req.remoteUser);
	
	var jsonData = "";
	req.on('data', function (chunk) 
	{
		jsonData += chunk;
	});
	req.on('end', function () 
	{
		var reqObj = JSON.parse(jsonData);
		console.log(reqObj);
				
		//Store this into a mongo database
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost/weather", function(err, db) 
		{
			if(err) throw err;
			db.collection('comments').insert(reqObj,function(err, records) 
			{
				console.log("Record added as "+records[0]._id);
				res.status(200);
				res.end();
			});
			
		});
	});
});



//Support for https

app2.get('/getcity', function (req, res)
{
    console.log("In getcity route");
 
	fs.readFile('cities.dat.txt', function (err, data) 
	{
		var urlObj = url.parse(req.url, true, false);
		var myRe = new RegExp("^"+urlObj.query["q"]);
		if(err) throw err;
		var cities = data.toString().split("\n");
		var jsonresult = [];
		for(var i = 0; i < cities.length; i++) 
		{
			var result = cities[i].search(myRe); 
			if(result != -1) 
			{
				console.log(cities[i]);
				jsonresult.push({city:cities[i]});
			}		 
		}	   
		console.log(jsonresult);
		
		res.status(200);
		res.write(JSON.stringify(jsonresult));
		res.end();
	});
});

app2.get('/comment', function (req, res) 
{
    console.log("In GET");
			
	//Retrieve from the database
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) 
	{
		if(err) throw err;
		db.collection("comments", function(err, comments)
		{
			if(err) throw err;
			comments.find(function(err, items)
			{
				items.toArray(function(err, itemArr)
				{
					console.log("Document Array: ");
					console.log(itemArr);
						
					res.status(200);
					res.end(JSON.stringify(itemArr));
				});
			});
		});
	});
});




app2.post('/comment', auth, function (req, res) 
{
	res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("In POST comment route");
	console.log(req.body);
	console.log(req.user);
    console.log("Remote User");
    console.log(req.remoteUser);
	
	var jsonData = "";
	req.on('data', function (chunk) 
	{
		jsonData += chunk;
	});
	req.on('end', function () 
	{
		var reqObj = JSON.parse(jsonData);
		console.log(reqObj);
				
		//Store this into a mongo database
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost/weather", function(err, db) 
		{
			if(err) throw err;
			db.collection('comments').insert(reqObj,function(err, records) 
			{
				console.log("Record added as "+records[0]._id);
				res.status(200);
				res.end();
			});
			
		});
	});
});
