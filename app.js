// require modules
var server          = require('http').createServer()
  , url             = require('url')
  , WebSocketServer = require('ws').Server
  , wss             = new WebSocketServer({ server: server })
  , express         = require('express')
  , app             = express()
  , messagesStore   = require('./stores/messagesStore')
  , usersStore      = require('./stores/usersStore')
  , connectionManager = require('./managers/connectionManager')
  , messageDispatcher = require('./dispatchers/messageDispatcher');

// routes
var routes = require('./routes/index');

var messages = new messagesStore.MemoryStorage();
var users    = new usersStore.UsersStorage();

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.use('/', routes);

var connections = new connectionManager.ConnectionStore();
// WSS
var id = 0;
wss.on('connection', function connection(ws) {
  id = id+1;
  console.log('New user connection');
  var client = new connectionManager.WebSocketConnection(ws, connections, messages, users, id);
  connections.add(client);

});

server.on('request', app);
server.listen(app.get('port'), function () { console.log('Listening on ' + server.address().port) });

module.exports = app;
