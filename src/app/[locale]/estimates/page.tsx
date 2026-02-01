"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Calculator,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  calculateEstimateItem,
  type ComponentItem,
  type EstimateItemResult,
  DEFAULT_COST_CONFIG,
} from "@/lib/calculations";
import type { EstimateStatus } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductivityTemplateSelector, type LaborItem } from "@/components/productivity";
import type { ProductivityTemplate } from "@/data/productivity-templates";
import { getCrewRoleByCode } from "@/data/crew-roles";

interface EstimateItemData {
  id: string;
  boq_code: string;
  description_ar: string;
  description_en?: string;
  unit: string;
  quantity: number;
  calculated: EstimateItemResult;
}

interface EstimateData {
  id: string;
  project_id: string;
  project_name: string;
  version: number;
  name?: string;
  indirect_rate: number;
  profit_margin: number;
  contingency: number;
  status: EstimateStatus;
  items: EstimateItemData[];
  created_at: string;
}

import { crewRoles } from "@/data/crew-roles";

// Build productivity labor rates from crew-roles data
const productivityLaborRates: Record<string, number> = {};
crewRoles.forEach(role => {
  productivityLaborRates[role.code] = role.dailyRate;
});

// Real rate data extracted from Excel files (Cost Estimation Sheets)
const sampleRates: Record<string, number> = {
  // Productivity Labor Rates (from الانتاجيات)
  ...productivityLaborRates,

  // Legacy Labor Rates (from Sheet 16) - kept for backwards compatibility
  "LAB-CARP-FND": 10,
  "LAB-CARP-SLAB": 50,
  "LAB-CARP-RFND": 3,
  "LAB-CARP-COL": 1.5,
  "LAB-CARP-SOLID": 3,
  "LAB-CARP-FLAT": 5,
  "LAB-STEEL-FND": 3,
  "LAB-STEEL-SLAB": 5,
  "LAB-STEEL-COL": 2.5,
  "LAB-MASON-BRICK": 4,
  "LAB-PLASTER-SPRAY": 200,
  "LAB-PLASTER-DOTS": 150,
  "LAB-PLASTER-INT": 40,
  "LAB-PLASTER-CEIL": 30,
  "LAB-PLASTER-EXT": 25,
  "LAB-PAINT-PUTTY": 60,
  "LAB-PAINT-PLASTIC": 200,
  "LAB-TILE-FLOOR": 25,
  "LAB-TILE-WALL": 15,
  "LAB-MARBLE-FLOOR": 15,
  "LAB-MARBLE-STAIR": 12,
  "LAB-WP-BITUMEN": 100,
  "LAB-HELPER": 150, // General helper rate
  // Material Rates (from Sheet 17-18)
  "MAT-CONC-PLAIN": 750,
  "MAT-CONC-REINF": 950,
  "MAT-STEEL-FND": 28,
  "MAT-STEEL-COL": 28,
  "MAT-STEEL-SLAB": 28,
  "MAT-CEMENT": 2500,
  "MAT-SAND": 180,
  "MAT-GRAVEL": 220,
  "MAT-BRICK-SINGLE": 1800,
  "MAT-BRICK-DOUBLE": 3200,
  "MAT-PLASTER-MORTAR": 850,
  "MAT-PUTTY": 25,
  "MAT-SEALER": 45,
  "MAT-PAINT-PLASTIC": 85,
  "MAT-CERAMIC-FLOOR": 120,
  "MAT-CERAMIC-WALL": 100,
  "MAT-MARBLE": 450,
  "MAT-GRANITE": 550,
  "MAT-BITUMEN": 35,
  "MAT-MEMBRANE": 75,
  // Equipment Rates
  "EQP-MIXER": 500,
  "EQP-VIBRATOR": 200,
  "EQP-PUMP": 3500,
  "EQP-CRANE": 5000,
  "EQP-SCAFFOLDING": 25,
  "EQP-EXCAVATOR": 4500,
  "EQP-LOADER": 3000,
  "EQP-TRUCK": 350,
  "EQP-COMPACTOR": 2500,
};

