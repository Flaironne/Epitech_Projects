import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "backend",
  brokers: ["kafka:9092"],
});
