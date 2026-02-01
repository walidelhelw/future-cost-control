/**
 * Productivity Categories - 26 Work Categories from Excel Data
 *
 * These categories represent the different types of construction work
 * tracked in the productivity database. Each category maps to one or
 * more Excel sheets from the الانتاجيات (Productivity) workbook.
 */

export interface ProductivityCategory {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  sortOrder: number;
  parentId?: string;
  icon?: string;
}

/**
 * 26 Work Categories from Productivity Excel
 * Organized by construction phase and specialty
 */
export const productivityCategories: ProductivityCategory[] = [
  // ========================================
  // أعمال الموقع - Site Works
  // ========================================
  {
    id: 'site-clearing',
    code: 'SITE-CLR',
    nameAr: 'تجهيز الموقع',
    nameEn: 'Site Clearing',
    description: 'Site preparation and clearing works',
    sortOrder: 1
  },
  {
    id: 'excavation',
    code: 'EXC',
    nameAr: 'أعمال الحفر',
    nameEn: 'Excavation Works',
    description: 'Excavation, trenching and earthworks',
    sortOrder: 2
  },
  {
    id: 'backfill',
    code: 'BKFL',
    nameAr: 'أعمال الردم',
    nameEn: 'Backfill Works',
    description: 'Backfilling and compaction',
    sortOrder: 3
  },

  // ========================================
  // أعمال الخرسانة - Concrete Works
  // ========================================
  {
    id: 'plain-concrete',
    code: 'CON-PL',
    nameAr: 'خرسانة عادية',
    nameEn: 'Plain Concrete',
    description: 'Plain concrete for foundations and leveling',
    sortOrder: 10
  },
  {
    id: 'reinforced-concrete',
    code: 'CON-RC',
    nameAr: 'خرسانة مسلحة',
    nameEn: 'Reinforced Concrete',
    description: 'Reinforced concrete structural elements',
    sortOrder: 11
  },
  {
    id: 'formwork',
    code: 'FW',
    nameAr: 'أعمال الشدات',
    nameEn: 'Formwork',
    description: 'Wooden and metal formwork',
    sortOrder: 12
  },
  {
    id: 'steel-fixing',
    code: 'STL',
    nameAr: 'أعمال الحديد',
    nameEn: 'Steel Fixing',
    description: 'Reinforcement steel cutting, bending, fixing',
    sortOrder: 13
  },

  // ========================================
  // أعمال المباني - Masonry Works
  // ========================================
  {
    id: 'brick-masonry',
    code: 'MAS-BRK',
    nameAr: 'مباني طوب',
    nameEn: 'Brick Masonry',
    description: 'Red brick wall construction',
    sortOrder: 20
  },
  {
    id: 'block-masonry',
    code: 'MAS-BLK',
    nameAr: 'مباني بلوك',
    nameEn: 'Block Masonry',
    description: 'Concrete block wall construction',
    sortOrder: 21
  },
  {
    id: 'stone-masonry',
    code: 'MAS-STN',
    nameAr: 'مباني حجر',
    nameEn: 'Stone Masonry',
    description: 'Natural stone wall construction',
    sortOrder: 22
  },

  // ========================================
  // أعمال العزل - Waterproofing & Insulation
  // ========================================
  {
    id: 'waterproofing',
    code: 'WP',
    nameAr: 'أعمال العزل المائي',
    nameEn: 'Waterproofing',
    description: 'Waterproofing membranes and coatings',
    sortOrder: 30
  },
  {
    id: 'thermal-insulation',
    code: 'INS-TH',
    nameAr: 'عزل حراري',
    nameEn: 'Thermal Insulation',
    description: 'Thermal insulation for roofs and walls',
    sortOrder: 31
  },

  // ========================================
  // أعمال البياض - Plastering Works
  // ========================================
  {
    id: 'internal-plaster',
    code: 'PLT-INT',
    nameAr: 'بياض داخلي',
    nameEn: 'Internal Plastering',
    description: 'Internal wall and ceiling plastering',
    sortOrder: 40
  },
  {
    id: 'external-plaster',
    code: 'PLT-EXT',
    nameAr: 'بياض خارجي',
    nameEn: 'External Plastering',
    description: 'External wall rendering',
    sortOrder: 41
  },
  {
    id: 'gypsum-works',
    code: 'GYP',
    nameAr: 'أعمال الجبس',
    nameEn: 'Gypsum Works',
    description: 'Gypsum board and cornices',
    sortOrder: 42
  },

  // ========================================
  // أعمال الأرضيات - Flooring Works
  // ========================================
  {
    id: 'ceramic-tiles',
    code: 'FLR-CER',
    nameAr: 'سيراميك وبورسلين',
    nameEn: 'Ceramic & Porcelain',
    description: 'Ceramic and porcelain tile installation',
    sortOrder: 50
  },
  {
    id: 'marble-granite',
    code: 'FLR-MRB',
    nameAr: 'رخام وجرانيت',
    nameEn: 'Marble & Granite',
    description: 'Marble and granite flooring',
    sortOrder: 51
  },

  // ========================================
  // أعمال الدهانات - Painting Works
  // ========================================
  {
    id: 'painting',
    code: 'PNT',
    nameAr: 'أعمال الدهانات',
    nameEn: 'Painting Works',
    description: 'Interior and exterior painting',
    sortOrder: 60
  },

  // ========================================
  // أعمال الألومنيوم والنجارة - Aluminum & Carpentry
  // ========================================
  {
    id: 'aluminum',
    code: 'ALU',
    nameAr: 'أعمال الالمونيوم',
    nameEn: 'Aluminum Works',
    description: 'Aluminum windows, doors and cladding',
    sortOrder: 70
  },
  {
    id: 'carpentry',
    code: 'WD',
    nameAr: 'أعمال الخشب',
    nameEn: 'Carpentry Works',
    description: 'Wooden doors, windows and finishes',
    sortOrder: 71
  },

  // ========================================
  // الأعمال الكهربائية - Electrical Works
  // ========================================
  {
    id: 'electrical',
    code: 'ELE',
    nameAr: 'أعمال الكهرباء',
    nameEn: 'Electrical Works',
    description: 'Electrical installations and wiring',
    sortOrder: 80
  },

  // ========================================
  // أعمال السباكة - Plumbing Works
  // ========================================
  {
    id: 'plumbing-supply',
    code: 'PLB-SUP',
    nameAr: 'تغذية مياه',
    nameEn: 'Water Supply',
    description: 'Water supply piping installation',
    sortOrder: 90
  },
  {
    id: 'plumbing-drainage',
    code: 'PLB-DRN',
    nameAr: 'صرف صحي',
    nameEn: 'Drainage',
    description: 'Drainage and sewage piping',
    sortOrder: 91
  },
  {
    id: 'pipe-installation',
    code: 'PIPE',
    nameAr: 'تركيب المواسير',
    nameEn: 'Pipe Installation',
    description: 'General pipe installation works',
    sortOrder: 92
  },

  // ========================================
  // أعمال التكييف - HVAC Works
  // ========================================
  {
    id: 'hvac',
    code: 'HVAC',
    nameAr: 'أعمال التكييف',
    nameEn: 'HVAC Works',
    description: 'Air conditioning and ventilation',
    sortOrder: 100
  },

  // ========================================
  // أعمال تخديمية - Site Services
  // ========================================
  {
    id: 'site-services',
    code: 'SVC',
    nameAr: 'أعمال تخديمية',
    nameEn: 'Site Services',
    description: 'Material handling, scaffolding, demolition',
    sortOrder: 4
  },

  // ========================================
  // أعمال الحديد الإنشائي - Structural Steel
  // ========================================
  {
    id: 'steel-works',
    code: 'STEEL',
    nameAr: 'أعمال الحديد الإنشائي',
    nameEn: 'Structural Steel Works',
    description: 'Steel frames, trusses, metal decking',
    sortOrder: 14
  },

  // ========================================
  // الأعمال المعدنية - Metal Works
  // ========================================
  {
    id: 'metal-works',
    code: 'MTL',
    nameAr: 'الأعمال المعدنية',
    nameEn: 'Metal Works',
    description: 'Steel doors, windows, railings, tanks',
    sortOrder: 72
  },

  // ========================================
  // أعمال اللاند سكيب - Landscape Works
  // ========================================
  {
    id: 'landscape',
    code: 'LAND',
    nameAr: 'أعمال الاند اسكيب',
    nameEn: 'Landscape Works',
    description: 'Paving, planting, outdoor works',
    sortOrder: 110
  },

  // ========================================
  // أعمال الأسانسير - Elevator Works
  // ========================================
  {
    id: 'elevator',
    code: 'ELEV',
    nameAr: 'أعمال الأسانسير',
    nameEn: 'Elevator Works',
    description: 'Elevator installation and testing',
    sortOrder: 120
  },

  // ========================================
  // أعمال متنوعة - Miscellaneous
  // ========================================
  {
    id: 'miscellaneous',
    code: 'MISC',
    nameAr: 'أعمال متنوعة',
    nameEn: 'Miscellaneous',
    description: 'Other construction activities',
    sortOrder: 200
  }
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): ProductivityCategory | undefined {
  return productivityCategories.find(cat => cat.id === id);
}

