function Login(socket) {
  var view = new LoginView(socket);
  view.createView();
}

function LoginView(socket) {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-container b-loginWindow" id="loginBox">\
                     <div class="b-inputMessage">\
                      <input id="login" placeholder="Write your login here & press Enter">\
                     </div></div>';
    document.getElementById('app').appendChild(div);
    document.getElementById('login').addEventListener('keydown', function(e) {
      var key = e.which || e.keyCode;
      if (key === 13 && this.value.replace(/^\s+|\s+$/g,'') !== '') { // 13 is enter
        var user = {
          name: this.value,
          type: 'login'
        };
        socket.send(JSON.stringify(user));
        this.value = '';
      }
    })
  }
}

function Chat(socket) {
  var view   = new ChatView(socket);
  view.createView();
  socket.onmessage = function(event) {
    var incomingMessage = JSON.parse(event.data);
    if (incomingMessage.type === 'message') {
      view.renderMessages(incomingMessage);
      spawnNotification(incomingMessage.message, '/images/envelope.jpg', 'New message in chat');
    } else if (incomingMessage.type === 'online') {
      view.renderStatus(incomingMessage);
    }
  };
}

function ChatView(socket) {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-container b-flex"><div class="b-flex-item b-flex-item--one"><div class="b-chatWindow" id="messageBox"></div>\
                     <div class="b-inputMessage">\
                      <textarea id="messageSend" rows="8" cols="40" placeholder="Write your message here & press Enter"></textarea>\
                     </div></div><div class="b-flex-item b-flex-item--two">\
                     <div class="b-usersOnline" id="onlineStatus"></div></div>\
                     </div>';
    document.getElementById('app').appendChild(div);
    document.getElementById('messageSend').addEventListener('keydown', function(e) {
      var key = e.which || e.keyCode;
      if (key === 13 && this.value.replace(/^\s+|\s+$/g,'') !== '') { // 13 is enter
        var message = {
          message: this.value,
          date: new Date(),
          type: 'message'
        };
        socket.send(JSON.stringify(message));
        this.value = '';
      }
    })
  }
  this.renderMessages = function(content) {
    var div = document.createElement('div');
    div.className = 'b-message';
    div.innerHTML = '<div class="b-message-item"><b>'+ content.user.name +': </b>'+ content.message +'</div>\
                    <div class="b-message-item">'+ content.date +'</div>';
    var messageBox = document.getElementById('messageBox');
    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight;
  };
  this.renderStatus = function(content) {
    document.getElementById('onlineStatus').innerHTML = '';
    content.users.forEach(function(user) {
      var div = document.createElement('div');
      div.className = 'b-status';
      div.innerHTML = '<div class="b-status-item"><b>'+ user.name +'</b></div>';
      document.getElementById('onlineStatus').appendChild(div);
    });
  }
}

// notifications
Notification.requestPermission();
function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
  	body: theBody,
  	icon: theIcon
  }
  var n = new Notification(theTitle,options);
  setTimeout(n.close.bind(n), 10000);
}

// Init
var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host;
new_uri += loc.pathname + ":3000";

var websocket = new WebSocket(new_uri);
var login     = new Login(websocket);
var myChat    = null;
websocket.onmessage = function(event) {
  var incomingMessage = JSON.parse(event.data);
  if (incomingMessage.type === 'logined') {
    myChat = new Chat(websocket);
  } else if (incomingMessage.type === 'userExist') {
    alert('This name already exist! Try another!')
  }
};
