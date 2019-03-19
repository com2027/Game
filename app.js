/////////////////////////////////////
// Bounty Hunter Game Server
// 2019
// COM2027 - Group 15
/////////////////////////////////////

//set port to either the deployment port or 3000 for development
const PORT = process.env.PORT || 3000;

//include express, http server and socket.io
var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// INITAL SERVER SETUP
/////////////////////////////////////////////////////////////////////////
//On the root route, serve the index page which is just a HTML page containing the logo
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

//Set express to use static files so we can load the logo
app.use(express.static('public'));

//Start listening on the port and serving web pages.
http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

/////////////////////////////////////////////////////////////////////////



// SOCKET IO GAME STUFF STARTS HERE
/////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('welcome','welcome to the server');
});
/////////////////////////////////////////////////////////////////////////
