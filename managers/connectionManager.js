var usersStore        = require('../stores/usersStore')
  , messageDispatcher = require('../dispatchers/messageDispatcher');


function WebSocketConnection(ws, connections, messages, users, id){
  this.ws         = ws;
  this.id         = id;
  var user        = null;

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
        var connectionMsg = {
          message: 'User ' + user.name + ' connected to chat...'
        };
        messages.get().forEach(function(item) {
          ws.send(JSON.stringify(item));
        });
        messages.add(messageDispatcher.Broadcast(connections, connectionMsg, user, true));
        var onlineMessage = {
          type: 'online',
          users: users.get()
        }
        connections.get().forEach(function(item) {
          item.ws.send(JSON.stringify(onlineMessage));
        })
      }
    }

    if (parsed.type === 'message') {
      messages.add(messageDispatcher.Broadcast(connections, parsed, user));
    }

  });

  ws.on('close', function() {
    if (user !== null) {
      var connectionCloseMsg = {
        message: 'User ' + user.name + ' disconnected from chat...'
      };
      connections.remove(id);
      users.remove(user);
      messages.add(messageDispatcher.Broadcast(connections, connectionCloseMsg, user, true));
      var onlineMessage = {
        type: 'online',
        users: users.get()
      }
      connections.get().forEach(function(item) {
        item.ws.send(JSON.stringify(onlineMessage));
      })
    }
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
  this.remove = function(id) {
    clients = clients.filter(function(obj) {
      return obj.id !== id;
    });
  }
}

module.exports = {
  WebSocketConnection: WebSocketConnection,
  ConnectionStore    : ConnectionStore
};
