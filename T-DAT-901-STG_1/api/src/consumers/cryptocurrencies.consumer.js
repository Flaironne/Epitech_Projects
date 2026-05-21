import { kafka } from "../config/kafka.js";
import { insertIntoDB } from "../services/cryptocurrencies.service.js";

export async function runCryptoConsumer(broadcast) {
  const consumer = kafka.consumer({ groupId: "backend-consumer" });

  await consumer.connect();
  await consumer.subscribe({ topic: "crypto.clean", fromBeginning: false });

  console.log("Cryptocurrency consumer is running...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      await insertIntoDB(data);
      broadcast(data);
    },
  });
}
