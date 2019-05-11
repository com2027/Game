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

if(process.env.NODE_ENV == 'development'){
  require('dotenv').config()
}

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
//when the user is connected and authenticated
io.on('connection', function(socket){
  //log the user to the server console
  console.log(socket.player.user.firstName + ' ' + socket.player.user.lastName + ' connected');

  //when a user tries to create a game
  socket.on('createGame', (data) => {
    //get the data
    let players = data.players;
    let photo = data.photo;
    //try to make the game
    try{
      //create new game object giving the players who are invited
      let game = new Game(players);
      //log to console attempting to make game
      console.log(socket.player.user.firstName + " " + socket.player.user.lastName + " is trying to create game: " + game.id )
      //set the photo for the user
      socket.player.photo = photo;
      //create the game
      game.create(socket);
      //set the game for the user
      // socket.player.game = game;
    }catch(err){
      //if the game cannot be created then log the error to the user and console
      socket.emit('gameNotCreated', {message: err.message});
      console.log(err.message);
    }
  });

  //when a user tries to leave a game
  socket.on('leaveGame', () => {
    //leave the game
    socket.player.game.leave(socket);
  });

  //when a user tries to join a game
  socket.on('joinGame', (data) => {
    //get the data
    let game_id = data.id;
    let photo = data.photo;
    //join the game
    Game.join(socket, game_id, photo);
  });





  socket.on('disconnect', function(){
    console.log(socket.player.user.firstName + ' ' + socket.player.user.lastName + ' disconnected')
  });
});
/////////////////////////////////////////////////////////////////////////
