"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, FileDown, ClipboardList } from "lucide-react";
import { type EstimateItem } from "./BOQCalculator";
import { formatCurrency } from "@/lib/utils";

interface EstimateTableProps {
  items: EstimateItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function EstimateTable({
  items,
  onRemoveItem,
  onClearAll,
}: EstimateTableProps) {
  const t = useTranslations("boq");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const totals = items.reduce(
    (acc, item) => ({
      directValue: acc.directValue + item.directValue,
      indirectValue: acc.indirectValue + item.indirectValue,
      markup: acc.markup + item.markup,
      grandTotal: acc.grandTotal + item.grandTotal,
    }),
    { directValue: 0, indirectValue: 0, markup: 0, grandTotal: 0 }
  );

  const formatValue = (value: number) =>
    formatCurrency(value, "EGP", locale === "ar" ? "ar-EG" : "en-US");

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{tCommon("noData")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar"
              ? "أضف بنود من الحاسبة لبدء التقدير"
              : "Add items from the calculator to start estimating"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          {t("estimateSummary")}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            {tCommon("exportExcel")}
          </Button>
          <Button variant="outline" size="sm" onClick={onClearAll}>
            {t("clearAll")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2 font-medium">#</th>
                <th className="text-right p-2 font-medium">
                  {locale === "ar" ? "البند" : "Item"}
                </th>
                <th className="text-right p-2 font-medium">{tCommon("unit")}</th>
                <th className="text-right p-2 font-medium">
                  {tCommon("quantity")}
                </th>
                <th className="text-right p-2 font-medium">{t("directCost")}</th>
                <th className="text-right p-2 font-medium">
                  {t("indirectCost")}
                </th>
                <th className="text-right p-2 font-medium">{t("markup")}</th>
                <th className="text-right p-2 font-medium">{t("grandTotal")}</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 text-muted-foreground">{index + 1}</td>
                  <td className="p-2">
                    {locale === "ar" ? item.nameAr : item.nameEn}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {locale === "ar" ? item.unitAr : item.unit}
                  </td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{formatValue(item.directValue)}</td>
                  <td className="p-2 text-muted-foreground">
                    {formatValue(item.indirectValue)}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {formatValue(item.markup)}
                  </td>
                  <td className="p-2 font-medium">{formatValue(item.grandTotal)}</td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-bold">
                <td colSpan={4} className="p-2 text-right">
                  {tCommon("total")}
                </td>
                <td className="p-2">{formatValue(totals.directValue)}</td>
                <td className="p-2">{formatValue(totals.indirectValue)}</td>
                <td className="p-2">{formatValue(totals.markup)}</td>
                <td className="p-2 text-primary">{formatValue(totals.grandTotal)}</td>
                <td className="p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("itemsCount")}</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("directCost")}</p>
            <p className="text-lg font-bold text-blue-600">
              {formatValue(totals.directValue)}
            </p>
          </div>
          <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              {t("indirectCost")} + {t("markup")}
            </p>
            <p className="text-lg font-bold text-yellow-600">
              {formatValue(totals.indirectValue + totals.markup)}
            </p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-3 text-center">
            <p className="text-xs text-muted-foreground">{t("grandTotal")}</p>
            <p className="text-lg font-bold text-green-600">
              {formatValue(totals.grandTotal)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
