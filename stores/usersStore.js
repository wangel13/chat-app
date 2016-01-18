function User(user) {
  return {
    name      : user.name,
    createdAt : new Date()
  }
}

function UsersStorage() {
  var users = [{
    name: 'Bot'
  }];
  this.add = function(msg) {
    users.push(msg);
  }
  this.get = function() {
    return users;
  }
  this.remove = function(user) {
    users = users.filter(function(obj) {
      return obj.name !== user.name;
    });
  }
}

module.exports = {
  UsersStorage: UsersStorage,
  User        : User
};
