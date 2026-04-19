// commands.js
const { joinRoom, broadcast } = require("./rooms");

function handleCommand(ws, cmd, users) {
  const user = users.getUser(ws);

  if (cmd.startsWith("login ")) {
    const name = cmd.slice(6).trim();
    user.username = name;
    ws.send(`Welcome, ${name}`);
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

  else {
    ws.send("unknown command");
  }
}

module.exports = { handleCommand };