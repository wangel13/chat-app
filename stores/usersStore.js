function User(name, ws, token) {
  return {
    name  : name,
    ws    : ws
  }
}

function UsersStorage() {
  var users = [];
  this.add = function(msg) {
    users.push(msg);
  }
  this.get = function() {
    return users;
  }
}

module.exports = {
  UsersStorage: UsersStorage,
  User        : User
};
