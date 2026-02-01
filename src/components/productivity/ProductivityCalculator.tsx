"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Calculator, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CrewComposition } from "./CrewComposition";
import { ConditionFactorSelector } from "./ConditionFactorSelector";
import { calculateProductivityCost, estimateCompletionDate, analyzeConditionImpact } from "@/lib/calculations";
import { getCrewRoleByCode } from "@/data/crew-roles";
import { productivityTemplates, getTemplateById, type ProductivityTemplate } from "@/data/productivity-templates";
import { conditionFactors, getFactorById, type ConditionFactor } from "@/data/condition-factors";

interface ProductivityCalculatorProps {
  initialTemplateId?: string;
  onCalculate?: (result: ProductivityResult) => void;
  className?: string;
}

export interface ProductivityResult {
  templateId: string;
  quantity: number;
  daysRequired: number;
  totalLaborCost: number;
  dailyCrewCost: number;
  appliedFactors: string[];
  combinedFactor: number;
}

/**
 * Calculator for productivity-based labor cost estimation
 *
 * Allows users to:
 * 1. Select a productivity template
 * 2. Enter quantity of work
 * 3. Apply condition factors
 * 4. See calculated days, cost, and completion date
 */
export function ProductivityCalculator({
  initialTemplateId,
  onCalculate,
  className
}: ProductivityCalculatorProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId ?? "");
  const [quantity, setQuantity] = useState<string>("");
  const [selectedFactorIds, setSelectedFactorIds] = useState<string[]>([]);

  const selectedTemplate = useMemo(() => {
    return selectedTemplateId ? getTemplateById(selectedTemplateId) : null;
  }, [selectedTemplateId]);

  const selectedFactors = useMemo(() => {
    return selectedFactorIds
      .map(id => getFactorById(id))
      .filter((f): f is ConditionFactor => f !== undefined);
  }, [selectedFactorIds]);

  const calculation = useMemo(() => {
    if (!selectedTemplate || !quantity || parseFloat(quantity) <= 0) return null;

    return calculateProductivityCost(
      selectedTemplate,
      parseFloat(quantity),
      getCrewRoleByCode,
      selectedFactors
    );
  }, [selectedTemplate, quantity, selectedFactors]);

  const conditionImpact = useMemo(() => {
    if (selectedFactors.length === 0) return null;
    return analyzeConditionImpact(selectedFactors);
  }, [selectedFactors]);

  const completionDate = useMemo(() => {
    if (!calculation) return null;
    return estimateCompletionDate(calculation.daysRequired);
  }, [calculation]);

  const handleFactorToggle = (factorId: string) => {
    setSelectedFactorIds(prev =>
      prev.includes(factorId)
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    );
  };

  const handleCalculate = () => {
    if (!calculation || !selectedTemplate) return;

    onCalculate?.({
      templateId: selectedTemplate.id,
      quantity: parseFloat(quantity),
      daysRequired: calculation.daysRequired,
      totalLaborCost: calculation.totalLaborCost,
      dailyCrewCost: calculation.dailyCrewCost,
      appliedFactors: selectedFactorIds,
      combinedFactor: calculation.combinedFactor
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {isArabic ? "حاسبة الإنتاجية" : "Productivity Calculator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label>{isArabic ? "اختر نوع العمل" : "Select Work Type"}</Label>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder={isArabic ? "اختر نوع العمل" : "Select work type"} />
            </SelectTrigger>
            <SelectContent>
              {productivityTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {isArabic ? template.nameAr : (template.nameEn ?? template.nameAr)}
                  {" "}({template.unitAr})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isArabic ? "معدل الإنتاجية" : "Productivity Rate"}
              </span>
              <span className="font-medium">
                {formatNumber(selectedTemplate.productivityRate, isArabic ? "ar-EG" : "en-US")} {selectedTemplate.unitAr}/
                {isArabic ? "يوم" : "day"}
              </span>
            </div>
            <CrewComposition crew={selectedTemplate.crew} showCost compact />
          </div>
        )}

        {/* Quantity Input */}
        {selectedTemplate && (
          <div className="space-y-2">
            <Label>{isArabic ? "الكمية" : "Quantity"}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`${isArabic ? "أدخل الكمية" : "Enter quantity"}`}
                className="flex-1"
              />
              <span className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                {selectedTemplate.unitAr}
              </span>
            </div>
          </div>
        )}

        {/* Condition Factors */}
        {selectedTemplate && (
          <ConditionFactorSelector
            selectedIds={selectedFactorIds}
            onToggle={handleFactorToggle}
          />
        )}

        {/* Condition Impact Warning */}
        {conditionImpact && conditionImpact.impactLevel !== 'none' && (
          <div className={cn(
            "flex items-start gap-3 rounded-lg p-3",
            conditionImpact.impactLevel === 'severe' ? "bg-red-500/10" :
            conditionImpact.impactLevel === 'high' ? "bg-orange-500/10" :
            conditionImpact.impactLevel === 'medium' ? "bg-yellow-500/10" :
            "bg-blue-500/10"
          )}>
            <AlertTriangle className={cn(
              "h-5 w-5 mt-0.5",
              conditionImpact.impactLevel === 'severe' ? "text-red-500" :
              conditionImpact.impactLevel === 'high' ? "text-orange-500" :
              conditionImpact.impactLevel === 'medium' ? "text-yellow-500" :
              "text-blue-500"
            )} />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isArabic ? "تأثير الظروف على الإنتاجية" : "Condition Impact on Productivity"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic ? `انخفاض ${conditionImpact.impactPercentage.toFixed(0)}% في الإنتاجية` :
                  `${conditionImpact.impactPercentage.toFixed(0)}% reduction in productivity`}
              </p>
            </div>
          </div>
        )}

        {/* Calculation Results */}
        {calculation && (
          <div className="space-y-4 rounded-lg border bg-card p-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {isArabic ? "نتائج الحساب" : "Calculation Results"}
            </h4>

            <div className="space-y-3 text-sm">
              {/* Days Required */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {isArabic ? "الأيام المطلوبة" : "Days Required"}
                </span>
                <span className="font-semibold text-lg">
                  {formatNumber(calculation.daysRequired, isArabic ? "ar-EG" : "en-US", 1)} {isArabic ? "يوم" : "days"}
                </span>
              </div>

              {/* Productivity Rate (adjusted if factors applied) */}
              {selectedFactors.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {isArabic ? "الإنتاجية المعدلة" : "Adjusted Productivity"}
                  </span>
                  <div className="text-right">
                    <span className="font-medium">
                      {formatNumber(calculation.adjustedProductivityRate, isArabic ? "ar-EG" : "en-US", 1)} {selectedTemplate?.unitAr}/
                      {isArabic ? "يوم" : "day"}
                    </span>
                    <span className="text-xs text-muted-foreground ms-2">
                      ({(calculation.combinedFactor * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Crew Cost Breakdown */}
              <div className="border-t pt-3">
                <div className="text-muted-foreground mb-2">
                  {isArabic ? "تفاصيل تكلفة الطاقم" : "Crew Cost Breakdown"}
                </div>
                {calculation.crewCostBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs py-1">
                    <span>
                      {isArabic ? item.roleName : (item.roleNameEn ?? item.roleName)}
                      {item.quantity > 1 && ` ×${item.quantity}`}
                      {" × "}
                      {formatNumber(item.totalDays, isArabic ? "ar-EG" : "en-US", 1)} {isArabic ? "يوم" : "days"}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.totalCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Daily Crew Cost */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {isArabic ? "التكلفة اليومية للطاقم" : "Daily Crew Cost"}
                </span>
                <span>
                  {formatCurrency(calculation.dailyCrewCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                </span>
              </div>

              {/* Total Labor Cost */}
              <div className="flex justify-between items-center border-t pt-3 text-lg">
                <span className="font-bold">
                  {isArabic ? "إجمالي تكلفة العمالة" : "Total Labor Cost"}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(calculation.totalLaborCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                </span>
              </div>

              {/* Estimated Completion */}
              {completionDate && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {isArabic ? "تاريخ الإنتهاء المتوقع" : "Est. Completion Date"}
                  </span>
                  <span>
                    {completionDate.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {onCalculate && calculation && (
          <Button onClick={handleCalculate} className="w-full">
            {isArabic ? "استخدام في التقدير" : "Use in Estimate"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
