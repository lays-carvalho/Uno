const WebSocket = require("ws");

let players = []; // lista de jogadores conectados

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  // Enviar mensagem para todos os clientes
  function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  wss.on("connection", (ws) => {
    console.log("Novo cliente conectado!");

    ws.on("message", (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        return;
      }

      if (data.action === "join") {
        players.push(data.playerName);

        broadcast({
          message: `${data.playerName} has joined the game.`,
          players,
        });
      }

      if (data.action === "leave") {
        players = players.filter(p => p !== data.playerName);

        broadcast({
          message: `${data.playerName} has left the game.`,
          players,
        });
      }
    });

    ws.on("close", () => {
      console.log("Cliente desconectado!");
    });
  });

  console.log("WebSocket Server pronto");
}

module.exports = initWebSocket;
