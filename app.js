// require modules
var server          = require('http').createServer()
  , url             = require('url')
  , WebSocketServer = require('ws').Server
  , wss             = new WebSocketServer({ server: server })
  , express         = require('express')
  , app             = express()
  , port            = 3000
  , messagesStore   = require('./stores/messagesStore')
  , usersStore      = require('./stores/usersStore')

// routes
var routes = require('./routes/index');

var messages = new messagesStore.MemoryStorage();
var users    = new usersStore.UsersStorage();

app.use(express.static('public'));

app.use('/', routes);

// WSS
wss.on('connection', function connection(ws) {

  console.log('New user connection');

  ws.on('message', function(message) {
    var parsed = JSON.parse(message)
    var user   = null;

    if (parsed.type === 'login') {
      if(users.get().some(function(arrVal) {return parsed.name === arrVal.name;})) {
        var loginedAnsw = {
          type: 'userExist'
        };
        ws.send(JSON.stringify(loginedAnsw));
        console.log('User ' + parsed.name + ' already exist.');
      } else {
        user = new usersStore.User(parsed.name, ws)
        users.add(user);
        var loginedAnsw = {
          type: 'logined'
        };
        user.ws.send(JSON.stringify(loginedAnsw));
        console.log('User ' + user.name + ' joined conversation.');
      }
    }

    if (parsed.type === 'message') {
      users.get().forEach(function(item) {
        var sendmessage = new messagesStore.Message(parsed.message, item);
        item.ws.send(JSON.stringify(sendmessage));
      })
    }

  });

  ws.on('close', function() {
    console.log('Connection closed');
  });

});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

module.exports = app;
