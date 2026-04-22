// server.js
const WebSocket = require("ws");
const { handleCommand } = require("./commands");
const users = require("./users");

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  users.addUser(ws);

  ws.on("message", (message) => {
    const cmd = message.toString().trim();
    handleCommand(ws, cmd, users);
  });

  ws.on("close", () => {
    users.removeUser(ws);
    console.log("Client disconnected");
  });
});