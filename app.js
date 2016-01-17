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
var users    = new usersStore.usersStorage();

app.use(express.static('public'));

app.use('/', routes);

// WSS
wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions

  var token = location.query.access_token;

  // users.add(new usersStore.User(name, token);

  console.log('New connection: ' + id);

  ws.on('message', function(message) {
    console.log('New message: ' + message);
    for(var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('Connection closed: ' + id);
    delete clients[id];
  });

});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

module.exports = app;

// =============================================================================
// store
// var messageStore = [{
//   message: 'Welcome to the chat! You are the first one!',
//   date: new Date().today() + ' - ' + new Date().timeNow(),
//   user: 'Bot'
// }];
//
// var app = http.createServer(function (request, response) {
//   if (request.method === 'POST') {
//     if (request.url === '/api/postMessages') {
//       var clientMessage = '';
//
//       request.on('data', function (data) {
//         clientMessage += data;
//       });
//
//       request.on('end', function () {
//         clientMessage = JSON.parse(clientMessage);
//         var passArray = {
//           message: clientMessage.message,
//           date: new Date().today() + ' - ' + new Date().timeNow(),
//           user: clientMessage.user
//         }
//         messageStore.push(passArray);
//       });
//
//       response.writeHead(200, {'Content-Type': 'text/html'});
//       response.end();
//     }
//   } else {
//     if (request.url === '/api/getMessages') {
//       response.writeHead(200, {'Content-Type': 'application/json'});
//       response.end(JSON.stringify(messageStore));
//     }
//     if (request.url === '/js/client.js') {
//       fs.readFile('../client/js/client.js', 'utf-8', function (error, data) {
//          response.writeHead(200, {'Content-Type': 'text/html'});
//          response.write(data);
//          response.end();
//       });
//     }
//     if (request.url === '/') {
//       fs.readFile('../client/client.html', 'utf-8', function (error, data) {
//          response.writeHead(200, {'Content-Type': 'text/html'});
//          response.write(data);
//          response.end();
//       });
//     }
//   }
// }).listen(port);
//
// console.log('Browse to http://127.0.0.1:' + port);
