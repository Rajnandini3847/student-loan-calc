"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { YearSummary } from "@/lib/loan";
import { fmtINR } from "@/lib/loan";

export function YearlyChart({ yearly }: { yearly: YearSummary[] }) {
  const data = yearly.map((y) => ({
    year: `Y${y.year}`,
    phase: y.phase,
    principal: Math.round(y.principalPaid),
    interest: Math.round(y.interestPaid),
    accrued: Math.round(y.interestAccrued),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6E6A60" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 10, fill: "#6E6A60" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${v / 1000}k`)}
          width={45}
        />
        <Tooltip
          contentStyle={{
            background: "#FBF8F1",
            border: "1px solid #E6DFD0",
            fontSize: 12,
            borderRadius: 6,
          }}
          formatter={(v: number, name: string) => [fmtINR(v), labelFor(name)]}
          labelFormatter={(year: string) => `Year ${year.replace("Y", "")}`}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          formatter={(v: string) => labelFor(v)}
        />
        <Bar dataKey="principal" stackId="paid" fill="#1E5F3F" name="principal" />
        <Bar dataKey="interest" stackId="paid" fill="#C46A4B" name="interest" />
        <Bar dataKey="accrued" fill="#E6DFD0" name="accrued">
          {data.map((d, i) => (
            <Cell key={i} fillOpacity={d.accrued > 0 ? 1 : 0} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function labelFor(key: string): string {
  switch (key) {
    case "principal":
      return "Principal paid";
    case "interest":
      return "Interest paid";
    case "accrued":
      return "Interest accrued (moratorium)";
    default:
      return key;
  }
}
