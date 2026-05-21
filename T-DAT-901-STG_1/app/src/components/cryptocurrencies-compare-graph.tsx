import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCryptocurrency } from "../hooks/use-cryptocurrency.tsx";
import { SkeletonGraph } from "./skeleton-graph.tsx";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ff0000", "#00bfff"];

type Period = "7d" | "30d" | "90d";

export function CryptocurrenciesCompareGraph() {
  const { selectedCryptocurrencies } = useCryptocurrency();
  const [period, setPeriod] = useState<Period>("90d");

  if (!selectedCryptocurrencies || selectedCryptocurrencies.length === 0)
    return <SkeletonGraph />;

  const now = new Date();
  let periodStart = new Date();
  switch (period) {
    case "7d":
      periodStart.setDate(now.getDate() - 7);
      break;
    case "30d":
      periodStart.setDate(now.getDate() - 30);
      break;
    case "90d":
      periodStart.setDate(now.getDate() - 90);
      break;
  }

  const timestampsSet = new Set(
    selectedCryptocurrencies.flatMap((c) =>
      c.data
        .filter((d) => new Date(d.ts_snapshot_utc) >= periodStart)
        .map((d) => new Date(d.ts_snapshot_utc).toISOString())
    )
  );
  const timestamps = Array.from(timestampsSet).sort();

  const chartData = timestamps.map((ts) => {
    const point: any = { ts };
    selectedCryptocurrencies.forEach((c) => {
      const match = c.data.find(
        (d) => new Date(d.ts_snapshot_utc).toISOString() === ts
      );
      point[c.symbol] = match ? match.price_usd : null;
    });
    return point;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full col-span-3"
    >
      <Card className="shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="px-4 py-4">
          {/* Légende */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {selectedCryptocurrencies.map((c, idx) => (
                <div key={c.symbol} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{c.symbol}</span>
                </div>
              ))}
            </div>
            <Select value={period} onValueChange={(v: Period) => setPeriod(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) =>
                  new Date(ts).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Tooltip
                labelFormatter={(ts) => new Date(ts).toLocaleString()}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              {selectedCryptocurrencies.map((c, idx) => (
                <Area
                  key={c.symbol}
                  dataKey={c.symbol}
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.2}
                  type="monotone"
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
