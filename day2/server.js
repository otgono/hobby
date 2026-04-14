const net = require("net");

const server = net.createServer((socket) => {
  console.log("Client connected");

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
  console.log("Command:", cmd);

  if (cmd === "ping") {
    socket.write("pong\n");
  }
  else if (cmd === "hello"){
    socket.write("lalraa\n");
  } else {
    socket.write("unknown command\n");
  }
}

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});