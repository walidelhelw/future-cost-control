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
import { crewRoles } from "@/data/crew-roles";

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

// Categories derived from rate types
const sampleCategories: RateCategoryLocal[] = [
  { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true },
  { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true },
  { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true },
];

// Real data extracted from Excel files (Cost Estimation Sheets)
const sampleRates: RateLocal[] = [
  // Labor Rates (22 items from Excel Sheet 16)
  { id: "1", category_id: "2", code: "LAB-CARP-FND", name_ar: "نجار - قواعد عادية", name_en: "Carpenter - Plain Foundations", unit: "م³/يوم", current_rate: 10, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "2", category_id: "2", code: "LAB-CARP-SLAB", name_ar: "نجار - لبشة عادية", name_en: "Carpenter - Plain Slab", unit: "م³/يوم", current_rate: 50, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "3", category_id: "2", code: "LAB-CARP-RFND", name_ar: "نجار - قواعد مسلحة", name_en: "Carpenter - Reinforced Foundations", unit: "م³/يوم", current_rate: 3, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "4", category_id: "2", code: "LAB-CARP-COL", name_ar: "نجار - أعمدة", name_en: "Carpenter - Columns", unit: "م³/يوم", current_rate: 1.5, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "5", category_id: "2", code: "LAB-CARP-SOLID", name_ar: "نجار - أسقف سوليد", name_en: "Carpenter - Solid Slab", unit: "م³/يوم", current_rate: 3, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "6", category_id: "2", code: "LAB-CARP-FLAT", name_ar: "نجار - أسقف فلات", name_en: "Carpenter - Flat Slab", unit: "م³/يوم", current_rate: 5, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "7", category_id: "2", code: "LAB-STEEL-FND", name_ar: "حداد - قواعد مسلحة", name_en: "Steel Fixer - Foundations", unit: "م³/يوم", current_rate: 3, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "8", category_id: "2", code: "LAB-STEEL-SLAB", name_ar: "حداد - لبشة", name_en: "Steel Fixer - Slab", unit: "م³/يوم", current_rate: 5, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "9", category_id: "2", code: "LAB-STEEL-COL", name_ar: "حداد - أعمدة", name_en: "Steel Fixer - Columns", unit: "م³/يوم", current_rate: 2.5, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "10", category_id: "2", code: "LAB-MASON-BRICK", name_ar: "بناء - طوب", name_en: "Mason - Brickwork", unit: "م³/يوم", current_rate: 4, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "11", category_id: "2", code: "LAB-PLASTER-SPRAY", name_ar: "مبيض - طرطشة", name_en: "Plasterer - Spray", unit: "م²/يوم", current_rate: 200, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "12", category_id: "2", code: "LAB-PLASTER-DOTS", name_ar: "مبيض - بؤج", name_en: "Plasterer - Dots", unit: "م²/يوم", current_rate: 150, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "13", category_id: "2", code: "LAB-PLASTER-INT", name_ar: "مبيض - ملو داخلي", name_en: "Plasterer - Interior", unit: "م²/يوم", current_rate: 40, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "14", category_id: "2", code: "LAB-PLASTER-CEIL", name_ar: "مبيض - ملو أسقف", name_en: "Plasterer - Ceiling", unit: "م²/يوم", current_rate: 30, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "15", category_id: "2", code: "LAB-PLASTER-EXT", name_ar: "مبيض - ملو خارجي", name_en: "Plasterer - Exterior", unit: "م²/يوم", current_rate: 25, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "16", category_id: "2", code: "LAB-PAINT-PUTTY", name_ar: "نقاش - معجون وصنفرة", name_en: "Painter - Putty & Sanding", unit: "م²/يوم", current_rate: 60, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "17", category_id: "2", code: "LAB-PAINT-PLASTIC", name_ar: "نقاش - دهان بلاستيك", name_en: "Painter - Plastic Paint", unit: "م²/يوم", current_rate: 200, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "18", category_id: "2", code: "LAB-TILE-FLOOR", name_ar: "مبلط - أرضيات سيراميك", name_en: "Tiler - Floor Ceramic", unit: "م²/يوم", current_rate: 25, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "19", category_id: "2", code: "LAB-TILE-WALL", name_ar: "مبلط - حوائط سيراميك", name_en: "Tiler - Wall Ceramic", unit: "م²/يوم", current_rate: 15, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "20", category_id: "2", code: "LAB-MARBLE-FLOOR", name_ar: "مرخماتي - أرضيات", name_en: "Marble Worker - Floor", unit: "م²/يوم", current_rate: 15, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "21", category_id: "2", code: "LAB-MARBLE-STAIR", name_ar: "مرخماتي - درج سلم", name_en: "Marble Worker - Stairs", unit: "م.ط/يوم", current_rate: 12, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },
  { id: "22", category_id: "2", code: "LAB-WP-BITUMEN", name_ar: "صنايعي - عزل بيتومين", name_en: "Waterproofing - Bitumen", unit: "م²/يوم", current_rate: 100, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR", sort_order: 2, is_active: true } },

  // Material Rates (20 items from Excel Sheets 17-18)
  { id: "23", category_id: "1", code: "MAT-CONC-PLAIN", name_ar: "خرسانة عادية", name_en: "Plain Concrete", unit: "م³", current_rate: 750, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, notes: "0.8م³ زلط + 0.4م³ رمل + 250كجم أسمنت", category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "24", category_id: "1", code: "MAT-CONC-REINF", name_ar: "خرسانة مسلحة", name_en: "Reinforced Concrete", unit: "م³", current_rate: 950, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, notes: "0.8م³ زلط + 0.4م³ رمل + 350كجم أسمنت", category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "25", category_id: "1", code: "MAT-STEEL-FND", name_ar: "حديد تسليح قواعد", name_en: "Steel Rebar - Foundations", unit: "كجم", current_rate: 28, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "26", category_id: "1", code: "MAT-STEEL-COL", name_ar: "حديد تسليح أعمدة", name_en: "Steel Rebar - Columns", unit: "كجم", current_rate: 28, waste_factor: 1.03, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "27", category_id: "1", code: "MAT-STEEL-SLAB", name_ar: "حديد تسليح أسقف", name_en: "Steel Rebar - Slabs", unit: "كجم", current_rate: 28, waste_factor: 1.03, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "28", category_id: "1", code: "MAT-CEMENT", name_ar: "أسمنت رمادي", name_en: "Grey Cement", unit: "طن", current_rate: 2500, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "29", category_id: "1", code: "MAT-SAND", name_ar: "رمل", name_en: "Sand", unit: "م³", current_rate: 180, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "30", category_id: "1", code: "MAT-GRAVEL", name_ar: "زلط", name_en: "Gravel", unit: "م³", current_rate: 220, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "31", category_id: "1", code: "MAT-BRICK-SINGLE", name_ar: "طوب فرداني", name_en: "Single Brick", unit: "1000 طوبة", current_rate: 1800, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "32", category_id: "1", code: "MAT-BRICK-DOUBLE", name_ar: "طوب دبل", name_en: "Double Brick", unit: "1000 طوبة", current_rate: 3200, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "33", category_id: "1", code: "MAT-PLASTER-MORTAR", name_ar: "مونة بياض", name_en: "Plaster Mortar", unit: "م³", current_rate: 850, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, notes: "1م³ رمل + 350كجم أسمنت", category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "34", category_id: "1", code: "MAT-PUTTY", name_ar: "معجون", name_en: "Putty", unit: "كجم", current_rate: 25, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "35", category_id: "1", code: "MAT-SEALER", name_ar: "سيلار", name_en: "Sealer", unit: "لتر", current_rate: 45, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "36", category_id: "1", code: "MAT-PAINT-PLASTIC", name_ar: "دهان بلاستيك", name_en: "Plastic Paint", unit: "لتر", current_rate: 85, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "37", category_id: "1", code: "MAT-CERAMIC-FLOOR", name_ar: "سيراميك أرضيات", name_en: "Floor Ceramic", unit: "م²", current_rate: 120, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "38", category_id: "1", code: "MAT-CERAMIC-WALL", name_ar: "سيراميك حوائط", name_en: "Wall Ceramic", unit: "م²", current_rate: 100, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "39", category_id: "1", code: "MAT-MARBLE", name_ar: "رخام", name_en: "Marble", unit: "م²", current_rate: 450, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "40", category_id: "1", code: "MAT-GRANITE", name_ar: "جرانيت", name_en: "Granite", unit: "م²", current_rate: 550, waste_factor: 1.05, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "41", category_id: "1", code: "MAT-BITUMEN", name_ar: "بيتومين", name_en: "Bitumen", unit: "لتر", current_rate: 35, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },
  { id: "42", category_id: "1", code: "MAT-MEMBRANE", name_ar: "ممبرين", name_en: "Membrane", unit: "م²", current_rate: 75, waste_factor: 1.1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "1", code: "MAT", name_ar: "المواد", name_en: "Materials", type: "MATERIAL", sort_order: 1, is_active: true } },

  // Equipment Rates (9 items from Excel)
  { id: "43", category_id: "3", code: "EQP-MIXER", name_ar: "خلاطة خرسانة", name_en: "Concrete Mixer", unit: "يوم", current_rate: 500, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "44", category_id: "3", code: "EQP-VIBRATOR", name_ar: "هزاز خرسانة", name_en: "Concrete Vibrator", unit: "يوم", current_rate: 200, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "45", category_id: "3", code: "EQP-PUMP", name_ar: "مضخة خرسانة", name_en: "Concrete Pump", unit: "يوم", current_rate: 3500, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "46", category_id: "3", code: "EQP-CRANE", name_ar: "رافعة", name_en: "Crane", unit: "يوم", current_rate: 5000, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "47", category_id: "3", code: "EQP-SCAFFOLDING", name_ar: "سقالات", name_en: "Scaffolding", unit: "م²/شهر", current_rate: 25, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "48", category_id: "3", code: "EQP-EXCAVATOR", name_ar: "حفار", name_en: "Excavator", unit: "يوم", current_rate: 4500, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "49", category_id: "3", code: "EQP-LOADER", name_ar: "لودر", name_en: "Loader", unit: "يوم", current_rate: 3000, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "50", category_id: "3", code: "EQP-TRUCK", name_ar: "سيارة نقل", name_en: "Truck", unit: "رحلة", current_rate: 350, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },
  { id: "51", category_id: "3", code: "EQP-COMPACTOR", name_ar: "هراس", name_en: "Compactor", unit: "يوم", current_rate: 2500, waste_factor: 1, effective_from: "2024-01-01", source: "excel", is_active: true, category: { id: "3", code: "EQP", name_ar: "المعدات", name_en: "Equipment", type: "EQUIPMENT", sort_order: 3, is_active: true } },

  // Productivity Labor Rates (from الانتاجيات Excel)
  ...crewRoles.map((role, index) => ({
    id: `prod-${index + 100}`,
    category_id: "2",
    code: role.code,
    name_ar: role.nameAr,
    name_en: role.nameEn,
    unit: role.unitAr,
    current_rate: role.dailyRate,
    waste_factor: 1,
    effective_from: "2024-01-01",
    source: "الانتاجيات",
    is_active: true,
    notes: role.description,
    category: { id: "2", code: "LAB", name_ar: "العمالة", name_en: "Labor", type: "LABOR" as RateType, sort_order: 2, is_active: true }
  })),
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
