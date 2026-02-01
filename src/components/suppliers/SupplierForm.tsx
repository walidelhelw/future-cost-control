"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import {
  calculateSupplierScore,
  getSupplierStatus,
  type SupplierScores,
} from "@/lib/calculations";

interface SupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SupplierFormData) => void;
  initialData?: SupplierFormData;
}

export interface SupplierFormData {
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  scores: SupplierScores;
}

const defaultScores: SupplierScores = {
  quality: 5,
  price: 5,
  delivery: 5,
  paymentTerms: 5,
  experience: 5,
  afterSales: 5,
  riskDeduction: 0,
};

export function SupplierForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: SupplierFormProps) {
  const t = useTranslations("suppliers");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState<SupplierFormData>(
    initialData || {
      name: "",
      category: "materials",
      phone: "",
      email: "",
      address: "",
      scores: { ...defaultScores },
    }
  );

  const totalScore = calculateSupplierScore(formData.scores);
  const status = getSupplierStatus(totalScore);

  const handleScoreChange = (field: keyof SupplierScores, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [field]: value[0],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const scoreFields: {
    key: keyof SupplierScores;
    label: string;
    desc: string;
    weight: string;
    isDeduction?: boolean;
  }[] = [
    {
      key: "quality",
      label: t("quality"),
      desc: t("qualityDesc"),
      weight: t("weights.quality"),
    },
    {
      key: "price",
      label: t("priceScore"),
      desc: t("priceDesc"),
      weight: t("weights.price"),
    },
    {
      key: "delivery",
      label: t("delivery"),
      desc: t("deliveryDesc"),
      weight: t("weights.delivery"),
    },
    {
      key: "paymentTerms",
      label: t("paymentTerms"),
      desc: t("paymentDesc"),
      weight: t("weights.payment"),
    },
    {
      key: "experience",
      label: t("experience"),
      desc: t("experienceDesc"),
      weight: t("weights.experience"),
    },
    {
      key: "afterSales",
      label: t("afterSales"),
      desc: t("afterSalesDesc"),
      weight: t("weights.afterSales"),
    },
    {
      key: "riskDeduction",
      label: t("riskDeduction"),
      desc: t("riskDesc"),
      weight: t("weights.risk"),
      isDeduction: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editSupplier") : t("addSupplier")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("supplierName")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t("supplierCategory")}</Label>
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
                  <SelectItem value="materials">
                    {t("categories.materials")}
                  </SelectItem>
                  <SelectItem value="equipment">
                    {t("categories.equipment")}
                  </SelectItem>
                  <SelectItem value="services">
                    {t("categories.services")}
                  </SelectItem>
                  <SelectItem value="labor">
                    {t("categories.labor")}
                  </SelectItem>
                  <SelectItem value="transportation">
                    {t("categories.transportation")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <Label>{t("contactInfo")}</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder={t("phone")}
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <Input
                placeholder={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                placeholder={t("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Evaluation Scores */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{t("evaluation")}</Label>

            {scoreFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{field.label}</span>
                    <span className="text-xs text-muted-foreground mr-2 ml-2">
                      ({field.weight})
                    </span>
                  </div>
                  <span
                    className={`font-bold ${
                      field.isDeduction ? "text-red-500" : "text-primary"
                    }`}
                  >
                    {formData.scores[field.key]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{field.desc}</p>
                <Slider
                  value={[formData.scores[field.key]]}
                  onValueChange={(value) => handleScoreChange(field.key, value)}
                  max={10}
                  min={0}
                  step={0.5}
                  className={field.isDeduction ? "[&_[data-radix-slider-range]]:bg-red-500" : ""}
                />
              </div>
            ))}
          </div>

          {/* Score Summary */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold">{t("totalScore")}: </span>
                <span className="text-2xl font-bold">{totalScore.toFixed(2)}</span>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-sm font-bold text-white ${
                  status === "primary"
                    ? "bg-green-500"
                    : status === "conditional"
                    ? "bg-yellow-500"
                    : status === "backup"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              >
                {status === "primary"
                  ? t("statusPrimary")
                  : status === "conditional"
                  ? t("statusConditional")
                  : status === "backup"
                  ? t("statusBackup")
                  : t("statusRejected")}
              </div>
            </div>
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
