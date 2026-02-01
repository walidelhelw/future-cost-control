"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CashflowPeriod {
  id: string;
  period: number;
  cashIn: number;
  cashOut: number;
  netCashflow: number;
  cumulative: number;
}

interface CashflowTableProps {
  periods: CashflowPeriod[];
  onPeriodsChange: (periods: CashflowPeriod[]) => void;
}

export function CashflowTable({ periods, onPeriodsChange }: CashflowTableProps) {
  const t = useTranslations("cashflow");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const formatValue = (value: number) =>
    formatCurrency(value, "EGP", locale === "ar" ? "ar-EG" : "en-US");

  const handleAddPeriod = () => {
    const newPeriod = periods.length;
    const prevCumulative = periods.length > 0 ? periods[periods.length - 1].cumulative : 0;

    const newEntry: CashflowPeriod = {
      id: Date.now().toString(),
      period: newPeriod,
      cashIn: 0,
      cashOut: 0,
      netCashflow: 0,
      cumulative: prevCumulative,
    };

    onPeriodsChange([...periods, newEntry]);
  };

  const handleRemovePeriod = (id: string) => {
    const filtered = periods.filter((p) => p.id !== id);
    // Recalculate periods and cumulative
    let cumulative = 0;
    const updated = filtered.map((p, index) => {
      const netCashflow = p.cashIn - p.cashOut;
      cumulative += netCashflow;
      return {
        ...p,
        period: index,
        netCashflow,
        cumulative,
      };
    });
    onPeriodsChange(updated);
  };

  const handleValueChange = (
    id: string,
    field: "cashIn" | "cashOut",
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    let cumulative = 0;

    const updated = periods.map((p) => {
      if (p.id === id) {
        const newCashIn = field === "cashIn" ? numValue : p.cashIn;
        const newCashOut = field === "cashOut" ? numValue : p.cashOut;
        const netCashflow = newCashIn - newCashOut;
        cumulative += netCashflow;
        return {
          ...p,
          cashIn: newCashIn,
          cashOut: newCashOut,
          netCashflow,
          cumulative,
        };
      } else {
        cumulative += p.netCashflow;
        return { ...p, cumulative };
      }
    });

    // Recalculate all cumulative values after the change
    let runningCumulative = 0;
    const recalculated = updated.map((p) => {
      runningCumulative += p.netCashflow;
      return { ...p, cumulative: runningCumulative };
    });

    onPeriodsChange(recalculated);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-right p-2 font-medium">{t("period")}</th>
              <th className="text-right p-2 font-medium">{t("cashIn")}</th>
              <th className="text-right p-2 font-medium">{t("cashOut")}</th>
              <th className="text-right p-2 font-medium">{t("netCashflow")}</th>
              <th className="text-right p-2 font-medium">{t("cumulative")}</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <span className="font-medium">
                    {t("year")} {period.period}
                  </span>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={period.cashIn || ""}
                    onChange={(e) =>
                      handleValueChange(period.id, "cashIn", e.target.value)
                    }
                    className="w-32 text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={period.cashOut || ""}
                    onChange={(e) =>
                      handleValueChange(period.id, "cashOut", e.target.value)
                    }
                    className="w-32 text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <span
                    className={`font-medium ${
                      period.netCashflow >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatValue(period.netCashflow)}
                  </span>
                </td>
                <td className="p-2">
                  <span
                    className={`font-bold ${
                      period.cumulative >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {formatValue(period.cumulative)}
                  </span>
                </td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemovePeriod(period.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          {periods.length > 0 && (
            <tfoot>
              <tr className="bg-muted/50 font-bold">
                <td className="p-2">{tCommon("total")}</td>
                <td className="p-2 text-green-600">
                  {formatValue(periods.reduce((sum, p) => sum + p.cashIn, 0))}
                </td>
                <td className="p-2 text-red-600">
                  {formatValue(periods.reduce((sum, p) => sum + p.cashOut, 0))}
                </td>
                <td className="p-2">
                  {formatValue(periods.reduce((sum, p) => sum + p.netCashflow, 0))}
                </td>
                <td className="p-2">-</td>
                <td className="p-2"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <Button variant="outline" onClick={handleAddPeriod} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t("addPeriod")}
      </Button>
    </div>
  );
}
