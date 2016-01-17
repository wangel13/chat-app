function Message(msg) {
  return {
    message: msg,
    time : new Date()
  }
}

function MemoryStorage() {
  var messages = [];
  this.add = function(msg) {
    messages.push(msg);
  }
}

// var storage = new MemoryStorage()
// storage.add(new Message("hello"))

module.exports = {
  MemoryStorage: MemoryStorage,
  Message      : Message
};
