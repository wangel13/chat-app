// Server requests
function httpGetAsync(url, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}

function httpPostAsync(url, data){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.status == 200) {
      console.log('Сообщение успешно отправлено');
    }
  };
  xmlHttp.open("POST", url, true); // true for asynchronous
  xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlHttp.send(data);
}

// Chat class
function Chat(baseUrl) {

  this.store = {
    url: baseUrl
  };

  // Get messages from server
  this.getMessages = function() {
    httpGetAsync((this.store.url + '/getMessages'), this.renderMessages);
  };

  this.repeatelyGetMessages = function(interval) {
    setInterval(function () {
      this.getMessages();
    }.bind(this), interval);
  };

  // Render
  this.renderMessages = function(content) {
    document.getElementById('messageBox').innerHTML = '';
    var x = JSON.parse(content)
    x.forEach(function(item, index) {
      var div = document.createElement('div');
      div.className = 'b-message';
      div.innerHTML = '<div class="b-message-item"><b>'+ item.user +': </b>'+ item.message +'</div>\
                      <div class="b-message-item">'+ item.date +'</div>';
      document.getElementById('messageBox').appendChild(div);
    });
  };

  // Pass messages to server
  this.sendMessage = function(message) {
    httpPostAsync((this.store.url + '/postMessages'), message);
  };

}


// Init
var myChat = new Chat('/api');
// Get messages
myChat.repeatelyGetMessages(1000);
// Bind control
document.getElementById('messageSend').addEventListener('keydown', function(e) {
  var key = e.which || e.keyCode;
  if (key === 13 && this.value.replace(/^\s+|\s+$/g,"") !== '') { // 13 is enter
    var message = {
      message: this.value,
      user: 'Taras'
    };
    myChat.sendMessage(JSON.stringify(message));
  }
})
