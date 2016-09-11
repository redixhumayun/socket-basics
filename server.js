var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');
var now = moment();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
	console.log('User connected via socket.io!');

	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		var timestamp = now.valueOf();
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System', 
			text: req.name+' has joined',
			time: moment.utc(timestamp).local().format('h:mm a')
		});
	});

	socket.on('message', function(message){
		var timestamp = now.valueOf();

		console.log('Message received: '+message.text);

		message.time = moment.utc(timestamp).local().format('h:mm a');

		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	var timestamp = now.valueOf();

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!', 
		time: moment.utc(timestamp).local().format('h:mm a')
	});
});

http.listen(PORT, function(){
	console.log('http listening on: '+PORT);
});
