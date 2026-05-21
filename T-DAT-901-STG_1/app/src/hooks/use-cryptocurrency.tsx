import { useContext } from "react";
import { CryptocurrencyContext } from "../contexts/cryptocurrency-context.tsx";

export function useCryptocurrency() {
  const context = useContext(CryptocurrencyContext);
  if (!context)
    throw new Error(
      "useCryptocurrency doit être utilisé dans un CryptocurrencyProvider"
    );
  return context;
}
