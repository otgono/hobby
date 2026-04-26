// rooms.js
const rooms = new Map();
const db = require("./db");

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

  db.all(
    "SELECT username, content FROM messages WHERE room = ? ORDER BY id DESC LIMIT 20",
    [room],
    (err, rows) => {
      if (err) {
        ws.send("Failed to load history");
        return;
      }

      rows.reverse().forEach(row => {
        ws.send(`[HISTORY] ${row.username}: ${row.content}`);
      });
    }
  );
}

function broadcast(ws, message, users) {
  const user = users.getUser(ws);
  const roomUsers = rooms.get(user.room);

  if (!roomUsers) return;

  db.run(
  "INSERT INTO messages (username, room, content) VALUES (?, ?, ?)",
  [user.username, user.room, message],
  (err) => {
    if (err) {
      console.error("DB error:", err);
    }
  }
);
  roomUsers.forEach(client => {
    if (client.readyState === 1) {
      client.send(`${user.username}: ${message}`);
    }
  });
}

module.exports = { joinRoom, broadcast };