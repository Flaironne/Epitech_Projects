import express from "express";
import { cryptocurrenciesRouter } from "./routes/cryptocurrencies.routes.js";
import { logsRouter } from "./routes/logs.routes.js";
import cors from "cors";
import { nftsRouter } from "./routes/nfts.routes.js";

export const app = express();

app.use(cors());

app.use("/api/cryptocurrencies", cryptocurrenciesRouter);
app.use("/api/logs", logsRouter);
app.use("/api/nfts", nftsRouter);
