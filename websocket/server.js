// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { handleCommand } = require("./commands");
const users = require("./users");

const WS_PORT = Number(process.env.WS_PORT) || 4000;
const HTTP_PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  const route = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(publicDir, route);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const types = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
    };

    res.writeHead(200, {
      "Content-Type": types[ext] || "text/plain; charset=utf-8",
    });
    res.end(data);
  });
});

server.listen(HTTP_PORT, () => {
  console.log(`HTTP server running at http://localhost:${HTTP_PORT}`);
});

const wss = new WebSocket.Server({ port: WS_PORT });

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

console.log(`WebSocket server running at ws://localhost:${WS_PORT}`);
