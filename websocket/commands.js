// commands.js
const { joinRoom, broadcast } = require("./rooms");

function handleCommand(ws, cmd, users) {
  const user = users.getUser(ws);

  if (!user.username && !cmd.startsWith("login ")) {
  ws.send("Please login first");
  return;
}
  if (cmd.startsWith("login ")) {
  const name = cmd.slice(6).trim();
  const success = users.setUsername(ws, name);

  if (!success) {
    return; // 🚫 STOP
  }

  user.room = "lobby";
  ws.send(`Welcome, ${name}`);
  return;
}

  else if (cmd === "whoami") {
    ws.send(`You are ${user.username}`);
  }

  else if (cmd.startsWith("join ")) {
    const room = cmd.slice(5).trim();
    joinRoom(ws, room, users);
    ws.send(`Joined room: ${room}`);
  }

  else if (cmd.startsWith("say ")) {
    const message = cmd.slice(4);
    broadcast(ws, `${user.username}: ${message}`, users);
  }
  else if (cmd === "users") {
    const list = users.getUsersInRoom(user.room);
    ws.send(`Users in room: ${list.join(", ")}`);
  }
  else if (cmd.startsWith("pm ")) {
  const parts = cmd.split(" ");
  const targetName = parts[1];
  const message = parts.slice(2).join(" ");

  const targetWs = users.getWsByUsername(targetName);

  if (!targetWs || targetWs.readyState !== 1) {
  ws.send("User not available");
  return;
}

  targetWs.send(`(PM from ${user.username}): ${message}`);
}
  else {
    ws.send("unknown command");
  }
}

module.exports = { handleCommand };