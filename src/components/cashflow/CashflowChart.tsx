"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CashflowPeriod {
  period: number;
  cashIn: number;
  cashOut: number;
  netCashflow: number;
  cumulative: number;
}

interface CashflowChartProps {
  data: CashflowPeriod[];
}

export function CashflowChart({ data }: CashflowChartProps) {
  const t = useTranslations("cashflow");
  const locale = useLocale();

  const chartData = data.map((period) => ({
    period: `${t("year")} ${period.period}`,
    [t("cashIn")]: period.cashIn,
    [t("cashOut")]: period.cashOut,
    [t("netCashflow")]: period.netCashflow,
    [t("cumulative")]: period.cumulative,
  }));

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={formatValue}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
                style: "currency",
                currency: "EGP",
              }).format(value)
            }
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
          <Line
            type="monotone"
            dataKey={t("cashIn")}
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey={t("cashOut")}
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey={t("cumulative")}
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
