/**
 * Crew Roles Data - Labor Rate Definitions
 *
 * Contains 33 labor role definitions extracted from the productivity Excel data.
 * These roles integrate with the existing MasterRate system using the 'LABOR' type.
 *
 * Rate codes follow the pattern: LAB-{ROLE}[-{SPECIALTY}]
 * Daily rates are in EGP (Egyptian Pounds)
 */

export interface CrewRole {
  code: string;
  nameAr: string;
  nameEn: string;
  unit: string;
  unitAr: string;
  dailyRate: number;
  category: CrewRoleCategory;
  description?: string;
}

export type CrewRoleCategory =
  | 'masonry'      // أعمال المباني
  | 'concrete'     // أعمال الخرسانة
  | 'finishing'    // أعمال التشطيبات
  | 'mep'          // الأعمال الكهروميكانيكية
  | 'structural'   // أعمال الهيكل
  | 'general'      // عمالة عامة
  | 'equipment'    // مشغلي معدات
  | 'supervision'; // إشراف

/**
 * 33 Labor Roles from Productivity Excel Data
 * Organized by specialty and sorted by daily rate
 */
export const crewRoles: CrewRole[] = [
  // ========================================
  // أعمال المباني - Masonry Works
  // ========================================
  {
    code: 'LAB-MASON',
    nameAr: 'بنا',
    nameEn: 'Mason',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 350,
    category: 'masonry',
    description: 'Skilled mason for brick and block work'
  },
  {
    code: 'LAB-MASON-ASST',
    nameAr: 'مساعد بنا',
    nameEn: 'Mason Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 200,
    category: 'masonry',
    description: 'Assistant to mason for material handling'
  },
  {
    code: 'LAB-MIXER',
    nameAr: 'عجان',
    nameEn: 'Mortar Mixer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 180,
    category: 'masonry',
    description: 'Prepares mortar and cement mixes'
  },

  // ========================================
  // أعمال الخرسانة - Concrete Works
  // ========================================
  {
    code: 'LAB-CARPENTER-FW',
    nameAr: 'نجار مسلح',
    nameEn: 'Formwork Carpenter',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 400,
    category: 'concrete',
    description: 'Skilled carpenter for concrete formwork'
  },
  {
    code: 'LAB-CARPENTER-ASST',
    nameAr: 'مساعد نجار',
    nameEn: 'Carpenter Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 220,
    category: 'concrete',
    description: 'Assistant for formwork assembly'
  },
  {
    code: 'LAB-STEELFIXER',
    nameAr: 'حداد مسلح',
    nameEn: 'Steel Fixer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 380,
    category: 'concrete',
    description: 'Cuts, bends and fixes reinforcement steel'
  },
  {
    code: 'LAB-STEELFIXER-ASST',
    nameAr: 'مساعد حداد',
    nameEn: 'Steel Fixer Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 200,
    category: 'concrete',
    description: 'Assists with steel reinforcement work'
  },
  {
    code: 'LAB-CONCRETE-POUR',
    nameAr: 'عامل صب',
    nameEn: 'Concrete Pourer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 200,
    category: 'concrete',
    description: 'Pours and vibrates concrete'
  },

  // ========================================
  // أعمال التشطيبات - Finishing Works
  // ========================================
  {
    code: 'LAB-PLASTERER',
    nameAr: 'مبيض',
    nameEn: 'Plasterer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 320,
    category: 'finishing',
    description: 'Skilled plasterer for internal/external work'
  },
  {
    code: 'LAB-PLASTERER-ASST',
    nameAr: 'مساعد مبيض',
    nameEn: 'Plasterer Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 180,
    category: 'finishing',
    description: 'Assists with plastering work'
  },
  {
    code: 'LAB-PAINTER',
    nameAr: 'دهان',
    nameEn: 'Painter',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 300,
    category: 'finishing',
    description: 'Skilled painter for all paint finishes'
  },
  {
    code: 'LAB-PAINTER-ASST',
    nameAr: 'مساعد دهان',
    nameEn: 'Painter Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 180,
    category: 'finishing',
    description: 'Assists with painting preparation and work'
  },
  {
    code: 'LAB-TILER',
    nameAr: 'مبلط',
    nameEn: 'Tiler',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 350,
    category: 'finishing',
    description: 'Skilled tiler for ceramic and porcelain'
  },
  {
    code: 'LAB-TILER-ASST',
    nameAr: 'مساعد مبلط',
    nameEn: 'Tiler Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 180,
    category: 'finishing',
    description: 'Assists with tile installation'
  },
  {
    code: 'LAB-MARBLE',
    nameAr: 'رخامي',
    nameEn: 'Marble Worker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 400,
    category: 'finishing',
    description: 'Skilled marble and granite installer'
  },
  {
    code: 'LAB-GYPSUM',
    nameAr: 'عامل جبس',
    nameEn: 'Gypsum Worker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 320,
    category: 'finishing',
    description: 'Gypsum board and false ceiling installer'
  },

  // ========================================
  // الأعمال الكهربائية - Electrical Works
  // ========================================
  {
    code: 'LAB-ELECTRICIAN',
    nameAr: 'كهربائي',
    nameEn: 'Electrician',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 380,
    category: 'mep',
    description: 'Licensed electrician for all electrical work'
  },
  {
    code: 'LAB-ELECTRICIAN-ASST',
    nameAr: 'مساعد كهربائي',
    nameEn: 'Electrician Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 200,
    category: 'mep',
    description: 'Assists with electrical installations'
  },

  // ========================================
  // الأعمال الصحية - Plumbing Works
  // ========================================
  {
    code: 'LAB-PLUMBER',
    nameAr: 'سباك',
    nameEn: 'Plumber',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 380,
    category: 'mep',
    description: 'Skilled plumber for water and drainage'
  },
  {
    code: 'LAB-PLUMBER-ASST',
    nameAr: 'مساعد سباك',
    nameEn: 'Plumber Assistant',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 200,
    category: 'mep',
    description: 'Assists with plumbing installations'
  },

  // ========================================
  // أعمال التكييف - HVAC Works
  // ========================================
  {
    code: 'LAB-HVAC-TECH',
    nameAr: 'فني تكييف',
    nameEn: 'HVAC Technician',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 400,
    category: 'mep',
    description: 'Skilled HVAC system installer'
  },
  {
    code: 'LAB-DUCT-INSTALLER',
    nameAr: 'فني دكت',
    nameEn: 'Duct Installer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 320,
    category: 'mep',
    description: 'Ductwork fabrication and installation'
  },

  // ========================================
  // أعمال الألومنيوم والنجارة - Aluminum & Carpentry
  // ========================================
  {
    code: 'LAB-ALUMINUM',
    nameAr: 'فني ألومنيوم',
    nameEn: 'Aluminum Technician',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 350,
    category: 'finishing',
    description: 'Aluminum windows and doors installer'
  },
  {
    code: 'LAB-CARPENTER-FINISH',
    nameAr: 'نجار تشطيب',
    nameEn: 'Finish Carpenter',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 380,
    category: 'finishing',
    description: 'Skilled carpenter for doors and woodwork'
  },

  // ========================================
  // أعمال العزل - Waterproofing Works
  // ========================================
  {
    code: 'LAB-WATERPROOF',
    nameAr: 'عامل عزل',
    nameEn: 'Waterproofing Worker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 280,
    category: 'structural',
    description: 'Applies waterproofing membranes and coatings'
  },
  {
    code: 'LAB-INSULATION',
    nameAr: 'عامل عزل حراري',
    nameEn: 'Insulation Worker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 260,
    category: 'structural',
    description: 'Installs thermal and acoustic insulation'
  },

  // ========================================
  // عمالة عامة - General Labor
  // ========================================
  {
    code: 'LAB-GENERAL',
    nameAr: 'عامل عادي',
    nameEn: 'General Laborer',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 150,
    category: 'general',
    description: 'Unskilled worker for general tasks'
  },
  {
    code: 'LAB-CLEANER',
    nameAr: 'عامل نظافة',
    nameEn: 'Cleaner',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 140,
    category: 'general',
    description: 'Site cleaning and debris removal'
  },
  {
    code: 'LAB-SCAFFOLD',
    nameAr: 'عامل سقالات',
    nameEn: 'Scaffolder',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 220,
    category: 'general',
    description: 'Erects and dismantles scaffolding'
  },

  // ========================================
  // مشغلي معدات - Equipment Operators
  // ========================================
  {
    code: 'LAB-CRANE-OP',
    nameAr: 'مشغل رافعة',
    nameEn: 'Crane Operator',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 500,
    category: 'equipment',
    description: 'Licensed crane operator'
  },
  {
    code: 'LAB-EXCAVATOR-OP',
    nameAr: 'مشغل حفار',
    nameEn: 'Excavator Operator',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 450,
    category: 'equipment',
    description: 'Excavator and earthmoving equipment operator'
  },
  {
    code: 'LAB-FORKLIFT-OP',
    nameAr: 'مشغل رافعة شوكية',
    nameEn: 'Forklift Operator',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 300,
    category: 'equipment',
    description: 'Forklift and material handling operator'
  },

  // ========================================
  // إشراف - Supervision
  // ========================================
  {
    code: 'LAB-FOREMAN',
    nameAr: 'مقاول باطن / فورمان',
    nameEn: 'Foreman',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 600,
    category: 'supervision',
    description: 'Site foreman supervising work crews'
  },

  // ========================================
  // أعمال الهدم والتكسير - Demolition Works
  // ========================================
  {
    code: 'LAB-DEMOLITION',
    nameAr: 'نحات',
    nameEn: 'Demolition Worker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 250,
    category: 'general',
    description: 'Skilled demolition and breaking work'
  },

  // ========================================
  // صناعيين - Craftsmen
  // ========================================
  {
    code: 'LAB-CRAFTSMAN',
    nameAr: 'صناعي',
    nameEn: 'Craftsman',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 320,
    category: 'finishing',
    description: 'Skilled craftsman for specialized work'
  },

  // ========================================
  // معدات - Equipment
  // ========================================
  {
    code: 'EQP-COMPRESSOR',
    nameAr: 'كمبروسور/ماكينة تكسير',
    nameEn: 'Compressor/Breaker',
    unit: 'day',
    unitAr: 'يوم',
    dailyRate: 500,
    category: 'equipment',
    description: 'Pneumatic breaker or compressor equipment'
  },
];

