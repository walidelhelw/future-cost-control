"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { getCrewRoleByCode, type CrewRole } from "@/data/crew-roles";
import type { CrewMember } from "@/data/productivity-templates";

interface CrewCompositionProps {
  crew: CrewMember[];
  showCost?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Visual display of crew composition with roles and costs
 *
 * Displays crew members as chips/badges with role names,
 * quantities, and optionally daily rates and total cost.
 */
export function CrewComposition({
  crew,
  showCost = true,
  compact = false,
  className
}: CrewCompositionProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const crewDetails = useMemo(() => {
    return crew.map(member => {
      const role = getCrewRoleByCode(member.roleCode);
      return {
        ...member,
        role,
        name: isArabic ? (role?.nameAr ?? member.description ?? member.roleCode) : (role?.nameEn ?? member.roleCode),
        dailyRate: role?.dailyRate ?? 0
      };
    });
  }, [crew, isArabic]);

  const totalCrewSize = useMemo(() => {
    return crew.reduce((sum, m) => sum + m.qty, 0);
  }, [crew]);

  const dailyCrewCost = useMemo(() => {
    return crewDetails.reduce((sum, m) => sum + (m.dailyRate * m.qty), 0);
  }, [crewDetails]);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {totalCrewSize} {isArabic ? "عمال" : "workers"}
        </span>
        {showCost && (
          <span className="text-muted-foreground">
            • {formatCurrency(dailyCrewCost, "EGP", isArabic ? "ar-EG" : "en-US")}/
            {isArabic ? "يوم" : "day"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {isArabic ? "طاقم العمل" : "Crew Composition"}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalCrewSize} {isArabic ? "عامل" : totalCrewSize === 1 ? "worker" : "workers"}
        </span>
      </div>

      {/* Crew Members */}
      <div className="flex flex-wrap gap-2 mb-3">
        {crewDetails.map((member, index) => (
          <CrewMemberChip
            key={`${member.roleCode}-${index}`}
            name={member.name}
            quantity={member.qty}
            dailyRate={member.dailyRate}
            showRate={showCost}
            locale={locale}
          />
        ))}
      </div>

      {/* Daily Cost Summary */}
      {showCost && (
        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <span className="text-muted-foreground">
            {isArabic ? "التكلفة اليومية للطاقم" : "Daily Crew Cost"}
          </span>
          <span className="font-semibold text-primary">
            {formatCurrency(dailyCrewCost, "EGP", isArabic ? "ar-EG" : "en-US")}
          </span>
        </div>
      )}
    </div>
  );
}

interface CrewMemberChipProps {
  name: string;
  quantity: number;
  dailyRate: number;
  showRate?: boolean;
  locale: string;
}

function CrewMemberChip({
  name,
  quantity,
  dailyRate,
  showRate = true,
  locale
}: CrewMemberChipProps) {
  const isArabic = locale === "ar";

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm">
      <User className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{name}</span>
      {quantity > 1 && (
        <span className="text-muted-foreground">×{quantity}</span>
      )}
      {showRate && (
        <span className="text-xs text-muted-foreground">
          ({formatCurrency(dailyRate * quantity, "EGP", isArabic ? "ar-EG" : "en-US")})
        </span>
      )}
    </div>
  );
}

/**
 * Minimal crew display for table cells
 */
export function CrewCompositionInline({
  crew,
  className
}: {
  crew: CrewMember[];
  className?: string;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const crewNames = useMemo(() => {
    return crew.map(member => {
      const role = getCrewRoleByCode(member.roleCode);
      const name = isArabic ? (role?.nameAr ?? member.description) : (role?.nameEn ?? member.roleCode);
      return member.qty > 1 ? `${name} ×${member.qty}` : name;
    });
  }, [crew, isArabic]);

  const totalSize = crew.reduce((sum, m) => sum + m.qty, 0);

  return (
    <span className={cn("text-sm", className)} title={crewNames.join(isArabic ? "، " : ", ")}>
      <Users className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
      {totalSize}
    </span>
  );
}
