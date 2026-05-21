import { LogsProvider } from "../contexts/logs-context.tsx";
import { LogsAnalysis } from "./logs-analysis.tsx";

export function Footer() {
  return (
    <footer className="p-12 text-white text-center flex flex-col">
      <span className="text-gray-800">
        {" "}
        &copy; 2025 <span className="text-[#3b82f6]">Cryptoviz</span>. All
        rights reserved.
      </span>

      <LogsProvider>
        <LogsAnalysis />
      </LogsProvider>
    </footer>
  );
}
