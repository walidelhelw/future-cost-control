"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Search, Zap, Users, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { productivityTemplates, type ProductivityTemplate } from "@/data/productivity-templates";
import { productivityCategories, getCategoryById } from "@/data/productivity-categories";
import { getCrewRoleByCode } from "@/data/crew-roles";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface ProductivityTemplateSelectorProps {
  onSelect: (template: ProductivityTemplate, laborItems: LaborItem[]) => void;
  className?: string;
}

export interface LaborItem {
  rateCode: string;
  qty: number;
  description: string;
  dailyRate: number;
}

/**
 * Component for selecting productivity templates in the Estimates workflow
 * Converts productivity templates to labor items for cost estimation
 */
export function ProductivityTemplateSelector({
  onSelect,
  className
}: ProductivityTemplateSelectorProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ProductivityTemplate | null>(null);

  // Get unique categories from templates
  const availableCategories = useMemo(() => {
    const categoryIds = new Set(productivityTemplates.map(t => t.categoryId));
    return productivityCategories.filter(c => categoryIds.has(c.id));
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return productivityTemplates.filter(template => {
      const matchesSearch =
        template.nameAr.includes(searchTerm) ||
        template.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || template.categoryId === categoryFilter;
      return matchesSearch && matchesCategory && template.isActive;
    });
  }, [searchTerm, categoryFilter]);

  // Calculate labor items for selected template
  const laborItems = useMemo(() => {
    if (!selectedTemplate) return [];

    return selectedTemplate.crew.map(member => {
      const role = getCrewRoleByCode(member.roleCode);
      return {
        rateCode: member.roleCode,
        qty: member.qty,
        description: member.description || role?.nameAr || member.roleCode,
        dailyRate: role?.dailyRate || 0
      };
    });
  }, [selectedTemplate]);

  // Calculate total daily crew cost
  const totalDailyCost = useMemo(() => {
    return laborItems.reduce((sum, item) => sum + (item.dailyRate * item.qty), 0);
  }, [laborItems]);

  const handleSelect = () => {
    if (selectedTemplate && laborItems.length > 0) {
      onSelect(selectedTemplate, laborItems);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Zap className="h-4 w-4 text-primary" />
        {isArabic ? "اختيار قالب إنتاجية" : "Select Productivity Template"}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-auto rtl:left-3" />
          <Input
            placeholder={isArabic ? "بحث..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rtl:pr-3 rtl:pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={isArabic ? "الفئة" : "Category"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isArabic ? "جميع الفئات" : "All Categories"}
            </SelectItem>
            {availableCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {isArabic ? cat.nameAr : cat.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template List */}
      <div className="h-[250px] rounded-lg border overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredTemplates.map((template) => {
            const category = getCategoryById(template.categoryId);
            return (
              <div
                key={template.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors",
                  selectedTemplate?.id === template.id
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted/50 border border-transparent"
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{template.nameAr}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {isArabic ? category?.nameAr : category?.nameEn}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.crewSize}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatNumber(template.productivityRate, isArabic ? "ar-EG" : "en-US")} {template.unitAr}/{isArabic ? "يوم" : "day"}
                      </span>
                    </div>
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            );
          })}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {isArabic ? "لا توجد قوالب مطابقة" : "No matching templates"}
            </div>
          )}
        </div>
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{selectedTemplate.nameAr}</h4>
            <Badge>{selectedTemplate.source}</Badge>
          </div>

          {/* Crew Breakdown */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {isArabic ? "تركيبة الطاقم:" : "Crew Composition:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {laborItems.map((item, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 rounded bg-background text-xs flex items-center gap-1"
                >
                  <span className="font-medium">{item.qty}×</span>
                  <span>{item.description}</span>
                  <span className="text-muted-foreground">
                    ({formatCurrency(item.dailyRate, "EGP", isArabic ? "ar-EG" : "en-US")})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? "الإنتاجية" : "Productivity"}
              </p>
              <p className="font-medium">
                {formatNumber(selectedTemplate.productivityRate, isArabic ? "ar-EG" : "en-US")} {selectedTemplate.unitAr}/{isArabic ? "يوم" : "day"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? "حجم الطاقم" : "Crew Size"}
              </p>
              <p className="font-medium">{selectedTemplate.crewSize}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? "تكلفة الطاقم/يوم" : "Crew Cost/Day"}
              </p>
              <p className="font-medium text-primary">
                {formatCurrency(totalDailyCost, "EGP", isArabic ? "ar-EG" : "en-US")}
              </p>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSelect}
            disabled={laborItems.length === 0}
          >
            {isArabic ? "استخدام هذا القالب" : "Use This Template"}
          </Button>
        </div>
      )}
    </div>
  );
}