/**
 * Get crew role by code
 */
export function getCrewRoleByCode(code: string): CrewRole | undefined {
  return crewRoles.find(role => role.code === code);
}

/**
 * Get crew roles by category
 */
export function getCrewRolesByCategory(category: CrewRoleCategory): CrewRole[] {
  return crewRoles.filter(role => role.category === category);
}

/**
 * Calculate total daily cost for a crew
 */
export function calculateCrewDailyCost(crewCodes: string[]): number {
  return crewCodes.reduce((total, code) => {
    const role = getCrewRoleByCode(code);
    return total + (role?.dailyRate ?? 0);
  }, 0);
}

/**
 * Convert crew roles to MasterRate format for Rate Database import
 */
export function crewRolesToMasterRates(): Array<{
  code: string;
  name_ar: string;
  name_en: string;
  unit: string;
  current_rate: number;
  type: 'LABOR';
  source: string;
}> {
  return crewRoles.map(role => ({
    code: role.code,
    name_ar: role.nameAr,
    name_en: role.nameEn,
    unit: role.unitAr,
    current_rate: role.dailyRate,
    type: 'LABOR' as const,
    source: 'الانتاجيات'
  }));
}

/**
 * Crew role category labels
 */
export const crewRoleCategoryLabels: Record<CrewRoleCategory, { ar: string; en: string }> = {
  masonry: { ar: 'أعمال المباني', en: 'Masonry Works' },
  concrete: { ar: 'أعمال الخرسانة', en: 'Concrete Works' },
  finishing: { ar: 'أعمال التشطيبات', en: 'Finishing Works' },
  mep: { ar: 'الأعمال الكهروميكانيكية', en: 'MEP Works' },
  structural: { ar: 'أعمال الهيكل', en: 'Structural Works' },
  general: { ar: 'عمالة عامة', en: 'General Labor' },
  equipment: { ar: 'مشغلي معدات', en: 'Equipment Operators' },
  supervision: { ar: 'إشراف', en: 'Supervision' }
};
