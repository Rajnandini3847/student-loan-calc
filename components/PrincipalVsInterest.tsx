"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fmtINR } from "@/lib/loan";

export function PrincipalVsInterest({
  principal,
  interest,
}: {
  principal: number;
  interest: number;
}) {
  const data = [
    { name: "Principal (what you borrowed)", value: Math.round(principal), fill: "#1E5F3F" },
    { name: "Interest (the bank's cut)", value: Math.round(interest), fill: "#C46A4B" },
  ];
  const total = principal + interest;
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="92%"
            stroke="#FBF8F1"
            strokeWidth={2}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#FBF8F1",
              border: "1px solid #E6DFD0",
              fontSize: 12,
              borderRadius: 6,
            }}
            formatter={(v: number) => [
              `${fmtINR(v)}  (${total ? ((v / total) * 100).toFixed(1) : 0}%)`,
              "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-3 grid grid-cols-1 gap-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-muted">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ background: d.fill }}
            />
            <span className="text-ink">{d.name}</span>
            <span className="ml-auto font-mono">{fmtINR(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