const rateLookup = (code: string) => sampleRates[code];

// Real BOQ templates extracted from Excel files
const boqTemplates = [
  // Excavation
  {
    code: "EXC-01",
    name_ar: "حفر في جميع أنواع التربة",
    name_en: "Excavation in All Soil Types",
    unit: "م³",
    category: "excavation",
    materials: [],
    labor: [{ rateCode: "LAB-HELPER", qty: 0.5, description: "عامل حفر" }],
    equipment: [{ rateCode: "EQP-EXCAVATOR", qty: 0.02, description: "حفار" }],
  },
  {
    code: "EXC-02",
    name_ar: "ردم بالرمل",
    name_en: "Sand Backfill",
    unit: "م³",
    category: "excavation",
    materials: [{ rateCode: "MAT-SAND", qty: 1.25, description: "رمل ردم" }],
    labor: [{ rateCode: "LAB-HELPER", qty: 0.3, description: "عامل" }],
    equipment: [{ rateCode: "EQP-COMPACTOR", qty: 0.01, description: "هراس" }],
  },
  // Concrete
  {
    code: "CON-PC-01",
    name_ar: "خرسانة عادية للقواعد",
    name_en: "Plain Concrete for Foundations",
    unit: "م³",
    category: "concrete",
    materials: [{ rateCode: "MAT-CONC-PLAIN", qty: 1.05, description: "خرسانة عادية" }],
    labor: [
      { rateCode: "LAB-CARP-FND", qty: 0.1, description: "نجار" },
      { rateCode: "LAB-HELPER", qty: 0.2, description: "مساعد" },
    ],
    equipment: [{ rateCode: "EQP-MIXER", qty: 0.05, description: "خلاطة" }],
  },
  {
    code: "CON-RC-FND",
    name_ar: "خرسانة مسلحة للقواعد والسملات",
    name_en: "Reinforced Concrete for Foundations",
    unit: "م³",
    category: "concrete",
    materials: [
      { rateCode: "MAT-CONC-REINF", qty: 1.05, description: "خرسانة مسلحة" },
      { rateCode: "MAT-STEEL-FND", qty: 90, description: "حديد تسليح (90 كجم/م³)" },
    ],
    labor: [
      { rateCode: "LAB-CARP-RFND", qty: 0.33, description: "نجار مسلح" },
      { rateCode: "LAB-STEEL-FND", qty: 0.33, description: "حداد" },
      { rateCode: "LAB-HELPER", qty: 0.5, description: "مساعد" },
    ],
    equipment: [
      { rateCode: "EQP-MIXER", qty: 0.05, description: "خلاطة" },
      { rateCode: "EQP-VIBRATOR", qty: 0.05, description: "هزاز" },
    ],
  },
  {
    code: "CON-RC-COL",
    name_ar: "خرسانة مسلحة للأعمدة",
    name_en: "Reinforced Concrete for Columns",
    unit: "م³",
    category: "concrete",
    materials: [
      { rateCode: "MAT-CONC-REINF", qty: 1.05, description: "خرسانة مسلحة" },
      { rateCode: "MAT-STEEL-COL", qty: 130, description: "حديد تسليح (130 كجم/م³)" },
    ],
    labor: [
      { rateCode: "LAB-CARP-COL", qty: 0.67, description: "نجار مسلح" },
      { rateCode: "LAB-STEEL-COL", qty: 0.4, description: "حداد" },
      { rateCode: "LAB-HELPER", qty: 0.5, description: "مساعد" },
    ],
    equipment: [
      { rateCode: "EQP-MIXER", qty: 0.05, description: "خلاطة" },
      { rateCode: "EQP-VIBRATOR", qty: 0.1, description: "هزاز" },
    ],
  },
  {
    code: "CON-RC-SLAB",
    name_ar: "خرسانة مسلحة للأسقف",
    name_en: "Reinforced Concrete for Slabs",
    unit: "م³",
    category: "concrete",
    materials: [
      { rateCode: "MAT-CONC-REINF", qty: 1.05, description: "خرسانة مسلحة" },
      { rateCode: "MAT-STEEL-SLAB", qty: 85, description: "حديد تسليح (85 كجم/م³)" },
    ],
    labor: [
      { rateCode: "LAB-CARP-SOLID", qty: 0.33, description: "نجار مسلح" },
      { rateCode: "LAB-STEEL-SLAB", qty: 0.33, description: "حداد" },
      { rateCode: "LAB-HELPER", qty: 0.5, description: "مساعد" },
    ],
    equipment: [
      { rateCode: "EQP-PUMP", qty: 0.02, description: "مضخة" },
      { rateCode: "EQP-VIBRATOR", qty: 0.1, description: "هزاز" },
    ],
  },
  // Masonry
  {
    code: "MAS-BRICK-25",
    name_ar: "مباني طوب سمك 25 سم",
    name_en: "Brick Wall 25cm Thick",
    unit: "م³",
    category: "masonry",
    materials: [
      { rateCode: "MAT-BRICK-SINGLE", qty: 0.44, description: "طوب (440 طوبة)" },
      { rateCode: "MAT-CEMENT", qty: 0.06, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.2, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-MASON-BRICK", qty: 0.25, description: "بناء" },
      { rateCode: "LAB-HELPER", qty: 0.25, description: "مساعد" },
    ],
    equipment: [],
  },
  {
    code: "MAS-BRICK-12",
    name_ar: "مباني طوب سمك 12 سم",
    name_en: "Brick Wall 12cm Thick",
    unit: "م²",
    category: "masonry",
    materials: [
      { rateCode: "MAT-BRICK-SINGLE", qty: 0.055, description: "طوب (55 طوبة)" },
      { rateCode: "MAT-CEMENT", qty: 0.006, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.02, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-MASON-BRICK", qty: 0.037, description: "بناء" },
      { rateCode: "LAB-HELPER", qty: 0.037, description: "مساعد" },
    ],
    equipment: [],
  },
  // Finishing
  {
    code: "PLT-INT",
    name_ar: "بياض محارة داخلي",
    name_en: "Interior Plastering",
    unit: "م²",
    category: "finishing",
    materials: [
      { rateCode: "MAT-CEMENT", qty: 0.012, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.03, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-PLASTER-SPRAY", qty: 0.005, description: "طرطشة" },
      { rateCode: "LAB-PLASTER-DOTS", qty: 0.007, description: "بؤج" },
      { rateCode: "LAB-PLASTER-INT", qty: 0.025, description: "ملو" },
    ],
    equipment: [],
  },
  {
    code: "PAINT-PLASTIC",
    name_ar: "دهان بلاستيك (3 أوجه)",
    name_en: "Plastic Paint (3 coats)",
    unit: "م²",
    category: "finishing",
    materials: [
      { rateCode: "MAT-PUTTY", qty: 0.3, description: "معجون" },
      { rateCode: "MAT-SEALER", qty: 0.1, description: "سيلار" },
      { rateCode: "MAT-PAINT-PLASTIC", qty: 0.35, description: "دهان بلاستيك" },
    ],
    labor: [
      { rateCode: "LAB-PAINT-PUTTY", qty: 0.017, description: "معجون وصنفرة" },
      { rateCode: "LAB-PAINT-PLASTIC", qty: 0.015, description: "دهان" },
    ],
    equipment: [],
  },
  {
    code: "TILE-FLOOR",
    name_ar: "سيراميك أرضيات",
    name_en: "Floor Ceramic Tiles",
    unit: "م²",
    category: "finishing",
    materials: [
      { rateCode: "MAT-CERAMIC-FLOOR", qty: 1.05, description: "سيراميك" },
      { rateCode: "MAT-CEMENT", qty: 0.012, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.1, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-TILE-FLOOR", qty: 0.04, description: "مبلط" },
      { rateCode: "LAB-HELPER", qty: 0.04, description: "مساعد" },
    ],
    equipment: [],
  },
  {
    code: "TILE-WALL",
    name_ar: "سيراميك حوائط",
    name_en: "Wall Ceramic Tiles",
    unit: "م²",
    category: "finishing",
    materials: [
      { rateCode: "MAT-CERAMIC-WALL", qty: 1.05, description: "سيراميك" },
      { rateCode: "MAT-CEMENT", qty: 0.015, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.03, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-TILE-WALL", qty: 0.067, description: "مبلط" },
      { rateCode: "LAB-HELPER", qty: 0.067, description: "مساعد" },
    ],
    equipment: [],
  },
  {
    code: "MARBLE-FLOOR",
    name_ar: "رخام أرضيات",
    name_en: "Floor Marble",
    unit: "م²",
    category: "finishing",
    materials: [
      { rateCode: "MAT-MARBLE", qty: 1.05, description: "رخام" },
      { rateCode: "MAT-CEMENT", qty: 0.015, description: "أسمنت" },
      { rateCode: "MAT-SAND", qty: 0.1, description: "رمل" },
    ],
    labor: [
      { rateCode: "LAB-MARBLE-FLOOR", qty: 0.067, description: "مرخماتي" },
      { rateCode: "LAB-HELPER", qty: 0.067, description: "مساعد" },
    ],
    equipment: [],
  },
  // Waterproofing
  {
    code: "WP-BITUMEN",
    name_ar: "عزل بيتومين (وجهين)",
    name_en: "Bitumen Waterproofing (2 coats)",
    unit: "م²",
    category: "waterproofing",
    materials: [{ rateCode: "MAT-BITUMEN", qty: 2.0, description: "بيتومين" }],
    labor: [{ rateCode: "LAB-WP-BITUMEN", qty: 0.01, description: "صنايعي عزل" }],
    equipment: [],
  },
  {
    code: "WP-MEMBRANE",
    name_ar: "عزل ممبرين",
    name_en: "Membrane Waterproofing",
    unit: "م²",
    category: "waterproofing",
    materials: [
      { rateCode: "MAT-MEMBRANE", qty: 1.1, description: "ممبرين" },
      { rateCode: "MAT-BITUMEN", qty: 0.5, description: "بيتومين تحضير" },
    ],
    labor: [{ rateCode: "LAB-WP-BITUMEN", qty: 0.02, description: "صنايعي عزل" }],
    equipment: [],
  },
];

// Sample data
const sampleEstimates: EstimateData[] = [
  {
    id: "1",
    project_id: "1",
    project_name: "فيلا سكنية - التجمع الخامس",
    version: 1,
    name: "التقدير الأولي",
    indirect_rate: 0.15,
    profit_margin: 0.20,
    contingency: 0.05,
    status: "APPROVED",
    items: [],
    created_at: "2024-01-20",
  },
  {
    id: "2",
    project_id: "1",
    project_name: "فيلا سكنية - التجمع الخامس",
    version: 2,
    name: "التقدير المعدل",
    indirect_rate: 0.15,
    profit_margin: 0.18,
    contingency: 0.05,
    status: "PENDING_REVIEW",
    items: [],
    created_at: "2024-02-01",
  },
  {
    id: "3",
    project_id: "2",
    project_name: "مجمع تجاري - المعادي",
    version: 1,
    name: "التقدير الأولي",
    indirect_rate: 0.18,
    profit_margin: 0.22,
    contingency: 0.07,
    status: "DRAFT",
    items: [],
    created_at: "2024-02-05",
  },
];

const statusColors: Record<EstimateStatus, string> = {
  DRAFT: "bg-gray-500",
  PENDING_REVIEW: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
  SUPERSEDED: "bg-purple-500",
};

const statusIcons: Record<EstimateStatus, React.ReactNode> = {
  DRAFT: <Edit2 className="h-4 w-4" />,
  PENDING_REVIEW: <AlertTriangle className="h-4 w-4" />,
  APPROVED: <CheckCircle className="h-4 w-4" />,
  REJECTED: <XCircle className="h-4 w-4" />,
  SUPERSEDED: <Copy className="h-4 w-4" />,
};

export default function EstimatesPage() {
  const t = useTranslations("estimates");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const projectIdFilter = searchParams.get("project");

  const [estimates, setEstimates] = useState<EstimateData[]>(sampleEstimates);
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateData | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [configOpen, setConfigOpen] = useState(false);

  // Form state for new estimate
  const [newEstimateForm, setNewEstimateForm] = useState({
    project_id: "",
    name: "",
    indirect_rate: 0.15,
    profit_margin: 0.20,
    contingency: 0.05,
  });

  // Form state for new item
  const [newItemForm, setNewItemForm] = useState({
    boq_code: "",
    description_ar: "",
    description_en: "",
    unit: "",
    quantity: 1,
    materials: [] as ComponentItem[],
    labor: [] as ComponentItem[],
    equipment: [] as ComponentItem[],
  });

  // Calculate item preview
  const itemPreview = useMemo(() => {
    if (!newItemForm.boq_code || newItemForm.quantity <= 0) return null;
    return calculateEstimateItem(
      newItemForm.quantity,
      newItemForm.materials,
      newItemForm.labor,
      newItemForm.equipment,
      rateLookup,
      {
        indirectRate: selectedEstimate?.indirect_rate ?? DEFAULT_COST_CONFIG.indirectRate,
        profitMargin: selectedEstimate?.profit_margin ?? DEFAULT_COST_CONFIG.profitMargin,
        contingency: selectedEstimate?.contingency ?? DEFAULT_COST_CONFIG.contingency,
      }
    );
  }, [newItemForm, selectedEstimate]);

  // Calculate estimate totals
  const estimateTotals = useMemo(() => {
    if (!selectedEstimate) return null;
    const items = selectedEstimate.items;
    return {
      total_direct: items.reduce((sum, item) => sum + item.calculated.directCost * item.quantity, 0),
      total_indirect: items.reduce((sum, item) => sum + item.calculated.indirectCost * item.quantity, 0),
      total_profit: items.reduce((sum, item) => sum + item.calculated.profit * item.quantity, 0),
      total_contingency: items.reduce((sum, item) => sum + (item.calculated.breakdown.contingency ?? 0) * item.quantity, 0),
      total_selling: items.reduce((sum, item) => sum + item.calculated.total, 0),
      materials_cost: items.reduce((sum, item) => sum + item.calculated.materialCost * item.quantity, 0),
      labor_cost: items.reduce((sum, item) => sum + item.calculated.laborCost * item.quantity, 0),
      equipment_cost: items.reduce((sum, item) => sum + item.calculated.equipmentCost * item.quantity, 0),
    };
  }, [selectedEstimate]);

  const handleSelectTemplate = (templateCode: string) => {
    const template = boqTemplates.find((t) => t.code === templateCode);
    if (template) {
      setNewItemForm({
        ...newItemForm,
        boq_code: template.code,
        description_ar: template.name_ar,
        description_en: template.name_en,
        unit: template.unit,
        materials: template.materials,
        labor: template.labor,
        equipment: template.equipment,
      });
    }
  };

  // Handle productivity template selection
  const handleSelectProductivityTemplate = (template: ProductivityTemplate, laborItems: LaborItem[]) => {
    // Convert productivity labor items to ComponentItem format
    // The qty represents crew count, we need to convert to daily cost factor
    const laborComponents: ComponentItem[] = laborItems.map(item => {
      const role = getCrewRoleByCode(item.rateCode);
      // For productivity-based items, qty = (1 / productivityRate) * crew_member_qty
      // This gives cost per unit based on how many days of that crew member are needed per unit
      const qtyPerUnit = item.qty / template.productivityRate;
      return {
        rateCode: item.rateCode,
        qty: qtyPerUnit,
        description: item.description
      };
    });

    setNewItemForm({
      ...newItemForm,
      boq_code: template.code,
      description_ar: template.nameAr,
      description_en: template.nameEn || "",
      unit: template.unitAr,
      materials: [], // Productivity templates focus on labor
      labor: laborComponents,
      equipment: [],
    });
  };

  const handleAddItem = () => {
    if (!selectedEstimate || !itemPreview) return;

    const newItem: EstimateItemData = {
      id: Date.now().toString(),
      boq_code: newItemForm.boq_code,
      description_ar: newItemForm.description_ar,
      description_en: newItemForm.description_en || undefined,
      unit: newItemForm.unit,
      quantity: newItemForm.quantity,
      calculated: itemPreview,
    };

    setEstimates((prev) =>
      prev.map((e) =>
        e.id === selectedEstimate.id
          ? { ...e, items: [...e.items, newItem] }
          : e
      )
    );
    setSelectedEstimate((prev) =>
      prev ? { ...prev, items: [...prev.items, newItem] } : null
    );

    setItemFormOpen(false);
    setNewItemForm({
      boq_code: "",
      description_ar: "",
      description_en: "",
      unit: "",
      quantity: 1,
      materials: [],
      labor: [],
      equipment: [],
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedEstimate) return;

    setEstimates((prev) =>
      prev.map((e) =>
        e.id === selectedEstimate.id
          ? { ...e, items: e.items.filter((i) => i.id !== itemId) }
          : e
      )
    );
    setSelectedEstimate((prev) =>
      prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : null
    );
  };

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (estimate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === "all" || estimate.status === statusFilter;
    const matchesProject =
      !projectIdFilter || estimate.project_id === projectIdFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Stats
  const stats = {
    total: estimates.length,
    approved: estimates.filter((e) => e.status === "APPROVED").length,
    pending: estimates.filter((e) => e.status === "PENDING_REVIEW").length,
    draft: estimates.filter((e) => e.status === "DRAFT").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {tCommon("total")}: {estimates.length}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addEstimate")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{tCommon("total")}</p>
        </div>
        <div className="rounded-lg border bg-green-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.approved")}</p>
        </div>
        <div className="rounded-lg border bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.pendingReview")}</p>
        </div>
        <div className="rounded-lg border bg-gray-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.draft")}</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estimates List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-auto rtl:left-3" />
              <Input
                placeholder={tCommon("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rtl:pr-3 rtl:pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("total")}</SelectItem>
                <SelectItem value="DRAFT">{t("statuses.draft")}</SelectItem>
                <SelectItem value="PENDING_REVIEW">{t("statuses.pendingReview")}</SelectItem>
                <SelectItem value="APPROVED">{t("statuses.approved")}</SelectItem>
                <SelectItem value="REJECTED">{t("statuses.rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-auto">
            {filteredEstimates.map((estimate) => (
              <Card
                key={estimate.id}
                className={`cursor-pointer transition-colors ${
                  selectedEstimate?.id === estimate.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedEstimate(estimate)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {estimate.name || `${t("version")} ${estimate.version}`}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {estimate.project_name}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${statusColors[estimate.status]} flex items-center gap-1`}
                    >
                      {statusIcons[estimate.status]}
                      <span className="text-xs">
                        {t(`statuses.${estimate.status.toLowerCase().replace("_", "")}`)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>v{estimate.version}</span>
                    <span>{estimate.items.length} {tCommon("total")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Estimate Details */}
        <div className="lg:col-span-2">
          {selectedEstimate ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedEstimate.name || `${t("version")} ${selectedEstimate.version}`}
                    </CardTitle>
                    <CardDescription>{selectedEstimate.project_name}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfigOpen(!configOpen)}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      {configOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" onClick={() => setItemFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("addItem")}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Cost Configuration */}
              <Collapsible open={configOpen}>
                <CollapsibleContent>
                  <CardContent className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>{t("indirectRate")}: {formatPercent(selectedEstimate.indirect_rate)}</Label>
                        <Slider
                          value={[selectedEstimate.indirect_rate * 100]}
                          onValueChange={([value]) => {
                            setEstimates((prev) =>
                              prev.map((e) =>
                                e.id === selectedEstimate.id
                                  ? { ...e, indirect_rate: value / 100 }
                                  : e
                              )
                            );
                            setSelectedEstimate((prev) =>
                              prev ? { ...prev, indirect_rate: value / 100 } : null
                            );
                          }}
                          max={30}
                          step={0.5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("profitMargin")}: {formatPercent(selectedEstimate.profit_margin)}</Label>
                        <Slider
                          value={[selectedEstimate.profit_margin * 100]}
                          onValueChange={([value]) => {
                            setEstimates((prev) =>
                              prev.map((e) =>
                                e.id === selectedEstimate.id
                                  ? { ...e, profit_margin: value / 100 }
                                  : e
                              )
                            );
                            setSelectedEstimate((prev) =>
                              prev ? { ...prev, profit_margin: value / 100 } : null
                            );
                          }}
                          max={40}
                          step={0.5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("contingency")}: {formatPercent(selectedEstimate.contingency)}</Label>
                        <Slider
                          value={[selectedEstimate.contingency * 100]}
                          onValueChange={([value]) => {
                            setEstimates((prev) =>
                              prev.map((e) =>
                                e.id === selectedEstimate.id
                                  ? { ...e, contingency: value / 100 }
                                  : e
                              )
                            );
                            setSelectedEstimate((prev) =>
                              prev ? { ...prev, contingency: value / 100 } : null
                            );
                          }}
                          max={15}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>

              <CardContent>
                {/* Items Table */}
                {selectedEstimate.items.length > 0 ? (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("boqCode")}</TableHead>
                          <TableHead>{t("descriptionAr")}</TableHead>
                          <TableHead>{tCommon("unit")}</TableHead>
                          <TableHead className="text-left">{t("quantity")}</TableHead>
                          <TableHead className="text-left">{t("directCost")}</TableHead>
                          <TableHead className="text-left">{t("sellingRate")}</TableHead>
                          <TableHead className="text-left">{t("itemTotal")}</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEstimate.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.boq_code}</TableCell>
                            <TableCell>{item.description_ar}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="text-left">{item.quantity}</TableCell>
                            <TableCell className="text-left">
                              {formatCurrency(item.calculated.directCost)}
                            </TableCell>
                            <TableCell className="text-left">
                              {formatCurrency(item.calculated.sellingRate)}
                            </TableCell>
                            <TableCell className="text-left font-medium">
                              {formatCurrency(item.calculated.total)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{tCommon("noData")}</p>
                    <Button
                      variant="link"
                      onClick={() => setItemFormOpen(true)}
                      className="mt-2"
                    >
                      {t("addItem")}
                    </Button>
                  </div>
                )}

                {/* Totals Summary */}
                {estimateTotals && selectedEstimate.items.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-4">{tCommon("total")}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("materialsCost")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.materials_cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("laborCost")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.labor_cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("equipmentCost")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.equipment_cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("totalDirect")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.total_direct)}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("totalIndirect")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.total_indirect)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("totalProfit")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.total_profit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("totalContingency")}</p>
                        <p className="text-lg font-medium">{formatCurrency(estimateTotals.total_contingency)}</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded">
                        <p className="text-sm text-muted-foreground">{t("totalSelling")}</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(estimateTotals.total_selling)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  اختر تقدير من القائمة لعرض التفاصيل
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={itemFormOpen} onOpenChange={setItemFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addItem")}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="boq" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="boq">قوالب BOQ</TabsTrigger>
              <TabsTrigger value="productivity">قوالب الإنتاجية</TabsTrigger>
            </TabsList>

            <TabsContent value="boq" className="space-y-4">
              <div className="space-y-2">
                <Label>قالب BOQ</Label>
                <Select onValueChange={handleSelectTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قالب BOQ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {boqTemplates.map((template) => (
                      <SelectItem key={template.code} value={template.code}>
                        {template.code} - {template.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="productivity" className="space-y-4">
              <ProductivityTemplateSelector
                onSelect={handleSelectProductivityTemplate}
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("boqCode")}</Label>
              <Input
                value={newItemForm.boq_code}
                onChange={(e) =>
                  setNewItemForm({ ...newItemForm, boq_code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("unit")}</Label>
              <Input
                value={newItemForm.unit}
                onChange={(e) =>
                  setNewItemForm({ ...newItemForm, unit: e.target.value })
                }
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>{t("descriptionAr")}</Label>
              <Input
                value={newItemForm.description_ar}
                onChange={(e) =>
                  setNewItemForm({ ...newItemForm, description_ar: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("quantity")}</Label>
              <Input
                type="number"
                value={newItemForm.quantity}
                onChange={(e) =>
                  setNewItemForm({ ...newItemForm, quantity: Number(e.target.value) })
                }
              />
            </div>

            {/* Preview */}
            {itemPreview && (
              <div className="col-span-2 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-3">معاينة التكلفة</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("materialsCost")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.materialCost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("laborCost")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.laborCost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("equipmentCost")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.equipmentCost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("directCost")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.directCost)}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("totalIndirect")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.indirectCost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("totalProfit")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.profit)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("sellingRate")}</p>
                    <p className="font-medium">{formatCurrency(itemPreview.sellingRate)}</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded">
                    <p className="text-muted-foreground">{t("itemTotal")}</p>
                    <p className="font-bold text-primary">{formatCurrency(itemPreview.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemFormOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleAddItem} disabled={!itemPreview}>
              {tCommon("add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Estimate Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addEstimate")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("estimateName")}</Label>
              <Input
                value={newEstimateForm.name}
                onChange={(e) =>
                  setNewEstimateForm({ ...newEstimateForm, name: e.target.value })
                }
                placeholder="التقدير الأولي"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("indirectRate")}: {formatPercent(newEstimateForm.indirect_rate)}</Label>
              <Slider
                value={[newEstimateForm.indirect_rate * 100]}
                onValueChange={([value]) =>
                  setNewEstimateForm({ ...newEstimateForm, indirect_rate: value / 100 })
                }
                max={30}
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profitMargin")}: {formatPercent(newEstimateForm.profit_margin)}</Label>
              <Slider
                value={[newEstimateForm.profit_margin * 100]}
                onValueChange={([value]) =>
                  setNewEstimateForm({ ...newEstimateForm, profit_margin: value / 100 })
                }
                max={40}
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("contingency")}: {formatPercent(newEstimateForm.contingency)}</Label>
              <Slider
                value={[newEstimateForm.contingency * 100]}
                onValueChange={([value]) =>
                  setNewEstimateForm({ ...newEstimateForm, contingency: value / 100 })
                }
                max={15}
                step={0.5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={() => {
                const newEstimate: EstimateData = {
                  id: Date.now().toString(),
                  project_id: "1",
                  project_name: "مشروع جديد",
                  version: 1,
                  name: newEstimateForm.name || undefined,
                  indirect_rate: newEstimateForm.indirect_rate,
                  profit_margin: newEstimateForm.profit_margin,
                  contingency: newEstimateForm.contingency,
                  status: "DRAFT",
                  items: [],
                  created_at: new Date().toISOString(),
                };
                setEstimates((prev) => [...prev, newEstimate]);
                setSelectedEstimate(newEstimate);
                setFormOpen(false);
              }}
            >
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
