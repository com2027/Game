const uuid = require('uuid/v4');

class Game{

  constructor(players){
    this.id = uuid();
    this.players = players
  }


  create(io, socket, players){
    if(Object.keys(socket.rooms).length <= 1){
      socket.join(this.id, () => {
        io.sockets.adapter.rooms[this.id].game = this;
        console.log(socket.player.user.firstName + " " + socket.player.user.lastName + " has created game: " + this.id )
      });
    }else{
      throw new Error(socket.player.user.firstName + " " + socket.player.user.lastName + " is already in a game: " + Object.keys(socket.rooms)[1]);
    }
  }
}

module.exports = Game;
