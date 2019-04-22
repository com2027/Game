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
        socket.player = player;
        next();
      });

  }catch(err){
    console.log(socket.id + " is unauthorized");
    next(new Error('Authentication error'));
  }
};
