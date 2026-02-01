"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { calculateRiskEMV, getRiskColor } from "@/lib/calculations";
import { riskCatalog, riskCategories } from "@/data/risk-catalog";

interface RiskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RiskFormData) => void;
  initialData?: RiskFormData;
}

export interface RiskFormData {
  riskId: string;
  riskStatement: string;
  probability: number;
  impact: number;
  category: string;
  mitigationPlan: string;
}

export function RiskForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: RiskFormProps) {
  const t = useTranslations("risks");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [formData, setFormData] = useState<RiskFormData>(
    initialData || {
      riskId: "",
      riskStatement: "",
      probability: 0.5,
      impact: 0.5,
      category: "financial",
      mitigationPlan: "",
    }
  );

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const { emv, category: riskCategory } = calculateRiskEMV(
    formData.probability,
    formData.impact
  );

  useEffect(() => {
    if (selectedTemplate) {
      const template = riskCatalog.find((r) => r.id === selectedTemplate);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          riskId: template.id,
          riskStatement:
            locale === "ar" ? template.statementAr : template.statementEn,
          probability: template.defaultProbability,
          impact: template.defaultImpact,
          category: template.category,
        }));
      }
    }
  }, [selectedTemplate, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editRisk") : t("addRisk")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selector */}
          {!initialData && (
            <div className="space-y-2">
              <Label>اختر من القائمة (اختياري)</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر خطر من القائمة..." />
                </SelectTrigger>
                <SelectContent>
                  {riskCatalog.map((risk) => (
                    <SelectItem key={risk.id} value={risk.id}>
                      {risk.id}: {locale === "ar" ? risk.statementAr : risk.statementEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Risk ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="riskId">{t("riskId")}</Label>
              <Input
                id="riskId"
                value={formData.riskId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, riskId: e.target.value }))
                }
                placeholder="R18"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t("riskCategory")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riskCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {locale === "ar" ? cat.nameAr : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Risk Statement */}
          <div className="space-y-2">
            <Label htmlFor="statement">{t("riskStatement")}</Label>
            <Input
              id="statement"
              value={formData.riskStatement}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, riskStatement: e.target.value }))
              }
              required
            />
          </div>

          {/* Probability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("probability")}</Label>
              <span className="font-bold text-primary">
                {(formData.probability * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[formData.probability]}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, probability: value[0] }))
              }
              max={1}
              min={0}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("veryLow")}</span>
              <span>{t("veryHigh")}</span>
            </div>
          </div>

          {/* Impact */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("impact")}</Label>
              <span className="font-bold text-primary">
                {(formData.impact * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[formData.impact]}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, impact: value[0] }))
              }
              max={1}
              min={0}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("veryLow")}</span>
              <span>{t("veryHigh")}</span>
            </div>
          </div>

          {/* EMV Display */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold">{t("emv")}: </span>
                <span className="text-2xl font-bold">{emv.toFixed(2)}</span>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-sm font-bold text-white ${getRiskColor(
                  riskCategory
                )}`}
              >
                {riskCategory === "high"
                  ? t("highRisk")
                  : riskCategory === "medium"
                  ? t("mediumRisk")
                  : t("lowRisk")}
              </div>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div className="space-y-2">
            <Label htmlFor="mitigation">{t("mitigationPlan")}</Label>
            <textarea
              id="mitigation"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.mitigationPlan}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mitigationPlan: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit">{tCommon("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
