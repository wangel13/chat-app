function Message(msg, user) {
  return {
    type   : 'message',
    user   : user,
    message: msg,
    date   : new Date()
  }
}

function MemoryStorage() {
  var messages = [];
  this.add = function(msg) {
    messages.push(msg);
  }
  this.get = function() {
    return messages;
  }
}

module.exports = {
  MemoryStorage: MemoryStorage,
  Message      : Message
};
