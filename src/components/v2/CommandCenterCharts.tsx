"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { aiSpendData, cashflowData, varianceData } from "./data";
import type { V2Locale } from "./localize";

type CommandCenterChartsProps = {
  locale: V2Locale;
};

export function CommandCenterCharts({ locale }: CommandCenterChartsProps) {
  const charts = [
    {
      title: locale === "ar" ? "اتجاه فرق التكلفة" : "Variance trend",
      node: (
        <LineChart data={varianceData}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
          <YAxis stroke="#64748b" tickLine={false} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" }} />
          <Line dataKey="variance" stroke="#00d4d4" strokeWidth={2} type="monotone" />
          <Line dataKey="forecast" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} type="monotone" />
        </LineChart>
      ),
    },
    {
      title: locale === "ar" ? "احتراق التدفق النقدي" : "Cashflow burn",
      node: (
        <AreaChart data={cashflowData}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
          <YAxis stroke="#64748b" tickLine={false} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" }} />
          <Area dataKey="planned" fill="#00d4d433" stroke="#00d4d4" type="monotone" />
          <Area dataKey="actual" fill="#f59e0b33" stroke="#f59e0b" type="monotone" />
        </AreaChart>
      ),
    },
    {
      title: locale === "ar" ? "تكلفة الذكاء الاصطناعي" : "AI cost burn",
      node: (
        <BarChart data={aiSpendData}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="day" stroke="#64748b" tickLine={false} />
          <YAxis stroke="#64748b" tickLine={false} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" }} />
          <Bar dataKey="spend" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      ),
    },
  ];

  return (
    <section className="grid gap-3 xl:grid-cols-3">
      {charts.map((chart) => (
        <div className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm" key={chart.title}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-950">{chart.title}</h3>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
              {locale === "ar" ? "مباشر" : "LIVE"}
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer height="100%" width="100%">
              {chart.node}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </section>
  );
}
