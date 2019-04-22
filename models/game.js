const uuid = require('uuid/v4');

class Game{

  constructor(players){
    this.id = uuid();
    this.players = players
  }


  create(socket, players){
    let io = socket.server;
    if(Object.keys(socket.rooms).length <= 1){
      socket.join(this.id, () => {
        io.sockets.adapter.rooms[this.id].game = this;
        console.log(socket.player.user.firstName + " " + socket.player.user.lastName + " has created game: " + this.id );
        io.to(this.id).emit('gameCreated',{message: "Game has been created", id: this.id});
      });
    }else{
      throw new Error(socket.player.user.firstName + " " + socket.player.user.lastName + " is already in a game: " + Object.keys(socket.rooms)[1]);
    }
  }

  leave(socket){
    socket.leave(this.id);
  }
}

module.exports = Game;
