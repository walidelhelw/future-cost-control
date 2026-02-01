"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { compareProductivitySources, type ProductivityComparison } from "@/lib/calculations";
import { getCrewRoleByCode } from "@/data/crew-roles";
import type { ProductivityTemplate, ProductivitySource } from "@/data/productivity-templates";

interface SourceComparisonProps {
  /** Multiple templates for the same work type from different sources */
  templates: ProductivityTemplate[];
  /** Quantity to calculate cost comparison */
  quantity?: number;
  className?: string;
}

/**
 * Compares productivity data from multiple sources
 *
 * Shows a table/chart comparing:
 * - Productivity rate per source
 * - Crew size
 * - Days required (if quantity provided)
 * - Estimated cost (if quantity provided)
 * - Variance from average
 */
export function SourceComparison({
  templates,
  quantity = 100,
  className
}: SourceComparisonProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  // Calculate daily crew cost for each template
  const templateData = useMemo(() => {
    return templates.map(template => {
      const dailyCrewCost = template.crew.reduce((sum, member) => {
        const role = getCrewRoleByCode(member.roleCode);
        return sum + (role?.dailyRate ?? 0) * member.qty;
      }, 0);

      return {
        source: template.source,
        productivityRate: template.productivityRate,
        crewSize: template.crewSize,
        dailyCrewCost
      };
    });
  }, [templates]);

  // Use the calculation function to get comparisons
  const comparisons = useMemo(() => {
    return compareProductivitySources(templateData, quantity);
  }, [templateData, quantity]);

  // Calculate averages
  const averages = useMemo(() => {
    if (comparisons.length === 0) return null;

    return {
      productivityRate: comparisons.reduce((sum, c) => sum + c.productivityRate, 0) / comparisons.length,
      crewSize: comparisons.reduce((sum, c) => sum + c.crewSize, 0) / comparisons.length,
      daysRequired: comparisons.reduce((sum, c) => sum + c.daysRequired, 0) / comparisons.length,
      estimatedCost: comparisons.reduce((sum, c) => sum + c.estimatedCost, 0) / comparisons.length
    };
  }, [comparisons]);

  if (templates.length === 0) {
    return null;
  }

  // If only one template, show simple info instead of comparison
  if (templates.length === 1) {
    const template = templates[0];
    const comp = comparisons[0];

    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {isArabic ? "معلومات المصدر" : "Source Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isArabic ? "المصدر" : "Source"}</span>
              <Badge variant="outline">{template.source}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isArabic ? "الإنتاجية" : "Productivity"}</span>
              <span>{formatNumber(template.productivityRate, isArabic ? "ar-EG" : "en-US")} {template.unitAr}/{isArabic ? "يوم" : "day"}</span>
            </div>
            {quantity > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "الأيام المطلوبة" : "Days Required"}</span>
                  <span>{formatNumber(comp.daysRequired, isArabic ? "ar-EG" : "en-US", 1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "التكلفة المتوقعة" : "Est. Cost"}</span>
                  <span>{formatCurrency(comp.estimatedCost, "EGP", isArabic ? "ar-EG" : "en-US")}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {isArabic ? "مقارنة المصادر" : "Source Comparison"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comparison Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? "المصدر" : "Source"}</TableHead>
                <TableHead className="text-center">
                  {isArabic ? "الإنتاجية" : "Productivity"}
                </TableHead>
                <TableHead className="text-center">
                  {isArabic ? "الطاقم" : "Crew"}
                </TableHead>
                {quantity > 0 && (
                  <>
                    <TableHead className="text-center">
                      {isArabic ? "الأيام" : "Days"}
                    </TableHead>
                    <TableHead className="text-center">
                      {isArabic ? "التكلفة" : "Cost"}
                    </TableHead>
                  </>
                )}
                <TableHead className="text-center">
                  {isArabic ? "الفرق" : "Variance"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisons.map((comp, index) => (
                <TableRow key={comp.source}>
                  <TableCell>
                    <Badge variant="outline">{comp.source}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatNumber(comp.productivityRate, isArabic ? "ar-EG" : "en-US")}
                  </TableCell>
                  <TableCell className="text-center">
                    {comp.crewSize}
                  </TableCell>
                  {quantity > 0 && (
                    <>
                      <TableCell className="text-center">
                        {formatNumber(comp.daysRequired, isArabic ? "ar-EG" : "en-US", 1)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {formatCurrency(comp.estimatedCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center">
                    <VarianceBadge variance={comp.variance} locale={locale} />
                  </TableCell>
                </TableRow>
              ))}

              {/* Average Row */}
              {averages && (
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>
                    {isArabic ? "المتوسط" : "Average"}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatNumber(averages.productivityRate, isArabic ? "ar-EG" : "en-US", 1)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatNumber(averages.crewSize, isArabic ? "ar-EG" : "en-US", 1)}
                  </TableCell>
                  {quantity > 0 && (
                    <>
                      <TableCell className="text-center">
                        {formatNumber(averages.daysRequired, isArabic ? "ar-EG" : "en-US", 1)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {formatCurrency(averages.estimatedCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Visual Bar Chart (simple CSS-based) */}
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            {isArabic ? "مقارنة الإنتاجية (نسبة من المتوسط)" : "Productivity Comparison (% of average)"}
          </p>
          {comparisons.map((comp) => {
            const percentage = averages ? (comp.productivityRate / averages.productivityRate) * 100 : 100;
            return (
              <div key={comp.source} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{comp.source}</span>
                  <span>{formatNumber(comp.productivityRate, isArabic ? "ar-EG" : "en-US")}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      percentage >= 100 ? "bg-green-500" : percentage >= 90 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function VarianceBadge({ variance, locale }: { variance: number; locale: string }) {
  const isArabic = locale === "ar";
  const absVariance = Math.abs(variance);

  if (absVariance < 1) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
        <Minus className="h-3 w-3" />
        0%
      </span>
    );
  }

  if (variance > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
        <TrendingUp className="h-3 w-3" />
        +{formatNumber(variance, isArabic ? "ar-EG" : "en-US", 0)}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-red-600 text-xs">
      <TrendingDown className="h-3 w-3" />
      {formatNumber(variance, isArabic ? "ar-EG" : "en-US", 0)}%
    </span>
  );
}

/**
 * Compact inline comparison for tables/lists
 */
export function SourceComparisonInline({
  templates,
  className
}: {
  templates: ProductivityTemplate[];
  className?: string;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  if (templates.length <= 1) return null;

  const rates = templates.map(t => t.productivityRate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {formatNumber(min, isArabic ? "ar-EG" : "en-US")} - {formatNumber(max, isArabic ? "ar-EG" : "en-US")}
      <span className="mx-1">/</span>
      {isArabic ? "متوسط" : "avg"}: {formatNumber(avg, isArabic ? "ar-EG" : "en-US", 1)}
    </span>
  );
}
