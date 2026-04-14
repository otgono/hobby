const net = require("net");
const clients = new Set();
const server = net.createServer((socket) => {
  console.log("Client connected");
  clients.add(socket);

  socket.username = "guest";

  let buffer = "";

    socket.on("data", (chunk) => {
    buffer += chunk.toString();

    let lines = buffer.split("\n");

    buffer = lines.pop(); // keep unfinished part

    for (let line of lines) {
        handleCommand(socket, line.trim());
    }
    });

    function handleCommand(socket, cmd) {
    if (cmd.startsWith("login ")){
      const name = cmd.split(" ")[1];
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
      else {
    socket.write("unknown command\n");
  }
}

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