var messagesStore = require('../stores/messagesStore');

function Broadcast(clients, message, user) {
  var sendMessage = new messagesStore.Message(message.message, user);
  clients.get().forEach(function(item) {
    item.ws.send(JSON.stringify(sendMessage));
  })
  return sendMessage;
}

function BroadcastBot(clients, message) {
  botUser = {
     name: 'Bot'
  };
  Broadcast(clients,message,botUser)
}

module.exports = {
  Broadcast: Broadcast,
  BroadcastBot : BroadcastBot
};
