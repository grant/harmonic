/*
	Start of sockets


var socket = io.connect(location.protocol + '//' + location.host);
socket.on('connect', function() {
	socket.emit('setUser');
});

socket.on('update message', function(data) {
	console.log(data);
	var $chatBox = $('#chat-box');
	var text = data.user + ': ' + data.message
	var $message = $('<div>' + text + '</div>');
	$message.addClass('message');
	$message.addClass('list-group-item');
	console.log($message);
	$chatBox.append($message);
});

$('#submit-message').click(function() {
	var message = $('#message-field').val(),
		user = $('#edit-profile').text();

	var data = {
		'message' : message,
		'user' : user
	};

	$('#message-field').val('').focus();

	socket.emit('send message', data);
})
*/