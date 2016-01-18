function User(user) {
  return {
    name      : user.name,
    createdAt : new Date()
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
