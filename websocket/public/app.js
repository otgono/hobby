const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const host = window.location.hostname || "localhost";
const wsPort = window.location.port === "3000" ? "4000" : (window.location.port || "4000");
const ws = new WebSocket(`${protocol}//${host}:${wsPort}`);

const input = document.getElementById("input");
const button = document.getElementById("send");
const log = document.getElementById("log");

function append(message) {
  log.textContent += `${message}\n`;
  log.scrollTop = log.scrollHeight;
}

ws.addEventListener("open", () => {
  append("Connected to chat");
});

ws.addEventListener("close", () => {
  append("Disconnected from chat");
});

ws.addEventListener("message", (event) => {
  append(event.data);
});

function send() {
  const value = input.value.trim();

  if (!value || ws.readyState !== WebSocket.OPEN) {
    return;
  }

  ws.send(value);
  input.value = "";
  input.focus();
}

button.addEventListener("click", send);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    send();
  }
});

window.send = send;
