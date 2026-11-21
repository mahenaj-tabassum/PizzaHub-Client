"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export type DonutSlice = { name: string; value: number; color: string };

export default function StatusDonut({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
      <div className="relative size-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.filter((d) => d.value > 0)}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={2}
              stroke="none"
            >
              {data
                .filter((d) => d.value > 0)
                .map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-bold">
          {total}
        </span>
      </div>

      <ul className="space-y-2.5 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: d.color }}
            />
            {d.name} {d.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
