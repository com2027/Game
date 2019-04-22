const jwt = require('jsonwebtoken');
const request = require('request-promise');

const Player = require('../models/player')

module.exports = (socket,next) => {
  try{
    var handshakeData = socket.request;
    // console.log("middleware:", handshakeData._query['token']);

    const token = handshakeData._query['token']
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'dev');

    let player = new Player(token);
    player.getUser()
      .then(() => {
        let sockets = Object.values(socket.server.sockets.connected);
        sockets.forEach((connected) => {
          if(player.user.id == connected.player.user.id){
            throw { name: "UserAlreadyConnectedError", message: player.user.firstName + ' ' + player.user.lastName + ' already connected'};
          }
        });
        socket.player = player;
        next();
      })
      .catch((err) => {
        if(err.name == "UserNotFoundError"){
          console.log(socket.id + " is linked to a user which is not found");
          next(new Error('User not found'));
        }
        if(err.name == "UserAlreadyConnectedError"){
          console.log(err.message);
          next(new Error(err.message));
        }
      });

  }catch(err){
    if(err.name == "JsonWebTokenError"){
      console.log(socket.id + " is unauthorized");
      next(new Error('Authentication error'));
    }
  }
};
