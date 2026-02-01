"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { getRiskColor, calculateRiskEMV } from "@/lib/calculations";
import { riskCategories } from "@/data/risk-catalog";

interface RiskCardProps {
  risk: {
    id: string;
    riskId: string;
    riskStatement: string;
    probability: number;
    impact: number;
    category: string;
    mitigationPlan?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RiskCard({ risk, onEdit, onDelete }: RiskCardProps) {
  const t = useTranslations("risks");
  const locale = useLocale();

  const { emv, category: riskCategory } = calculateRiskEMV(
    risk.probability,
    risk.impact
  );

  const categoryInfo = riskCategories.find((c) => c.id === risk.category);

  return (
    <Card
      className={`group hover:shadow-lg transition-shadow border-r-4 ${
        riskCategory === "high"
          ? "border-r-red-500"
          : riskCategory === "medium"
          ? "border-r-yellow-500"
          : "border-r-green-500"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold ${getRiskColor(
                riskCategory
              )}`}
            >
              {risk.riskId.replace("R", "")}
            </div>
            <div>
              <CardTitle className="text-sm font-bold">{risk.riskId}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {categoryInfo
                  ? locale === "ar"
                    ? categoryInfo.nameAr
                    : categoryInfo.nameEn
                  : risk.category}
              </p>
            </div>
          </div>
          <Badge
            variant={
              riskCategory === "high"
                ? "danger"
                : riskCategory === "medium"
                ? "warning"
                : "success"
            }
          >
            EMV: {emv.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk Statement */}
        <p className="text-sm">{risk.riskStatement}</p>

        {/* Probability & Impact */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-xs text-muted-foreground">{t("probability")}</p>
            <p className="font-bold">{(risk.probability * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-xs text-muted-foreground">{t("impact")}</p>
            <p className="font-bold">{(risk.impact * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Mitigation Plan */}
        {risk.mitigationPlan && (
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-xs text-muted-foreground mb-1">
              {t("mitigationPlan")}
            </p>
            <p>{risk.mitigationPlan}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            {t("editRisk")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
