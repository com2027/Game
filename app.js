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

//include models
const Player = require('./models/player');
const Game = require('./models/game');

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
  console.log(socket.player.user.firstName + ' ' + socket.player.user.lastName + ' connected');
  // console.log(Object.keys(io.sockets.connected));

  socket.on('createGame', (players) => {
    try{
      var game = new Game(players);
      console.log(socket.player.user.firstName + " " + socket.player.user.lastName + " is trying to create game: " + game.id )
      game.create(io, socket, players)
    }catch(err){
      socket.emit('gameNotCreated', {message: err.message});
      console.log(err.message);
    }
  });






  socket.on('disconnect', function(){
    console.log(socket.player.user.firstName + ' ' + socket.player.user.lastName + ' disconnected')
  });
});
/////////////////////////////////////////////////////////////////////////
