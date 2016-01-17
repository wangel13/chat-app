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
    var incomingMessage = event.data;
    console.log(event);
    view.renderMessages(incomingMessage);
  };


}

function ChatView(socket) {
  this.createView = function() {
    document.getElementById('app').innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = '<div class="b-chatWindow" id="messageBox"></div>\
                     <div class="b-inputMessage">\
                      <textarea id="messageSend" rows="8" cols="40" placeholder="Write your message here & press Enter"></textarea>\
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
    var x = JSON.parse(content);
    var div = document.createElement('div');
    div.className = 'b-message';
    div.innerHTML = '<div class="b-message-item"><b>'+ x.user.name +': </b>'+ x.message +'</div>\
                    <div class="b-message-item">'+ x.date +'</div>';
    document.getElementById('messageBox').appendChild(div);
  };

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
