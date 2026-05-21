import { createContext, useState, useEffect, type ReactNode } from "react";
import { fetchLatestNFT } from "../services/nft-service.ts";

export type AssetType = "nft" | "crypto";

export type Asset = {
  asset_type: AssetType;
  rank: number;
  name: string;
  symbol: string;
  thumb_url: string;
  price_usd: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  top_tier_volume_usd: number;
  pct_change_24h: number;
  ts_snapshot_utc: string;
  justUpdated?: boolean;
  data: {
    price_usd: number;
    market_cap_usd: number;
    volume_24h_usd: number;
    top_tier_volume_usd: number;
    pct_change_24h: number;
    ts_snapshot_utc: string;
  }[];
};

type NFTContextType = {
  nfts: Asset[] | null;
  loading: boolean;
  updateAsset: (updated: Asset) => void;
};

export const NFTContext = createContext<NFTContextType | undefined>(undefined);

export function NFTProvider({ children }: { children: ReactNode }) {
  const [nfts, setNFTs] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function initialize() {
    setLoading(true);
    try {
      const latestNFT = await fetchLatestNFT();
      setNFTs(latestNFT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateAsset = (updated: Asset) => {
    setNFTs((prev) => {
      if (!prev) return [{ ...updated, justUpdated: true }];

      const index = prev.findIndex((a) => a.symbol === updated.symbol);
      if (index === -1) {
        return [...prev, { ...updated, justUpdated: true }];
      } else {
        const newArr = [...prev];
        newArr[index] = { ...newArr[index], ...updated, justUpdated: true };

        // Supprimer le flag après 2 secondes
        setTimeout(() => {
          setNFTs((current) => {
            const arr = [...current!];
            if (arr[index]) arr[index].justUpdated = false;
            return arr;
          });
        }, 2000);

        return newArr;
      }
    });
  };

  useEffect(() => {
    initialize();

    const ws = new WebSocket("ws://localhost:8000"); // change ton URL

    ws.onmessage = (event) => {
      try {
        const data: Asset = JSON.parse(event.data);
        if (data.asset_type !== "nft") return;
        console.log("Received websocket data:", data);
        updateAsset(data);
      } catch (err) {
        console.error("Error parsing websocket data", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <NFTContext.Provider value={{ nfts, loading, updateAsset }}>
      {children}
    </NFTContext.Provider>
  );
}
