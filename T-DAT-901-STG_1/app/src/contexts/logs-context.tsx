import { createContext, useState, useEffect, type ReactNode } from "react";
import { fetchLogs } from "../services/logs-service.ts";

type Log = {
  type: string;
  message: string;
  failed_at: string | null;
  created_at: string;
};

type LogsContextType = {
  logs: Log[];
  loading: boolean;
};

export const LogsContext = createContext<LogsContextType | undefined>(
  undefined
);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  async function initialize() {
    setLoading(true);
    try {
      const fetchedLogs = await fetchLogs();
      setLogs(fetchedLogs);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  return (
    <LogsContext.Provider value={{ logs, loading }}>
      {children}
    </LogsContext.Provider>
  );
}
