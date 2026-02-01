/**
 * Productivity Templates - BOQTemplate Data with Productivity Rates
 *
 * Contains productivity data converted from the Excel workbook (الانتاجيات).
 * Each template includes:
 * - productivity_rate: units produced per crew per day
 * - crew: labor roles needed with quantities
 * - source: origin of the productivity data
 *
 * Data quality notes:
 * - Excluded Sheet3 (96.62% missing data)
 * - Good reference sheets: اعمال الكهرباء (5.93%), اعمال الالمونيوم (6.15%), اعمال الخشب (0%)
 */

import type { ComponentItem } from '@/lib/supabase';

export interface ProductivityTemplate {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  unit: string;
  unitAr: string;
  productivityRate: number;  // units per day per crew
  crewSize: number;
  crew: CrewMember[];
  source: ProductivitySource;
  sourceRef?: string;
  notes?: string;
  isActive: boolean;
}

export interface CrewMember {
  roleCode: string;
  qty: number;
  description?: string;
}

export type ProductivitySource =
  | 'بتروجت'
  | 'H.A'
  | 'البقري/النادي'
  | 'مصادر اخري'
  | 'متوسط';

/**
 * Productivity Templates Database
 * Organized by category with multi-source data where available
 */
export const productivityTemplates: ProductivityTemplate[] = [
  // ========================================
  // أعمال المباني - Masonry Works
  // ========================================
  {
    id: 'MAS-BRK-25-001',
    code: 'MAS-BRK-25',
    nameAr: 'مباني طوب أحمر 25×12×6 سم',
    nameEn: 'Red Brick Wall 25×12×6 cm',
    categoryId: 'brick-masonry',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 23,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-MASON', qty: 1, description: 'بنا' },
      { roleCode: 'LAB-MASON-ASST', qty: 1, description: 'مساعد بنا' },
      { roleCode: 'LAB-MIXER', qty: 1, description: 'عجان' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال المباني',
    isActive: true
  },
  {
    id: 'MAS-BRK-12-001',
    code: 'MAS-BRK-12',
    nameAr: 'مباني طوب أحمر 12×12×6 سم',
    nameEn: 'Red Brick Wall 12×12×6 cm',
    categoryId: 'brick-masonry',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 32,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-MASON', qty: 1, description: 'بنا' },
      { roleCode: 'LAB-MASON-ASST', qty: 1, description: 'مساعد بنا' },
      { roleCode: 'LAB-MIXER', qty: 1, description: 'عجان' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال المباني',
    isActive: true
  },
  {
    id: 'MAS-BLK-20-001',
    code: 'MAS-BLK-20',
    nameAr: 'مباني بلوك خرساني 20×20×40 سم',
    nameEn: 'Concrete Block Wall 20×20×40 cm',
    categoryId: 'block-masonry',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 18,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-MASON', qty: 1, description: 'بنا' },
      { roleCode: 'LAB-MASON-ASST', qty: 1, description: 'مساعد بنا' },
      { roleCode: 'LAB-MIXER', qty: 1, description: 'عجان' }
    ],
    source: 'بتروجت',
    sourceRef: 'اعمال المباني',
    isActive: true
  },

  // ========================================
  // أعمال البياض - Plastering Works
  // ========================================
  {
    id: 'PLT-INT-001',
    code: 'PLT-INT-STD',
    nameAr: 'بياض محارة داخلي',
    nameEn: 'Internal Cement Plastering',
    categoryId: 'internal-plaster',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 40,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PLASTERER', qty: 1, description: 'مبيض' },
      { roleCode: 'LAB-PLASTERER-ASST', qty: 1, description: 'مساعد مبيض' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال البياض',
    isActive: true
  },
  {
    id: 'PLT-EXT-001',
    code: 'PLT-EXT-STD',
    nameAr: 'بياض محارة خارجي',
    nameEn: 'External Cement Rendering',
    categoryId: 'external-plaster',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 30,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PLASTERER', qty: 1, description: 'مبيض' },
      { roleCode: 'LAB-PLASTERER-ASST', qty: 1, description: 'مساعد مبيض' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال البياض',
    isActive: true
  },
  {
    id: 'PLT-ROUGH-001',
    code: 'PLT-ROUGH',
    nameAr: 'طرطشة',
    nameEn: 'Rough Coat Plastering',
    categoryId: 'internal-plaster',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 80,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PLASTERER', qty: 1, description: 'مبيض' },
      { roleCode: 'LAB-PLASTERER-ASST', qty: 1, description: 'مساعد مبيض' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال البياض',
    isActive: true
  },

  // ========================================
  // أعمال الدهانات - Painting Works
  // ========================================
  {
    id: 'PNT-INT-001',
    code: 'PNT-INT-PLS',
    nameAr: 'دهان بلاستيك داخلي (3 أوجه)',
    nameEn: 'Internal Plastic Paint (3 coats)',
    categoryId: 'painting',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 45,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PAINTER', qty: 1, description: 'دهان' },
      { roleCode: 'LAB-PAINTER-ASST', qty: 1, description: 'مساعد دهان' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الدهانات',
    isActive: true
  },
  {
    id: 'PNT-EXT-001',
    code: 'PNT-EXT-PLS',
    nameAr: 'دهان بلاستيك خارجي (3 أوجه)',
    nameEn: 'External Plastic Paint (3 coats)',
    categoryId: 'painting',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 35,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PAINTER', qty: 1, description: 'دهان' },
      { roleCode: 'LAB-PAINTER-ASST', qty: 1, description: 'مساعد دهان' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الدهانات',
    isActive: true
  },
  {
    id: 'PNT-OIL-001',
    code: 'PNT-OIL-WD',
    nameAr: 'دهان زيتي للأخشاب',
    nameEn: 'Oil Paint for Wood',
    categoryId: 'painting',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 25,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PAINTER', qty: 1, description: 'دهان' },
      { roleCode: 'LAB-PAINTER-ASST', qty: 1, description: 'مساعد دهان' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الدهانات',
    isActive: true
  },

  // ========================================
  // أعمال الأرضيات - Flooring Works
  // ========================================
  {
    id: 'FLR-CER-001',
    code: 'FLR-CER-STD',
    nameAr: 'تركيب سيراميك أرضيات',
    nameEn: 'Floor Ceramic Installation',
    categoryId: 'ceramic-tiles',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 12,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-TILER', qty: 1, description: 'مبلط' },
      { roleCode: 'LAB-TILER-ASST', qty: 1, description: 'مساعد مبلط' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الارضيات',
    isActive: true
  },
  {
    id: 'FLR-CER-WALL-001',
    code: 'FLR-CER-WALL',
    nameAr: 'تركيب سيراميك حوائط',
    nameEn: 'Wall Ceramic Installation',
    categoryId: 'ceramic-tiles',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 10,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-TILER', qty: 1, description: 'مبلط' },
      { roleCode: 'LAB-TILER-ASST', qty: 1, description: 'مساعد مبلط' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الارضيات',
    isActive: true
  },
  {
    id: 'FLR-MRB-001',
    code: 'FLR-MRB-STD',
    nameAr: 'تركيب رخام أرضيات',
    nameEn: 'Marble Floor Installation',
    categoryId: 'marble-granite',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 8,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-MARBLE', qty: 1, description: 'رخامي' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الارضيات',
    isActive: true
  },

  // ========================================
  // أعمال الكهرباء - Electrical Works
  // ========================================
  {
    id: 'ELE-COND-001',
    code: 'ELE-COND-PVC',
    nameAr: 'تمديد مواسير كهرباء PVC',
    nameEn: 'PVC Electrical Conduit',
    categoryId: 'electrical',
    unit: 'm.l',
    unitAr: 'م.ط',
    productivityRate: 50,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 1, description: 'مساعد كهربائي' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-WIRE-001',
    code: 'ELE-WIRE-STD',
    nameAr: 'تمديد أسلاك كهرباء',
    nameEn: 'Electrical Wiring',
    categoryId: 'electrical',
    unit: 'm.l',
    unitAr: 'م.ط',
    productivityRate: 100,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 1, description: 'مساعد كهربائي' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-POINT-001',
    code: 'ELE-POINT-LT',
    nameAr: 'نقطة إنارة',
    nameEn: 'Lighting Point',
    categoryId: 'electrical',
    unit: 'point',
    unitAr: 'نقطة',
    productivityRate: 8,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 1, description: 'مساعد كهربائي' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-POINT-002',
    code: 'ELE-POINT-SK',
    nameAr: 'نقطة بريزة',
    nameEn: 'Socket Point',
    categoryId: 'electrical',
    unit: 'point',
    unitAr: 'نقطة',
    productivityRate: 10,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 1, description: 'مساعد كهربائي' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },

  // ========================================
  // أعمال السباكة - Plumbing Works
  // ========================================
  {
    id: 'PLB-SUP-001',
    code: 'PLB-SUP-PPR',
    nameAr: 'تركيب مواسير تغذية PPR',
    nameEn: 'PPR Water Supply Pipes',
    categoryId: 'pipe-installation',
    unit: 'm.l',
    unitAr: 'م.ط',
    productivityRate: 25,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PLUMBER', qty: 1, description: 'سباك' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 1, description: 'مساعد سباك' }
    ],
    source: 'متوسط',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PLB-DRN-001',
    code: 'PLB-DRN-PVC',
    nameAr: 'تركيب مواسير صرف PVC 4"',
    nameEn: 'PVC Drainage Pipes 4"',
    categoryId: 'pipe-installation',
    unit: 'm.l',
    unitAr: 'م.ط',
    productivityRate: 20,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-PLUMBER', qty: 1, description: 'سباك' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 1, description: 'مساعد سباك' }
    ],
    source: 'متوسط',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },

  // ========================================
  // أعمال الألومنيوم - Aluminum Works
  // ========================================
  {
    id: 'ALU-WIN-001',
    code: 'ALU-WIN-SLD',
    nameAr: 'تركيب شبابيك ألومنيوم منزلقة',
    nameEn: 'Sliding Aluminum Windows',
    categoryId: 'aluminum',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 6,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ALUMINUM', qty: 1, description: 'فني ألومنيوم' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-DOOR-001',
    code: 'ALU-DOOR-STD',
    nameAr: 'تركيب أبواب ألومنيوم',
    nameEn: 'Aluminum Doors',
    categoryId: 'aluminum',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 5,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-ALUMINUM', qty: 1, description: 'فني ألومنيوم' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },

  // ========================================
  // أعمال الخشب - Carpentry Works
  // ========================================
  {
    id: 'WD-DOOR-001',
    code: 'WD-DOOR-FLS',
    nameAr: 'تركيب أبواب خشب فلاش',
    nameEn: 'Flush Wooden Doors',
    categoryId: 'carpentry',
    unit: 'pc',
    unitAr: 'قطعة',
    productivityRate: 4,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-CARPENTER-FINISH', qty: 1, description: 'نجار تشطيب' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'WD-FRAME-001',
    code: 'WD-FRAME-STD',
    nameAr: 'تركيب حلق خشب',
    nameEn: 'Wooden Door Frame',
    categoryId: 'carpentry',
    unit: 'm.l',
    unitAr: 'م.ط',
    productivityRate: 10,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-CARPENTER-FINISH', qty: 1, description: 'نجار تشطيب' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },

  // ========================================
  // أعمال العزل - Waterproofing
  // ========================================
  {
    id: 'WP-BIT-001',
    code: 'WP-BIT-2LY',
    nameAr: 'عزل رولات بيتومين (طبقتين)',
    nameEn: 'Bitumen Roll Waterproofing (2 layers)',
    categoryId: 'waterproofing',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 40,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-WATERPROOF', qty: 1, description: 'عامل عزل' },
      { roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال العزل',
    isActive: true
  },
  {
    id: 'WP-LIQ-001',
    code: 'WP-LIQ-INS',
    nameAr: 'عزل سائل إنسوميل',
    nameEn: 'Liquid Insomeal Waterproofing',
    categoryId: 'waterproofing',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 60,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-WATERPROOF', qty: 1, description: 'عامل عزل' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال العزل',
    isActive: true
  },

  // ========================================
  // أعمال الخرسانة - Concrete Works
  // ========================================
  {
    id: 'FW-SLAB-001',
    code: 'FW-SLAB-WD',
    nameAr: 'شدة خشبية للأسقف',
    nameEn: 'Wooden Formwork for Slabs',
    categoryId: 'formwork',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 8,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-CARPENTER-FW', qty: 1, description: 'نجار مسلح' },
      { roleCode: 'LAB-CARPENTER-ASST', qty: 2, description: 'مساعد نجار' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الشدات',
    isActive: true
  },
  {
    id: 'FW-COL-001',
    code: 'FW-COL-WD',
    nameAr: 'شدة خشبية للأعمدة',
    nameEn: 'Wooden Formwork for Columns',
    categoryId: 'formwork',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 6,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-CARPENTER-FW', qty: 1, description: 'نجار مسلح' },
      { roleCode: 'LAB-CARPENTER-ASST', qty: 2, description: 'مساعد نجار' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الشدات',
    isActive: true
  },
  {
    id: 'STL-FIX-001',
    code: 'STL-FIX-FND',
    nameAr: 'تقطيع وتجنيش وتركيب حديد قواعد',
    nameEn: 'Foundation Steel Fixing',
    categoryId: 'steel-fixing',
    unit: 'ton',
    unitAr: 'طن',
    productivityRate: 0.8,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-STEELFIXER', qty: 1, description: 'حداد مسلح' },
      { roleCode: 'LAB-STEELFIXER-ASST', qty: 2, description: 'مساعد حداد' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-FIX-002',
    code: 'STL-FIX-SLB',
    nameAr: 'تقطيع وتجنيش وتركيب حديد أسقف',
    nameEn: 'Slab Steel Fixing',
    categoryId: 'steel-fixing',
    unit: 'ton',
    unitAr: 'طن',
    productivityRate: 0.6,
    crewSize: 3,
    crew: [
      { roleCode: 'LAB-STEELFIXER', qty: 1, description: 'حداد مسلح' },
      { roleCode: 'LAB-STEELFIXER-ASST', qty: 2, description: 'مساعد حداد' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },

  // ========================================
  // أعمال الجبس - Gypsum Works
  // ========================================
  {
    id: 'GYP-CEIL-001',
    code: 'GYP-CEIL-STD',
    nameAr: 'أسقف جبس بورد معلقة',
    nameEn: 'Suspended Gypsum Board Ceiling',
    categoryId: 'gypsum-works',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 15,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-GYPSUM', qty: 1, description: 'عامل جبس' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الجبس',
    isActive: true
  },
  {
    id: 'GYP-PART-001',
    code: 'GYP-PART-STD',
    nameAr: 'قواطيع جبس بورد',
    nameEn: 'Gypsum Board Partitions',
    categoryId: 'gypsum-works',
    unit: 'm²',
    unitAr: 'م²',
    productivityRate: 12,
    crewSize: 2,
    crew: [
      { roleCode: 'LAB-GYPSUM', qty: 1, description: 'عامل جبس' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }
    ],
    source: 'متوسط',
    sourceRef: 'اعمال الجبس',
    isActive: true
  }
];

// ========================================
// Helper Functions
// ========================================

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProductivityTemplate | undefined {
  return productivityTemplates.find(t => t.id === id);
}

/**
 * Get template by code
 */
export function getTemplateByCode(code: string): ProductivityTemplate | undefined {
  return productivityTemplates.find(t => t.code === code);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(categoryId: string): ProductivityTemplate[] {
  return productivityTemplates.filter(t => t.categoryId === categoryId && t.isActive);
}

/**
 * Get templates by source
 */
export function getTemplatesBySource(source: ProductivitySource): ProductivityTemplate[] {
  return productivityTemplates.filter(t => t.source === source && t.isActive);
}

/**
 * Search templates by name (Arabic or English)
 */
export function searchTemplates(query: string): ProductivityTemplate[] {
  const lowerQuery = query.toLowerCase();
  return productivityTemplates.filter(t =>
    t.nameAr.includes(query) ||
    (t.nameEn?.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Convert productivity template to BOQTemplate format
 */
export function templateToBOQTemplate(template: ProductivityTemplate): {
  code: string;
  name_ar: string;
  name_en?: string;
  unit: string;
  productivity_rate: number;
  crew_size: number;
  labor: ComponentItem[];
  materials: ComponentItem[];
  equipment: ComponentItem[];
  source: string;
  source_ref?: string;
} {
  return {
    code: template.code,
    name_ar: template.nameAr,
    name_en: template.nameEn,
    unit: template.unitAr,
    productivity_rate: template.productivityRate,
    crew_size: template.crewSize,
    labor: template.crew.map(c => ({
      rateCode: c.roleCode,
      qty: c.qty,
      description: c.description
    })),
    materials: [],
    equipment: [],
    source: template.source,
    source_ref: template.sourceRef
  };
}

/**
 * Multi-source productivity data for comparison
 */
export interface MultiSourceProductivity {
  code: string;
  nameAr: string;
  unit: string;
  sources: {
    source: ProductivitySource;
    productivityRate: number;
    crewSize: number;
  }[];
  averageRate: number;
}

/**
 * Get multi-source comparison for an activity
 * (Placeholder for when we have multi-source data)
 */
export function getMultiSourceComparison(code: string): MultiSourceProductivity | null {
  const templates = productivityTemplates.filter(t => t.code.startsWith(code.split('-').slice(0, 2).join('-')));
  if (templates.length === 0) return null;

  const primary = templates[0];
  return {
    code: primary.code,
    nameAr: primary.nameAr,
    unit: primary.unitAr,
    sources: templates.map(t => ({
      source: t.source,
      productivityRate: t.productivityRate,
      crewSize: t.crewSize
    })),
    averageRate: templates.reduce((sum, t) => sum + t.productivityRate, 0) / templates.length
  };
}

// Export count for reference
export const TOTAL_TEMPLATES = productivityTemplates.length;
export const ACTIVE_TEMPLATES = productivityTemplates.filter(t => t.isActive).length;
