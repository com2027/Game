const uuid = require('uuid/v4');

class Game{

  constructor(players){
    this.id = uuid();
    this.players = players
  }


  create(io, socket, players){
    socket.join(this.id, () => {
      io.sockets.adapter.rooms[this.id].game = this;
    });
  }
}

module.exports = Game;
