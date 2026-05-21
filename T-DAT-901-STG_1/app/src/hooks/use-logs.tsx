import { useContext } from "react";
import { LogsContext } from "../contexts/logs-context.tsx";

export function useLogs() {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error("useLogs must be used within a LogsProvider");
  }
  return context;
}
