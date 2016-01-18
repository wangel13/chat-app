var usersStore        = require('../stores/usersStore')
  , messageDispatcher = require('../dispatchers/messageDispatcher');


function WebSocketConnection(ws, connections, messages, users){
  this.ws = ws;
  var user   = null;
  ws.on('message', function(message) {
    var parsed = JSON.parse(message)

    if (parsed.type === 'login') {
      if(users.get().some(function(arrVal) {return parsed.name === arrVal.name;})) {
        var loginedAnsw = {
          type: 'userExist'
        };
        ws.send(JSON.stringify(loginedAnsw));
        console.log('User ' + parsed.name + ' already exist.');
      } else {
        user = new usersStore.User(parsed)
        users.add(user);
        var loginedAnsw = {
          type: 'logined'
        };
        ws.send(JSON.stringify(loginedAnsw));
        console.log('User ' + user.name + ' joined conversation.');
      }
    }

    if (parsed.type === 'message') {
      messages.add(messageDispatcher.Broadcast(connections, parsed, user));
    }

  });

  ws.on('close', function() {
    console.log('Connection closed');
  });
}

function ConnectionStore(){
  var clients = [];
  this.add = function(client) {
    clients.push(client);
  }
  this.get = function() {
    return clients;
  }
}

module.exports = {
  WebSocketConnection: WebSocketConnection,
  ConnectionStore    : ConnectionStore
};
