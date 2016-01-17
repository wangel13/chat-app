function Message(msg, user) {
  return {
    user   : user.name,
    message: msg,
    date   : new Date()
  }
}

function MemoryStorage() {
  var messages = [];
  this.add = function(msg) {
    messages.push(msg);
  }
}

module.exports = {
  MemoryStorage: MemoryStorage,
  Message      : Message
};
