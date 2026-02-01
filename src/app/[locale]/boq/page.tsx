"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BOQCalculator, type EstimateItem } from "@/components/boq/BOQCalculator";
import { EstimateTable } from "@/components/boq/EstimateTable";

export default function BOQPage() {
  const t = useTranslations("boq");

  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);

  const handleAddToEstimate = (item: EstimateItem) => {
    setEstimateItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setEstimateItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setEstimateItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("itemsCount")}: {estimateItems.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-1">
          <BOQCalculator onAddToEstimate={handleAddToEstimate} />
        </div>

        {/* Estimate Table */}
        <div className="lg:col-span-2">
          <EstimateTable
            items={estimateItems}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
}
