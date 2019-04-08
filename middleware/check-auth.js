const jwt = require('jsonwebtoken');
const request = require('request-promise');
const URL = process.env.API_URL || 'http://localhost:8080'

module.exports = (socket,next) => {
  try{
    var handshakeData = socket.request;
    // console.log("middleware:", handshakeData._query['token']);

    const token = handshakeData._query['token']
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'dev');

    request.get(URL + '/users/me', {
      'auth': {
        'bearer': token
      },
      'json':true
    }).then((user) => {
        // console.log(user);
        socket.user = user;
        next();
    }).catch((err) => {
      console.log(err);
      next(new Error(err));
    });

  }catch(err){
    next(new Error('Authentication error'));
  }
};
