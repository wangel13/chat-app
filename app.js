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
  , connectionManager = require('./managers/connectionManager')
  , messageDispatcher = require('./dispatchers/messageDispatcher');

// routes
var routes = require('./routes/index');

var messages = new messagesStore.MemoryStorage();
var users    = new usersStore.UsersStorage();

app.use(express.static('public'));

app.use('/', routes);

var connections = new connectionManager.ConnectionStore();
// WSS
wss.on('connection', function connection(ws) {

  console.log('New user connection');
  var client = new connectionManager.WebSocketConnection(ws, connections, messages, users);
  connections.add(client);

});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

module.exports = app;
