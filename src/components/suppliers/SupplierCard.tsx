"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { type SupplierStatus } from "@/lib/calculations";

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    category: string;
    phone?: string;
    email?: string;
    address?: string;
    totalScore: number;
    status: SupplierStatus;
    scores: {
      quality: number;
      price: number;
      delivery: number;
      paymentTerms: number;
      experience: number;
      afterSales: number;
      riskDeduction: number;
    };
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SupplierCard({ supplier, onEdit, onDelete }: SupplierCardProps) {
  const t = useTranslations("suppliers");
  const locale = useLocale();

  const statusConfig = {
    primary: {
      label: t("statusPrimary"),
      variant: "success" as const,
    },
    conditional: {
      label: t("statusConditional"),
      variant: "warning" as const,
    },
    backup: {
      label: t("statusBackup"),
      variant: "secondary" as const,
    },
    rejected: {
      label: t("statusRejected"),
      variant: "danger" as const,
    },
  };

  const config = statusConfig[supplier.status];

  const scoreItems = [
    { key: "quality", label: t("quality"), value: supplier.scores.quality },
    { key: "price", label: t("priceScore"), value: supplier.scores.price },
    { key: "delivery", label: t("delivery"), value: supplier.scores.delivery },
  ];

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{supplier.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t(`categories.${supplier.category}`)}
            </p>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>{t("totalScore")}</span>
              <span className="font-bold">{supplier.totalScore.toFixed(2)}</span>
            </div>
            <Progress value={supplier.totalScore * 10} className="h-2" />
          </div>
        </div>

        {/* Mini Scores */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {scoreItems.map((item) => (
            <div key={item.key} className="rounded-lg bg-muted p-2">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        {(supplier.phone || supplier.email || supplier.address) && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {supplier.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{supplier.phone}</span>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>{supplier.email}</span>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{supplier.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            {t("editSupplier")}
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
