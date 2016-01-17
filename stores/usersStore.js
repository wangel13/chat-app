function User(name, token) {
  return {
    name  : name,
    token : token
  }
}

function UsersStorage() {
  var users = [];
  this.add = function(msg) {
    messages.push(msg);
  }
}

module.exports = {
  UsersStorage: UsersStorage,
  User        : Message
};
