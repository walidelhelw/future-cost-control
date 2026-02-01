"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calculator, RefreshCw } from "lucide-react";
import { calculateBOQ, BOQ_PERCENTAGES } from "@/lib/calculations";
import { boqCategories, boqItems, getItemsByCategory, getItemById } from "@/data/boq-items";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface BOQCalculatorProps {
  onAddToEstimate: (item: EstimateItem) => void;
}

export interface EstimateItem {
  id: string;
  itemId: string;
  nameAr: string;
  nameEn: string;
  unit: string;
  unitAr: string;
  quantity: number;
  directCost: number;
  directValue: number;
  indirectValue: number;
  totalBeforeMarkup: number;
  markup: number;
  grandTotal: number;
}

export function BOQCalculator({ onAddToEstimate }: BOQCalculatorProps) {
  const t = useTranslations("boq");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return getItemsByCategory(selectedCategory);
  }, [selectedCategory]);

  const selectedItemData = useMemo(() => {
    if (!selectedItem) return null;
    return getItemById(selectedItem);
  }, [selectedItem]);

  const calculation = useMemo(() => {
    if (!selectedItemData || !quantity || parseFloat(quantity) <= 0) return null;
    return calculateBOQ(selectedItemData.directCost, parseFloat(quantity));
  }, [selectedItemData, quantity]);

  const handleAddToEstimate = () => {
    if (!selectedItemData || !calculation || !quantity) return;

    const item: EstimateItem = {
      id: Date.now().toString(),
      itemId: selectedItemData.id,
      nameAr: selectedItemData.nameAr,
      nameEn: selectedItemData.nameEn,
      unit: selectedItemData.unit,
      unitAr: selectedItemData.unitAr,
      quantity: parseFloat(quantity),
      directCost: selectedItemData.directCost,
      ...calculation,
    };

    onAddToEstimate(item);

    // Reset form
    setQuantity("");
    setSelectedItem("");
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedItem("");
    setQuantity("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label>{t("selectCategory")}</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedItem("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {boqCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {locale === "ar" ? cat.nameAr : cat.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Item Selection */}
        {selectedCategory && (
          <div className="space-y-2">
            <Label>{t("selectItem")}</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectItem")} />
              </SelectTrigger>
              <SelectContent>
                {categoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {locale === "ar" ? item.nameAr : item.nameEn} (
                    {locale === "ar" ? item.unitAr : item.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected Item Details */}
        {selectedItemData && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tCommon("unit")}:</span>
              <span className="font-medium">
                {locale === "ar" ? selectedItemData.unitAr : selectedItemData.unit}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">
                {t("directCost")}/{tCommon("unit")}:
              </span>
              <span className="font-medium">
                {formatCurrency(selectedItemData.directCost, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
              </span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        {selectedItemData && (
          <div className="space-y-2">
            <Label>{t("enterQuantity")}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`${tCommon("quantity")} (${
                locale === "ar" ? selectedItemData.unitAr : selectedItemData.unit
              })`}
            />
          </div>
        )}

        {/* Calculation Results */}
        {calculation && (
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <h4 className="font-semibold">{t("calculate")}</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("directCost")}</span>
                <span className="font-medium">
                  {formatCurrency(calculation.directValue, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {t("indirectCost")} ({t("percentages.indirect")})
                </span>
                <span>
                  {formatCurrency(calculation.indirectValue, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span>{locale === "ar" ? "الإجمالي قبل الهامش" : "Total Before Markup"}</span>
                <span className="font-medium">
                  {formatCurrency(calculation.totalBeforeMarkup, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {t("markup")} ({t("percentages.markup")})
                </span>
                <span>
                  {formatCurrency(calculation.markup, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg">
                <span className="font-bold">{t("grandTotal")}</span>
                <span className="font-bold text-primary">
                  {formatCurrency(calculation.grandTotal, "EGP", locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Percentages Reference */}
        <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">
            {locale === "ar" ? "النسب المستخدمة:" : "Applied Percentages:"}
          </p>
          <ul className="space-y-1">
            <li>
              • {t("indirectCost")}: {(BOQ_PERCENTAGES.indirect * 100).toFixed(2)}%
            </li>
            <li>
              • {t("netProfit")}: {(BOQ_PERCENTAGES.netProfit * 100).toFixed(0)}%
            </li>
            <li>
              • {t("markup")}: {(BOQ_PERCENTAGES.markup * 100).toFixed(0)}%
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToEstimate}
            disabled={!calculation}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addToEstimate")}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
