import { app } from "./app.js";
import { initWebsocket } from "./services/websocket.service.js";
import { runCryptoConsumer } from "./consumers/cryptocurrencies.consumer.js";

const PORT = process.env.PORT || 8000;

const { server, broadcast } = initWebsocket(app);

runCryptoConsumer(broadcast).catch(console.error);

server.listen(PORT, () => {
  console.log(`Backend + WebSocket sur le port ${PORT}`);
});
