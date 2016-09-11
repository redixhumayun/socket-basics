var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var socket = io();

jQuery('.room-name').append(room);

socket.on('connect', function(){
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name, 
		room: room
	});
});

socket.on('message', function(message){
	jQuery('.messages').append('<p><strong>'+message.name+'</strong></p>');
	jQuery('.messages').append('<p><strong>'+message.time+': </strong> '+message.text+'</p>');	
});

// Handles submitting of new message 
var $form = jQuery('#message-form');

$form.on('submit', function(event){
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		room: room,
		text: $message.val()
	});
	$message.val('');
})