/**
 * Get category by code
 */
export function getCategoryByCode(code: string): ProductivityCategory | undefined {
  return productivityCategories.find(cat => cat.code === code);
}

/**
 * Get all categories sorted by sortOrder
 */
export function getSortedCategories(): ProductivityCategory[] {
  return [...productivityCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Category groups for display
 */
export interface CategoryGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  categories: string[]; // category IDs
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'site',
    nameAr: 'أعمال الموقع',
    nameEn: 'Site Works',
    categories: ['site-clearing', 'excavation', 'backfill', 'site-services']
  },
  {
    id: 'structure',
    nameAr: 'أعمال الهيكل',
    nameEn: 'Structural Works',
    categories: ['plain-concrete', 'reinforced-concrete', 'formwork', 'steel-fixing', 'steel-works']
  },
  {
    id: 'masonry',
    nameAr: 'أعمال المباني',
    nameEn: 'Masonry Works',
    categories: ['brick-masonry', 'block-masonry', 'stone-masonry']
  },
  {
    id: 'waterproofing',
    nameAr: 'أعمال العزل',
    nameEn: 'Waterproofing & Insulation',
    categories: ['waterproofing', 'thermal-insulation']
  },
  {
    id: 'finishing',
    nameAr: 'أعمال التشطيبات',
    nameEn: 'Finishing Works',
    categories: ['internal-plaster', 'external-plaster', 'gypsum-works', 'ceramic-tiles', 'marble-granite', 'painting', 'aluminum', 'carpentry', 'metal-works']
  },
  {
    id: 'mep',
    nameAr: 'الأعمال الكهروميكانيكية',
    nameEn: 'MEP Works',
    categories: ['electrical', 'plumbing-supply', 'plumbing-drainage', 'pipe-installation', 'hvac', 'elevator']
  },
  {
    id: 'external',
    nameAr: 'أعمال خارجية',
    nameEn: 'External Works',
    categories: ['landscape']
  }
];

/**
 * Get categories by group
 */
export function getCategoriesByGroup(groupId: string): ProductivityCategory[] {
  const group = categoryGroups.find(g => g.id === groupId);
  if (!group) return [];
  return group.categories
    .map(catId => getCategoryById(catId))
    .filter((cat): cat is ProductivityCategory => cat !== undefined);
}
