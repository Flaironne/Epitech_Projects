import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Asset } from "./nft-context.tsx";

type CryptocurrencyContextType = {
  selectedCryptocurrencies: Asset[];
  toggleSelectedCryptocurrency: (cryptocurrency: Asset) => void;
  focusedCryptocurrency: Asset | null;
  cryptocurrencies: Asset[];
};

export const CryptocurrencyContext = createContext<
  CryptocurrencyContextType | undefined
>(undefined);

export function CryptocurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCryptocurrencies, setSelectedCryptocurrencies] = useState<
    Asset[]
  >([]);
  const [focusedCryptocurrency, setFocusedCryptocurrency] =
    useState<Asset | null>(null);
  const [cryptocurrencies, setCryptocurrencies] = useState<Asset[]>([]);

  function updateAsset(updated: Asset) {
    setCryptocurrencies((prev) => {
      if (!prev) return [{ ...updated, justUpdated: true }];

      const index = prev.findIndex((a) => a.symbol === updated.symbol);
      if (index === -1) {
        return [...prev, { ...updated, justUpdated: true, data: [updated] }];
      } else {
        const newArr = [...prev];
        const existing = newArr[index];

        // Ajouter la nouvelle valeur dans data
        existing.data.push({
          price_usd: updated.price_usd,
          market_cap_usd: updated.market_cap_usd,
          volume_24h_usd: updated.volume_24h_usd,
          top_tier_volume_usd: updated.top_tier_volume_usd,
          pct_change_24h: updated.pct_change_24h,
          ts_snapshot_utc: updated.ts_snapshot_utc,
        });

        // Mettre à jour l'asset et flag justUpdated
        newArr[index] = { ...existing, ...updated, justUpdated: true };

        // Supprimer le flag après 2 secondes
        setTimeout(() => {
          setCryptocurrencies((current) => {
            const arr = [...current!];
            if (arr[index]) arr[index].justUpdated = false;
            return arr;
          });
        }, 2000);

        // Si c’est le focused, on met à jour aussi
        if (focusedCryptocurrency?.symbol === updated.symbol) {
          setFocusedCryptocurrency({
            ...existing,
            ...updated,
            justUpdated: true,
          });
        }

        return newArr;
      }
    });
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onmessage = (event) => {
      try {
        const data: Asset = JSON.parse(event.data);
        if (data.asset_type !== "crypto") return;
        updateAsset(data);
      } catch (err) {
        console.error("Error parsing websocket data", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const res = await fetch("http://localhost:8000/api/cryptocurrencies");
        const allData: Asset[] = await res.json();

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const recentData = allData.filter(
          (c) => new Date(c.ts_snapshot_utc) >= threeMonthsAgo
        );

        const grouped: Record<string, any> = {};
        recentData.forEach((c) => {
          if (!grouped[c.symbol]) {
            grouped[c.symbol] = {
              asset_type: c.asset_type,
              rank: c.rank,
              name: c.name,
              symbol: c.symbol,
              thumb_url: c.thumb_url,
              justUpdated: false,
              data: [],
            };
          }

          grouped[c.symbol].data.push({
            price_usd: c.price_usd,
            market_cap_usd: c.market_cap_usd,
            volume_24h_usd: c.volume_24h_usd,
            top_tier_volume_usd: c.top_tier_volume_usd,
            pct_change_24h: c.pct_change_24h,
            ts_snapshot_utc: c.ts_snapshot_utc,
          });
        });

        Object.values(grouped).forEach((crypto) => {
          crypto.data.sort(
            (a: any, b: any) =>
              new Date(a.ts_snapshot_utc).getTime() -
              new Date(b.ts_snapshot_utc).getTime()
          );
        });

        const groupedArray = Object.values(grouped);

        if (!groupedArray || groupedArray.length === 0) return;

        if (groupedArray.length > 0) setFocusedCryptocurrency(groupedArray[0]);

        setSelectedCryptocurrencies([groupedArray[0]]);

        setCryptocurrencies(groupedArray);
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies:", error);
      }
    }

    const ws = new WebSocket("ws://localhost:8000");

    ws.onmessage = (event) => {
      try {
        const data: Asset = JSON.parse(event.data);
        if (data.asset_type !== "crypto") return;
        console.log("Received websocket data:", data);
        updateAsset(data);
      } catch (err) {
        console.error("Error parsing websocket data", err);
      }
    };

    initialize();

    return () => {
      ws.close();
    };
  }, []);

  function toggleSelectedCryptocurrency(cryptocurrency: Asset) {
    setFocusedCryptocurrency((prevFocused) => {
      const isSelected = selectedCryptocurrencies.some(
        (c) => c.symbol === cryptocurrency.symbol
      );
      if (isSelected) {
        if (prevFocused?.symbol === cryptocurrency.symbol) {
          return (
            selectedCryptocurrencies.filter(
              (c) => c.symbol !== cryptocurrency.symbol
            )[0] || null
          );
        }
        return prevFocused;
      } else {
        return cryptocurrency;
      }
    });

    setSelectedCryptocurrencies((prevSelected) => {
      const isSelected = prevSelected.some(
        (c) => c.symbol === cryptocurrency.symbol
      );
      if (isSelected) {
        if (focusedCryptocurrency?.symbol === cryptocurrency.symbol) {
          setFocusedCryptocurrency(
            prevSelected.filter((c) => c.symbol !== cryptocurrency.symbol)[0] ||
              null
          );
        }
        return prevSelected.filter((c) => c.symbol !== cryptocurrency.symbol);
      } else {
        return [...prevSelected, cryptocurrency];
      }
    });
  }

  return (
    <CryptocurrencyContext.Provider
      value={{
        selectedCryptocurrencies,
        toggleSelectedCryptocurrency,
        focusedCryptocurrency,
        cryptocurrencies,
      }}
    >
      {children}
    </CryptocurrencyContext.Provider>
  );
}
