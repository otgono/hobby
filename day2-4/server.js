const net = require("net");
const clients = new Set();
function handleCommand(socket, cmd) {
    if (cmd.startsWith("login ")){
      const name = cmd.split(" ").slice(1, 3).join(" ");
      socket.username = name;
      socket.write(`Welcome, ${name}!\n`);
    }
    else if (cmd === "whoami") {
      socket.write(`You are ${socket.username}\n`);
    }
    else if (cmd === "ping") {
    socket.write("pong\n");
  }
  else if (cmd.startsWith("say ")) {
  const message = cmd.slice(4);

  clients.forEach((client) => {
    client.write(`${socket.username}: ${message}\n`);
  });
}
else if (cmd === "quit" || cmd === "exit") {
  socket.end(); // 👈 THIS is the key
}
      else {
    socket.write("unknown command\n");
  }
}
 function handleData(socket, chunk, clients) {
  socket.buffer += chunk.toString();

  let lines = socket.buffer.split("\n");
  socket.buffer = lines.pop();

  for (let line of lines) {
    handleCommand(socket, line.trim(), clients);
  }
}
const server = net.createServer((socket) => {
  console.log("Client connected");
  clients.add(socket);

  socket.username = "guest";
  socket.buffer = "";
  socket.on("data", (chunk) => {
    handleData(socket, chunk, clients);
  });

  socket.on("end", () => {
    console.log(`Client ${socket.username} disconnected`);
  });
  socket.on("close", () => {
  clients.delete(socket);
});
});
server.listen(4000, () => {
  console.log("Server running on port 4000");
});