"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

export default function OrdersChart({
  data,
  color = "var(--brand)",
  name = "Orders",
  format,
}: {
  data: { label: string; value: number }[];
  color?: string;
  name?: string;
  format?: (value: number) => string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={tick}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={tick}
            tickFormatter={format}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            formatter={(v) => (format ? format(Number(v)) : String(v))}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--card-foreground)",
            }}
          />
          <Bar
            dataKey="value"
            name={name}
            fill={color}
            radius={[8, 8, 0, 0]}
            maxBarSize={56}
            label={{
              position: "top",
              fill: "var(--muted-foreground)",
              fontSize: 12,
              formatter: (v: unknown) =>
                format ? format(Number(v)) : String(v),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
