


var hostname = '0.0.0.0';
var port = process.env.PORT || 7611;
var express = require('express');
var app = express();
app.use(express.static(__dirname));

var http = require('http');
var server = http.Server(app);

var io = require('socket.io')(server);

var mongodb = require('mongodb');

app.get('/', function(req, res){
	res.sendfile('signup.html');
});

var uri = 'mongodb://user1:user1@ds145302.mlab.com:45302/gameblocks';


io.on('connection', function(socket) {
	console.log('connection');
	//console.log('here is the socket id:' + socket.id);

	//socket.on('join',function(data){
		//trigger a particular even on this particular client object
		//socket.emit('found one','socket join');

	//});

	socket.on('signup', function (msg) {

		//socket.emit('found one','socket join');

		var username = msg[0];
		var email = msg[1];
		var pw = msg[2];

		mongodb.MongoClient.connect(uri, function (err, db) {

			console.log("signing up")

			if (err) throw err;

			var signup = db.collection('signup');

			signup.insert({username: msg[0],email: msg[1],password: msg[1]}, function (err, result) {

				if (err) throw err;
			});


		});

		console.log('signup initiated' + msg);

	});

	socket.on('verify_creds', function (msg) {

		//socket.emit('found one','socket join');

		var username = msg[0];
		var pw = msg[1];

		console.log(msg[0]);
		console.log(msg[1]);



		mongodb.MongoClient.connect(uri, function (err, db) {
			//socket.emit('found one','found one');
			if (err) throw err;

			var signup = db.collection('signup');

			signup.findOne({username: msg[0],password: msg[1]}, function (err, result) {
				console.log(result);
				if(result !== null){
					console.log("found one");
					console.log(socket);
					socket.emit('found one','found the record');
					//socket.emit("found one");
				}
				else{

					socket.emit('did not find credentials','found the record');
				}

				if (err) throw err;
			});


		});

		console.log('verify credentials initiated' + msg);

	});

});

server.listen(port, hostname, function(){
	console.log('listening on ' + hostname + ':' + port);
});