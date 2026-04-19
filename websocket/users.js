// users.js
const users = new Map(); // ws → { username, room }

function addUser(ws) {
  users.set(ws, { username: "guest", room: "lobby" });
}

function removeUser(ws) {
  users.delete(ws);
}

function getUser(ws) {
  return users.get(ws);
}

module.exports = { addUser, removeUser, getUser };