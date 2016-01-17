function Login() {
  var view = new LoginView();
  view.createView();
  this.passLogin = function(login, callback) {

  }
}

function LoginView() {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-loginWindow" id="loginBox"></div>\
                     <div class="b-inputMessage">\
                      <input id="login" placeholder="Write your login here & press Enter">\
                     </div>';
    document.getElementById('app').appendChild(div);
  }
}

function Chat(baseUrl) {

  var socket = new WebSocket(baseUrl);
  var view   = new ChatView();
  view.createView();
  document.getElementById('messageSend').addEventListener('keydown', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13 && this.value.replace(/^\s+|\s+$/g,'') !== '') { // 13 is enter
      var message = {
        message: this.value,
        user: 'Taras',
        date: new Date()
      };
      myChat.sendMessage(JSON.stringify(message));
      this.value = '';
    }
  })
  socket.onmessage = function(event) {
    var incomingMessage = event.data;
    console.log(event);
    view.renderMessages(incomingMessage);
  };

  // Pass messages to server
  this.sendMessage = function(message) {
    socket.send(message);
  };

}

function ChatView() {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-chatWindow" id="messageBox"></div>\
                     <div class="b-inputMessage">\
                      <textarea id="messageSend" rows="8" cols="40" placeholder="Write your message here & press Enter"></textarea>\
                     </div>';
    document.getElementById('app').appendChild(div);
  }
  this.renderMessages = function(content) {
    var x = JSON.parse(content);
    var div = document.createElement('div');
    div.className = 'b-message';
    div.innerHTML = '<div class="b-message-item"><b>'+ x.user +': </b>'+ x.message +'</div>\
                    <div class="b-message-item">'+ x.date +'</div>';
    document.getElementById('messageBox').appendChild(div);
  };
}

// Init
var login = new Login();

login.passLogin()

var myChat = new Chat('ws://localhost:3000');
