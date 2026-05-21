// routes/nfts.js
import express from "express";
import { getLatestNftSnapshots } from "../services/cryptocurrencies.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getLatestNftSnapshots());
  } catch (error) {
    console.error("Erreur récupération NFT:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

export const nftsRouter = router;
