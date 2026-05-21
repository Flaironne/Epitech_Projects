import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog.tsx";
import { useLogs } from "../hooks/use-logs.tsx";

export function LogsAnalysis() {
  const { logs } = useLogs();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-gray-800">see analysis logs</span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>Analysis Logs</DialogHeader>
        <div className="max-h-[400px] overflow-y-auto mt-4">
          {logs.length === 0 ? (
            <p className="text-gray-600">No logs available.</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((log, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {log.type} - {log.message} (
                  {log.failed_at ? `Failed at: ${log.failed_at}` : "Success"} on{" "}
                  {new Date(log.created_at).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
