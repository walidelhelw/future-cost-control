"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { RateType } from "@/lib/supabase";

interface RateCategoryLocal {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  type: RateType;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

interface RateLocal {
  id: string;
  category_id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  unit: string;
  current_rate: number;
  min_rate?: number;
  max_rate?: number;
  waste_factor: number;
  effective_from: string;
  source: string;
  notes?: string;
  is_active: boolean;
  category?: RateCategoryLocal;
}

// Sample data for demo (will be replaced by Supabase data)
const sampleCategories: RateCategoryLocal[] = [
  { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true },
  { id: "2", code: "MAT-CON", name_ar: "الخرسانة", name_en: "Concrete", type: "MATERIAL", parent_id: "1", sort_order: 1, is_active: true },
  { id: "3", code: "MAT-STL", name_ar: "الحديد", name_en: "Steel", type: "MATERIAL", parent_id: "1", sort_order: 2, is_active: true },
  { id: "4", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true },
  { id: "5", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true },
];

const sampleRates: RateLocal[] = [
  {
    id: "1",
    category_id: "2",
    code: "CON-C30",
    name_ar: "خرسانة مسلحة C30",
    name_en: "Reinforced Concrete C30",
    unit: "م³",
    current_rate: 850,
    min_rate: 750,
    max_rate: 1000,
    waste_factor: 1.05,
    effective_from: "2024-01-01",
    source: "manual",
    is_active: true,
    category: sampleCategories[1],
  },
  {
    id: "2",
    category_id: "3",
    code: "STL-D16",
    name_ar: "حديد تسليح قطر 16 مم",
    name_en: "Steel Rebar D16mm",
    unit: "طن",
    current_rate: 28500,
    min_rate: 25000,
    max_rate: 32000,
    waste_factor: 1.03,
    effective_from: "2024-01-01",
    source: "manual",
    is_active: true,
    category: sampleCategories[2],
  },
  {
    id: "3",
    category_id: "4",
    code: "LAB-MASON",
    name_ar: "عامل بناء",
    name_en: "Mason",
    unit: "يوم",
    current_rate: 350,
    min_rate: 300,
    max_rate: 450,
    waste_factor: 1,
    effective_from: "2024-01-01",
    source: "manual",
    is_active: true,
    category: sampleCategories[3],
  },
  {
    id: "4",
    category_id: "5",
    code: "EQP-CRANE",
    name_ar: "رافعة متحركة",
    name_en: "Mobile Crane",
    unit: "ساعة",
    current_rate: 1500,
    min_rate: 1200,
    max_rate: 2000,
    waste_factor: 1,
    effective_from: "2024-01-01",
    source: "manual",
    is_active: true,
    category: sampleCategories[4],
  },
];

const rateTypeColors: Record<RateType, string> = {
  MATERIAL: "bg-blue-500",
  LABOR: "bg-green-500",
  EQUIPMENT: "bg-orange-500",
  SUBCONTRACTOR: "bg-purple-500",
};

export default function RatesPage() {
  const t = useTranslations("rates");
  const tCommon = useTranslations("common");

  const [rates, setRates] = useState<RateLocal[]>(sampleRates);
  const [categories] = useState<RateCategoryLocal[]>(sampleCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<RateLocal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name_ar: "",
    name_en: "",
    category_id: "",
    unit: "",
    current_rate: 0,
    min_rate: 0,
    max_rate: 0,
    waste_factor: 1,
    source: "manual",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name_ar: "",
      name_en: "",
      category_id: "",
      unit: "",
      current_rate: 0,
      min_rate: 0,
      max_rate: 0,
      waste_factor: 1,
      source: "manual",
      notes: "",
    });
    setEditingRate(null);
  };

  const handleOpenForm = (rate?: RateLocal) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        code: rate.code,
        name_ar: rate.name_ar,
        name_en: rate.name_en || "",
        category_id: rate.category_id,
        unit: rate.unit,
        current_rate: rate.current_rate,
        min_rate: rate.min_rate || 0,
        max_rate: rate.max_rate || 0,
        waste_factor: rate.waste_factor,
        source: rate.source,
        notes: rate.notes || "",
      });
    } else {
      resetForm();
    }
    setFormOpen(true);
  };

  const handleSubmit = () => {
    const category = categories.find((c) => c.id === formData.category_id);
    const newRate: RateLocal = {
      id: editingRate?.id || Date.now().toString(),
      category_id: formData.category_id,
      code: formData.code,
      name_ar: formData.name_ar,
      name_en: formData.name_en || undefined,
      unit: formData.unit,
      current_rate: formData.current_rate,
      min_rate: formData.min_rate || undefined,
      max_rate: formData.max_rate || undefined,
      waste_factor: formData.waste_factor,
      effective_from: new Date().toISOString(),
      source: formData.source,
      notes: formData.notes || undefined,
      is_active: true,
      category,
    };

    if (editingRate) {
      setRates((prev) => prev.map((r) => (r.id === editingRate.id ? newRate : r)));
    } else {
      setRates((prev) => [...prev, newRate]);
    }

    setFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setRates((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredRates = rates.filter((rate) => {
    const matchesSearch =
      rate.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rate.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType =
      typeFilter === "all" || rate.category?.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Stats
  const stats = {
    total: rates.length,
    materials: rates.filter((r) => r.category?.type === "MATERIAL").length,
    labor: rates.filter((r) => r.category?.type === "LABOR").length,
    equipment: rates.filter((r) => r.category?.type === "EQUIPMENT").length,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {tCommon("total")}: {rates.length}
          </p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addRate")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{tCommon("total")}</p>
        </div>
        <div className="rounded-lg border bg-blue-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.materials}</p>
          <p className="text-sm text-muted-foreground">{t("rateTypes.material")}</p>
        </div>
        <div className="rounded-lg border bg-green-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.labor}</p>
          <p className="text-sm text-muted-foreground">{t("rateTypes.labor")}</p>
        </div>
        <div className="rounded-lg border bg-orange-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.equipment}</p>
          <p className="text-sm text-muted-foreground">{t("rateTypes.equipment")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-auto rtl:left-3" />
          <Input
            placeholder={tCommon("search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rtl:pr-3 rtl:pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("filters.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
            <SelectItem value="MATERIAL">{t("rateTypes.material")}</SelectItem>
            <SelectItem value="LABOR">{t("rateTypes.labor")}</SelectItem>
            <SelectItem value="EQUIPMENT">{t("rateTypes.equipment")}</SelectItem>
            <SelectItem value="SUBCONTRACTOR">{t("rateTypes.subcontractor")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rates Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("rateCode")}</TableHead>
              <TableHead>{t("rateName")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{tCommon("unit")}</TableHead>
              <TableHead className="text-left">{t("currentRate")}</TableHead>
              <TableHead className="text-left">{t("minRate")}</TableHead>
              <TableHead className="text-left">{t("maxRate")}</TableHead>
              <TableHead>{t("wasteFactor")}</TableHead>
              <TableHead>{tCommon("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRates.length > 0 ? (
              filteredRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-mono">{rate.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rate.name_ar}</p>
                      {rate.name_en && (
                        <p className="text-sm text-muted-foreground">{rate.name_en}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={rate.category ? rateTypeColors[rate.category.type] : ""}>
                      {rate.category?.name_ar || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{rate.unit}</TableCell>
                  <TableCell className="text-left font-medium">
                    {formatCurrency(rate.current_rate)}
                  </TableCell>
                  <TableCell className="text-left text-muted-foreground">
                    {rate.min_rate ? formatCurrency(rate.min_rate) : "-"}
                  </TableCell>
                  <TableCell className="text-left text-muted-foreground">
                    {rate.max_rate ? formatCurrency(rate.max_rate) : "-"}
                  </TableCell>
                  <TableCell>{rate.waste_factor}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(rate)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rate.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-muted-foreground">{tCommon("noData")}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRate ? t("editRate") : t("addRate")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("rateCode")}</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="CON-C30"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("rateName")}</Label>
              <Input
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="خرسانة مسلحة"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("rateNameEn")}</Label>
              <Input
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Reinforced Concrete"
              />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("unit")}</Label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="م³"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("currentRate")}</Label>
              <Input
                type="number"
                value={formData.current_rate}
                onChange={(e) => setFormData({ ...formData, current_rate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("minRate")}</Label>
              <Input
                type="number"
                value={formData.min_rate}
                onChange={(e) => setFormData({ ...formData, min_rate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("maxRate")}</Label>
              <Input
                type="number"
                value={formData.max_rate}
                onChange={(e) => setFormData({ ...formData, max_rate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("wasteFactor")}</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.waste_factor}
                onChange={(e) => setFormData({ ...formData, waste_factor: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("source")}</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleSubmit}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
