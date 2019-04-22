const request = require('request-promise');
const URL = process.env.API_URL || 'http://localhost:8080'

class Player{

  constructor(token){
    this.token = token;
  }

  getUser(){
    return request.get(URL + '/users/me', {
      'auth': {
        'bearer': this.token
      },
      'json':true
    })
    .then((user) => this.user = user )
    .catch(() => {throw {name:"UserNotFoundError", message:"User not found"}})
  }



}

module.exports = Player;
