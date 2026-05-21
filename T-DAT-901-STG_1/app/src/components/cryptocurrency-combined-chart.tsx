import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useCryptocurrency } from "../hooks/use-cryptocurrency.tsx";
import { Bitcoin } from "lucide-react";
import { SkeletonGraph } from "./skeleton-graph.tsx";

type Period = "7d" | "30d" | "90d";

export function CryptocurrencyCombinedChart() {
  const { focusedCryptocurrency } = useCryptocurrency();
  const [imgError, setImgError] = useState(false);
  const [period, setPeriod] = useState<Period>("30d");

  if (!focusedCryptocurrency) return <SkeletonGraph />;

  // Filtrer la période
  const data = focusedCryptocurrency.data.slice(
    -{
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }[period]
  );

  // Construire les données chart
  const chartData = data.map((d, idx) => {
    const prevPrice = idx > 0 ? data[idx - 1].price_usd : d.price_usd;
    return {
      date: new Date(d.ts_snapshot_utc).toLocaleDateString(),
      price: d.price_usd,
      volume: d.volume_24h_usd,
      volumeColor: d.price_usd >= prevPrice ? "#22c55e" : "#ef4444", // vert si prix en hausse, rouge sinon
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              {imgError || !focusedCryptocurrency.thumb_url ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bitcoin className="size-5 text-gray-400" />
                </div>
              ) : (
                <img
                  src={focusedCryptocurrency.thumb_url}
                  alt={focusedCryptocurrency.name}
                  className="w-8 h-8 rounded-full"
                  onError={() => setImgError(true)}
                />
              )}
              <h2 className="text-lg font-semibold">
                {focusedCryptocurrency.name} ({focusedCryptocurrency.symbol})
              </h2>
            </div>

            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "outline"}
                  onClick={() => setPeriod(p)}
                  className="rounded-xl"
                >
                  {p.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === "volume") return `$${(+value).toLocaleString()}`;
                  if (name === "price") return `$${(+value).toFixed(2)}`;
                  return value;
                }}
              />
              <Bar
                yAxisId="right"
                dataKey="volume"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                barSize={10}
                fillOpacity={0.6}
                // couleur dynamique
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.volumeColor}
                      rx={4}
                    />
                  );
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
