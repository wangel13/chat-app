function Login(socket) {
  var view = new LoginView(socket);
  view.createView();
}

function LoginView(socket) {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-loginWindow" id="loginBox"></div>\
                     <div class="b-inputMessage">\
                      <input id="login" placeholder="Write your login here & press Enter">\
                     </div>';
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
    console.log(event);
    var incomingMessage = JSON.parse(event.data);
    if (incomingMessage.type === 'message') {
      view.renderMessages(incomingMessage);
    } else if (incomingMessage.type === 'online') {
      view.renderStatus(incomingMessage);
    }
  };


}

function ChatView(socket) {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-container"><div class="b-chatWindow" id="messageBox"></div>\
                     <div class="b-inputMessage">\
                      <textarea id="messageSend" rows="8" cols="40" placeholder="Write your message here & press Enter"></textarea>\
                     </div>\
                     <div class="b-usersOnline" id="onlineStatus"></div>\
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
    document.getElementById('messageBox').appendChild(div);
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

// Init
var websocket = new WebSocket('ws://localhost:3000');
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
