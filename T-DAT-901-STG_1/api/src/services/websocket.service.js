import { WebSocketServer } from "ws";
import http from "http";

export function initWebsocket(app) {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  function broadcast(data) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }

  return { server, broadcast };
}
