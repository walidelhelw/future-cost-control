"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashflowChart } from "@/components/cashflow/CashflowChart";
import { CashflowTable } from "@/components/cashflow/CashflowTable";
import { calculateNPV } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface CashflowPeriod {
  id: string;
  period: number;
  cashIn: number;
  cashOut: number;
  netCashflow: number;
  cumulative: number;
}

// Initial sample data
const initialPeriods: CashflowPeriod[] = [
  {
    id: "1",
    period: 0,
    cashIn: 0,
    cashOut: 5000000,
    netCashflow: -5000000,
    cumulative: -5000000,
  },
  {
    id: "2",
    period: 1,
    cashIn: 2000000,
    cashOut: 1000000,
    netCashflow: 1000000,
    cumulative: -4000000,
  },
  {
    id: "3",
    period: 2,
    cashIn: 3500000,
    cashOut: 1200000,
    netCashflow: 2300000,
    cumulative: -1700000,
  },
  {
    id: "4",
    period: 3,
    cashIn: 4000000,
    cashOut: 1500000,
    netCashflow: 2500000,
    cumulative: 800000,
  },
  {
    id: "5",
    period: 4,
    cashIn: 4500000,
    cashOut: 1800000,
    netCashflow: 2700000,
    cumulative: 3500000,
  },
];

export default function CashflowPage() {
  const t = useTranslations("cashflow");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [periods, setPeriods] = useState<CashflowPeriod[]>(initialPeriods);
  const [discountRate, setDiscountRate] = useState<number>(10);

  const formatValue = (value: number) =>
    formatCurrency(value, "EGP", locale === "ar" ? "ar-EG" : "en-US");

  // Calculations
  const calculations = useMemo(() => {
    const cashflows = periods.map((p) => p.netCashflow);
    const npv = calculateNPV(cashflows, discountRate / 100);
    const totalCashIn = periods.reduce((sum, p) => sum + p.cashIn, 0);
    const totalCashOut = periods.reduce((sum, p) => sum + p.cashOut, 0);
    const finalCumulative = periods.length > 0 ? periods[periods.length - 1].cumulative : 0;

    // Find break-even period
    let breakEvenPeriod = -1;
    for (let i = 0; i < periods.length; i++) {
      if (periods[i].cumulative >= 0 && (i === 0 || periods[i - 1].cumulative < 0)) {
        breakEvenPeriod = i;
        break;
      }
    }

    // Funding gap (minimum cumulative value)
    const fundingGap = Math.min(...periods.map((p) => p.cumulative));

    return {
      npv,
      totalCashIn,
      totalCashOut,
      finalCumulative,
      breakEvenPeriod,
      fundingGap: fundingGap < 0 ? Math.abs(fundingGap) : 0,
    };
  }, [periods, discountRate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("period")}: {periods.length}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("npv")}</p>
                <p
                  className={`text-xl font-bold ${
                    calculations.npv >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatValue(calculations.npv)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <TrendingDown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("fundingGap")}</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatValue(calculations.fundingGap)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  calculations.finalCumulative >= 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {calculations.finalCumulative >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("cumulative")}</p>
                <p
                  className={`text-xl font-bold ${
                    calculations.finalCumulative >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatValue(calculations.finalCumulative)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("discountRate")}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discountRate}
                    onChange={(e) =>
                      setDiscountRate(parseFloat(e.target.value) || 0)
                    }
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-xl font-bold text-blue-600">%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">{t("chart")}</TabsTrigger>
          <TabsTrigger value="table">{t("table")}</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>{t("chart")}</CardTitle>
            </CardHeader>
            <CardContent>
              {periods.length > 0 ? (
                <CashflowChart data={periods} />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {tCommon("noData")}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>{t("table")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CashflowTable periods={periods} onPeriodsChange={setPeriods} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("cashIn")}</p>
              <p className="text-2xl font-bold text-green-600">
                {formatValue(calculations.totalCashIn)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("cashOut")}</p>
              <p className="text-2xl font-bold text-red-600">
                {formatValue(calculations.totalCashOut)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "نقطة التعادل" : "Break-Even"}
              </p>
              <p className="text-2xl font-bold text-primary">
                {calculations.breakEvenPeriod >= 0
                  ? `${t("year")} ${calculations.breakEvenPeriod}`
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
