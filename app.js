/////////////////////////////////////
// Bounty Hunter Game Server
// 2019
// COM2027 - Group 15
/////////////////////////////////////

//set port to either the deployment port or 3000 for development
const PORT = process.env.PORT || 3000;

//include express, http server and socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//include middleware
const checkAuth = require('./middleware/check-auth');

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
  console.log('Game server listening on *:' + PORT);
});

/////////////////////////////////////////////////////////////////////////


//set up socket io to use some middleware so only authenticated users can connect.
io.use(checkAuth);


// SOCKET IO GAME STUFF STARTS HERE
/////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
  console.log(socket.user.firstName + ' ' + socket.user.lastName + ' connected');
  console.log("here");
  console.log(socket.user);
  socket.emit('welcome','welcome to the server');
});
/////////////////////////////////////////////////////////////////////////
