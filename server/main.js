// require
var http = require('http');
var fs   = require('fs');

// config
var port = 3000;


// Time proto
// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

// store
var messageStore = [{
  message: 'Welcome to the chat! You are the first one!',
  date: new Date().today() + ' - ' + new Date().timeNow(),
  user: 'Bot'
}];

var app = http.createServer(function (request, response) {
  if (request.method === 'POST') {
    if (request.url === '/api/postMessages') {
      var clientMessage = '';

      request.on('data', function (data) {
        clientMessage += data;
      });

      request.on('end', function () {
        clientMessage = JSON.parse(clientMessage);
        var passArray = {
          message: clientMessage.message,
          date: new Date().today() + ' - ' + new Date().timeNow(),
          user: clientMessage.user
        }
        messageStore.push(passArray);
      });

      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end();
    }
  } else {
    if (request.url === '/api/getMessages') {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(messageStore));
    }
    if (request.url === '/js/client.js') {
      fs.readFile('../client/js/client.js', 'utf-8', function (error, data) {
         response.writeHead(200, {'Content-Type': 'text/html'});
         response.write(data);
         response.end();
      });
    }
    if (request.url === '/') {
      fs.readFile('../client/client.html', 'utf-8', function (error, data) {
         response.writeHead(200, {'Content-Type': 'text/html'});
         response.write(data);
         response.end();
      });
    }
  }
}).listen(port);

console.log('Browse to http://127.0.0.1:' + port);
