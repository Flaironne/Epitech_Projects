import { useContext } from "react";
import { NFTContext } from "../contexts/nft-context.tsx";

export function useNFT() {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error("useNFT must be used within an NFTProvider");
  }
  return context;
}
