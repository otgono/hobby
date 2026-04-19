// rooms.js
const rooms = new Map();

function joinRoom(ws, room, users) {
  const user = users.getUser(ws);

  // leave old
  if (rooms.has(user.room)) {
    rooms.get(user.room).delete(ws);
  }

  user.room = room;

  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }

  rooms.get(room).add(ws);
}

function broadcast(ws, message, users) {
  const user = users.getUser(ws);
  const roomUsers = rooms.get(user.room);

  if (!roomUsers) return;

  roomUsers.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

module.exports = { joinRoom, broadcast };