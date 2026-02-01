"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  conditionFactors,
  conditionCategoryLabels,
  conditionPresets,
  getFactorsByCategory,
  type ConditionCategory,
  type ConditionFactor,
  type ConditionPreset
} from "@/data/condition-factors";

interface ConditionFactorSelectorProps {
  selectedIds: string[];
  onToggle: (factorId: string) => void;
  onPresetSelect?: (presetId: string) => void;
  showPresets?: boolean;
  className?: string;
}

/**
 * Selector for productivity condition factors
 *
 * Displays factors grouped by category with toggle buttons.
 * Includes quick-select presets for common scenarios.
 */
export function ConditionFactorSelector({
  selectedIds,
  onToggle,
  onPresetSelect,
  showPresets = true,
  className
}: ConditionFactorSelectorProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const categories: ConditionCategory[] = ['weather', 'site', 'access', 'complexity', 'schedule'];

  const selectedCount = selectedIds.length;

  const handlePresetClick = (preset: ConditionPreset) => {
    // Clear existing and apply preset factors
    preset.factorIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onToggle(id);
      }
    });
    // Remove factors not in preset
    selectedIds.forEach(id => {
      if (!preset.factorIds.includes(id)) {
        onToggle(id);
      }
    });
    onPresetSelect?.(preset.id);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isArabic ? "عوامل الظروف" : "Condition Factors"}
        </span>
        {selectedCount > 0 && (
          <Badge variant="secondary">
            {selectedCount} {isArabic ? "محدد" : "selected"}
          </Badge>
        )}
      </div>

      {/* Quick Presets */}
      {showPresets && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">
            {isArabic ? "سيناريوهات سريعة" : "Quick Presets"}
          </span>
          <div className="flex flex-wrap gap-2">
            {conditionPresets.slice(0, 4).map(preset => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handlePresetClick(preset)}
              >
                {isArabic ? preset.nameAr : preset.nameEn}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Factor Categories */}
      <div className="space-y-2">
        {categories.map(category => (
          <CategorySection
            key={category}
            category={category}
            selectedIds={selectedIds}
            onToggle={onToggle}
            locale={locale}
          />
        ))}
      </div>

      {/* Clear All Button */}
      {selectedCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => selectedIds.forEach(id => onToggle(id))}
        >
          {isArabic ? "مسح الكل" : "Clear All"}
        </Button>
      )}
    </div>
  );
}

interface CategorySectionProps {
  category: ConditionCategory;
  selectedIds: string[];
  onToggle: (factorId: string) => void;
  locale: string;
}

function CategorySection({
  category,
  selectedIds,
  onToggle,
  locale
}: CategorySectionProps) {
  const isArabic = locale === "ar";
  const factors = getFactorsByCategory(category);
  const label = conditionCategoryLabels[category];
  const selectedInCategory = factors.filter(f => selectedIds.includes(f.id)).length;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 text-sm">
        <div className="flex items-center gap-2">
          <span>{isArabic ? label.ar : label.en}</span>
          {selectedInCategory > 0 && (
            <Badge variant="secondary" className="text-xs h-5">
              {selectedInCategory}
            </Badge>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 ps-2">
        <div className="flex flex-wrap gap-2">
          {factors.map(factor => (
            <FactorChip
              key={factor.id}
              factor={factor}
              isSelected={selectedIds.includes(factor.id)}
              onClick={() => onToggle(factor.id)}
              locale={locale}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FactorChipProps {
  factor: ConditionFactor;
  isSelected: boolean;
  onClick: () => void;
  locale: string;
}

function FactorChip({ factor, isSelected, onClick, locale }: FactorChipProps) {
  const isArabic = locale === "ar";
  const impactPercent = ((1 - factor.factor) * 100).toFixed(0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80"
      )}
    >
      {factor.icon && <span>{factor.icon}</span>}
      <span>{isArabic ? factor.nameAr : factor.nameEn}</span>
      <span className={cn(
        "text-[10px]",
        isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        -{impactPercent}%
      </span>
      {isSelected && <Check className="h-3 w-3" />}
    </button>
  );
}

/**
 * Compact display of selected condition factors
 */
export function SelectedFactorsDisplay({
  selectedIds,
  className
}: {
  selectedIds: string[];
  className?: string;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const selectedFactors = useMemo(() => {
    return selectedIds
      .map(id => conditionFactors.find(f => f.id === id))
      .filter((f): f is ConditionFactor => f !== undefined);
  }, [selectedIds]);

  if (selectedFactors.length === 0) return null;

  const combinedFactor = selectedFactors.reduce((acc, f) => acc * f.factor, 1);
  const totalImpact = ((1 - combinedFactor) * 100).toFixed(0);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {selectedFactors.map(factor => (
        <Badge key={factor.id} variant="outline" className="text-xs">
          {factor.icon} {isArabic ? factor.nameAr : factor.nameEn}
        </Badge>
      ))}
      <span className="text-xs text-muted-foreground">
        ({isArabic ? `إجمالي: -${totalImpact}%` : `Total: -${totalImpact}%`})
      </span>
    </div>
  );
}
