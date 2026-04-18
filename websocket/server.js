const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });
const rooms = new Map();
wss.on("connection", (ws) => {
    ws.username = "guest";
    ws.room = "lobby";
  console.log("Client connected");

  ws.on("message", (message) => {
    const cmd = message.toString().trim();
    handleCommand(ws, cmd);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
function handleCommand(ws, cmd) {
  if (cmd.startsWith("login ")) {
    const name = cmd.slice(6);
    ws.username = name;
    ws.send(`Welcome, ${name}`);
  }

  else if (cmd === "whoami") {
    ws.send(`You are ${ws.username}`);
  }

  else if (cmd.startsWith("say ")) {
    const message = cmd.slice(4);
    const roomUsers = rooms.get(ws.room);

    if (!roomUsers) return;

  roomUsers.forEach((client) => {
    client.send(`${ws.username}: ${message}`);
  });
  }
  else if (cmd.startsWith("join ")) {
  const room = cmd.slice(5);

  // remove from old room
  if (rooms.has(ws.room)) {
    rooms.get(ws.room).delete(ws);
  }

  ws.room = room;

  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }

  rooms.get(room).add(ws);

  ws.send(`Joined room: ${room}`);
}

  else {
    ws.send("unknown command");
  }
}