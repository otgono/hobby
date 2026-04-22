// users.js
const users = new Map(); // ws → { username, room }
const nameToWs = new  Map(); // username → ws

function addUser(ws) {
  users.set(ws, { username: null, room: null });
}

function removeUser(ws) { 
  const user = users.get(ws);
  if (user) {   
    nameToWs.delete(user.username);
  }
  users.delete(ws);
}

function setUsername(ws, username) {
  const user = users.get(ws);
  if (!user) return;

   if (nameToWs.has(username)) {
    ws.send("Username already taken. Try another.");
    return;
  }
  nameToWs.delete(user.username);

  user.username = username;
  nameToWs.set(username, ws);

  return true;
}

function getUser(ws) {
  return users.get(ws);
}

function getWsByUsername(username) {
  return nameToWs.get(username);
}

function getUsersInRoom(room) {
  const result = [];
  for(let [ws, user] of users.entries()) {
    if (user.room === room) {
      result.push(user.username);
  }
}

return result;
}

module.exports = { addUser, removeUser, getUser, setUsername, getWsByUsername, getUsersInRoom };