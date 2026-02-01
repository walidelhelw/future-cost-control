/**
 * Condition Factors - Productivity Adjustment Modifiers
 *
 * These factors adjust productivity rates based on site conditions,
 * weather, access constraints, and work complexity. A factor of 1.0
 * means no adjustment; factors < 1.0 reduce productivity.
 *
 * Formula: Adjusted Productivity = Base Productivity × Factor
 * Multiple factors can be multiplied together for combined effect.
 */

export interface ConditionFactor {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: ConditionCategory;
  factor: number;  // 0.6 = 60% of normal productivity
  description?: string;
  icon?: string;
}

export type ConditionCategory =
  | 'weather'     // الطقس
  | 'site'        // الموقع
  | 'access'      // الوصول
  | 'complexity'  // التعقيد
  | 'schedule';   // الجدول الزمني

/**
 * Condition Factors Database
 */
export const conditionFactors: ConditionFactor[] = [
  // ========================================
  // الطقس - Weather Conditions
  // ========================================
  {
    id: 'weather-extreme-heat',
    code: 'WTH-HEAT',
    nameAr: 'حرارة شديدة (> 40°م)',
    nameEn: 'Extreme Heat (> 40°C)',
    category: 'weather',
    factor: 0.80,
    description: 'Reduced productivity due to extreme heat, mandatory rest breaks',
    icon: '🌡️'
  },
  {
    id: 'weather-heat',
    code: 'WTH-WARM',
    nameAr: 'حرارة مرتفعة (35-40°م)',
    nameEn: 'High Heat (35-40°C)',
    category: 'weather',
    factor: 0.90,
    description: 'Moderately reduced productivity due to heat',
    icon: '☀️'
  },
  {
    id: 'weather-rain-light',
    code: 'WTH-RAIN-L',
    nameAr: 'أمطار خفيفة',
    nameEn: 'Light Rain',
    category: 'weather',
    factor: 0.85,
    description: 'Light rain affecting outdoor work',
    icon: '🌧️'
  },
  {
    id: 'weather-rain-heavy',
    code: 'WTH-RAIN-H',
    nameAr: 'أمطار غزيرة',
    nameEn: 'Heavy Rain',
    category: 'weather',
    factor: 0.60,
    description: 'Heavy rain severely limiting outdoor work',
    icon: '⛈️'
  },
  {
    id: 'weather-wind',
    code: 'WTH-WIND',
    nameAr: 'رياح قوية',
    nameEn: 'Strong Winds',
    category: 'weather',
    factor: 0.75,
    description: 'High winds affecting crane operations and elevated work',
    icon: '💨'
  },
  {
    id: 'weather-sandstorm',
    code: 'WTH-SAND',
    nameAr: 'عاصفة رملية',
    nameEn: 'Sandstorm',
    category: 'weather',
    factor: 0.40,
    description: 'Sandstorm conditions, minimal work possible',
    icon: '🏜️'
  },
  {
    id: 'weather-cold',
    code: 'WTH-COLD',
    nameAr: 'برد شديد (< 5°م)',
    nameEn: 'Extreme Cold (< 5°C)',
    category: 'weather',
    factor: 0.85,
    description: 'Cold conditions affecting concrete work and worker efficiency',
    icon: '❄️'
  },

  // ========================================
  // الموقع - Site Conditions
  // ========================================
  {
    id: 'site-confined',
    code: 'SITE-CONF',
    nameAr: 'مساحة ضيقة',
    nameEn: 'Confined Space',
    category: 'site',
    factor: 0.70,
    description: 'Limited working space reducing movement and equipment use',
    icon: '📦'
  },
  {
    id: 'site-height',
    code: 'SITE-HIGH',
    nameAr: 'عمل على ارتفاع (> 15م)',
    nameEn: 'Working at Height (> 15m)',
    category: 'site',
    factor: 0.75,
    description: 'Additional safety measures and reduced movement at height',
    icon: '🏗️'
  },
  {
    id: 'site-underground',
    code: 'SITE-UNDER',
    nameAr: 'عمل تحت الأرض',
    nameEn: 'Underground Work',
    category: 'site',
    factor: 0.65,
    description: 'Limited space, ventilation needs, and lighting requirements',
    icon: '⛏️'
  },
  {
    id: 'site-hazmat',
    code: 'SITE-HAZ',
    nameAr: 'بيئة خطرة',
    nameEn: 'Hazardous Environment',
    category: 'site',
    factor: 0.60,
    description: 'Hazardous materials or conditions requiring extra precautions',
    icon: '☢️'
  },
  {
    id: 'site-occupied',
    code: 'SITE-OCC',
    nameAr: 'موقع مشغول',
    nameEn: 'Occupied Site',
    category: 'site',
    factor: 0.80,
    description: 'Work in occupied building with restrictions',
    icon: '🏢'
  },
  {
    id: 'site-remote',
    code: 'SITE-REM',
    nameAr: 'موقع نائي',
    nameEn: 'Remote Location',
    category: 'site',
    factor: 0.85,
    description: 'Remote location with limited resources',
    icon: '🏔️'
  },

  // ========================================
  // الوصول - Access Conditions
  // ========================================
  {
    id: 'access-limited',
    code: 'ACC-LIM',
    nameAr: 'وصول محدود',
    nameEn: 'Limited Access',
    category: 'access',
    factor: 0.80,
    description: 'Restricted access for materials and equipment',
    icon: '🚧'
  },
  {
    id: 'access-manual',
    code: 'ACC-MAN',
    nameAr: 'نقل يدوي',
    nameEn: 'Manual Transport',
    category: 'access',
    factor: 0.70,
    description: 'Materials must be moved manually (no crane/forklift)',
    icon: '🏋️'
  },
  {
    id: 'access-scaffolding',
    code: 'ACC-SCAF',
    nameAr: 'عبر سقالات',
    nameEn: 'Via Scaffolding',
    category: 'access',
    factor: 0.85,
    description: 'Work access only through scaffolding',
    icon: '🪜'
  },
  {
    id: 'access-traffic',
    code: 'ACC-TRAF',
    nameAr: 'قيود مرورية',
    nameEn: 'Traffic Restrictions',
    category: 'access',
    factor: 0.90,
    description: 'Limited delivery windows due to traffic restrictions',
    icon: '🚛'
  },

  // ========================================
  // التعقيد - Complexity Factors
  // ========================================
  {
    id: 'complexity-high',
    code: 'CMP-HIGH',
    nameAr: 'تعقيد عالي',
    nameEn: 'High Complexity',
    category: 'complexity',
    factor: 0.70,
    description: 'Complex geometry or intricate details',
    icon: '🔧'
  },
  {
    id: 'complexity-medium',
    code: 'CMP-MED',
    nameAr: 'تعقيد متوسط',
    nameEn: 'Medium Complexity',
    category: 'complexity',
    factor: 0.85,
    description: 'Moderate complexity requiring extra attention',
    icon: '🛠️'
  },
  {
    id: 'complexity-precision',
    code: 'CMP-PREC',
    nameAr: 'دقة عالية مطلوبة',
    nameEn: 'High Precision Required',
    category: 'complexity',
    factor: 0.75,
    description: 'Work requiring high precision and quality control',
    icon: '📐'
  },
  {
    id: 'complexity-rework',
    code: 'CMP-REWK',
    nameAr: 'إعادة عمل',
    nameEn: 'Rework/Remedial',
    category: 'complexity',
    factor: 0.65,
    description: 'Fixing or modifying existing work',
    icon: '🔄'
  },

  // ========================================
  // الجدول الزمني - Schedule Factors
  // ========================================
  {
    id: 'schedule-night',
    code: 'SCH-NIGHT',
    nameAr: 'عمل ليلي',
    nameEn: 'Night Shift',
    category: 'schedule',
    factor: 0.85,
    description: 'Night shift with reduced visibility and worker fatigue',
    icon: '🌙'
  },
  {
    id: 'schedule-overtime',
    code: 'SCH-OT',
    nameAr: 'عمل إضافي',
    nameEn: 'Overtime Work',
    category: 'schedule',
    factor: 0.90,
    description: 'Extended hours leading to reduced efficiency',
    icon: '⏰'
  },
  {
    id: 'schedule-weekend',
    code: 'SCH-WKND',
    nameAr: 'عمل في العطلة',
    nameEn: 'Weekend/Holiday',
    category: 'schedule',
    factor: 0.95,
    description: 'Work during non-standard days',
    icon: '📅'
  },
  {
    id: 'schedule-rush',
    code: 'SCH-RUSH',
    nameAr: 'عمل مستعجل',
    nameEn: 'Rush/Accelerated',
    category: 'schedule',
    factor: 0.80,
    description: 'Accelerated schedule with potential quality trade-offs',
    icon: '⚡'
  }
];

// ========================================
// Helper Functions
// ========================================

/**
 * Get factor by ID
 */
export function getFactorById(id: string): ConditionFactor | undefined {
  return conditionFactors.find(f => f.id === id);
}

/**
 * Get factor by code
 */
export function getFactorByCode(code: string): ConditionFactor | undefined {
  return conditionFactors.find(f => f.code === code);
}

/**
 * Get factors by category
 */
export function getFactorsByCategory(category: ConditionCategory): ConditionFactor[] {
  return conditionFactors.filter(f => f.category === category);
}

/**
 * Apply multiple condition factors to a base productivity rate
 * Returns the adjusted rate and the combined factor
 */
export function applyConditionFactors(
  baseProductivity: number,
  factorIds: string[]
): {
  adjustedProductivity: number;
  combinedFactor: number;
  appliedFactors: ConditionFactor[];
} {
  const appliedFactors = factorIds
    .map(id => getFactorById(id))
    .filter((f): f is ConditionFactor => f !== undefined);

  const combinedFactor = appliedFactors.reduce(
    (combined, factor) => combined * factor.factor,
    1.0
  );

  return {
    adjustedProductivity: baseProductivity * combinedFactor,
    combinedFactor,
    appliedFactors
  };
}

/**
 * Calculate the productivity impact percentage
 * Returns negative percentage (e.g., -20% for 0.80 factor)
 */
export function calculateImpactPercentage(factor: number): number {
  return (factor - 1) * 100;
}

/**
 * Get combined impact description
 */
export function getCombinedImpactDescription(
  appliedFactors: ConditionFactor[],
  locale: 'ar' | 'en' = 'ar'
): string {
  if (appliedFactors.length === 0) {
    return locale === 'ar' ? 'لا توجد عوامل مؤثرة' : 'No factors applied';
  }

  const factorNames = appliedFactors.map(f =>
    locale === 'ar' ? f.nameAr : f.nameEn
  );

  return factorNames.join(locale === 'ar' ? '، ' : ', ');
}

/**
 * Category labels for display
 */
export const conditionCategoryLabels: Record<ConditionCategory, { ar: string; en: string }> = {
  weather: { ar: 'الطقس', en: 'Weather' },
  site: { ar: 'ظروف الموقع', en: 'Site Conditions' },
  access: { ar: 'الوصول', en: 'Access' },
  complexity: { ar: 'التعقيد', en: 'Complexity' },
  schedule: { ar: 'الجدول الزمني', en: 'Schedule' }
};

/**
 * Preset combinations for common scenarios
 */
export interface ConditionPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  factorIds: string[];
  description?: string;
}

export const conditionPresets: ConditionPreset[] = [
  {
    id: 'summer-outdoor',
    nameAr: 'عمل صيفي خارجي',
    nameEn: 'Summer Outdoor Work',
    factorIds: ['weather-heat', 'schedule-overtime'],
    description: 'Typical summer conditions with extended hours'
  },
  {
    id: 'renovation',
    nameAr: 'أعمال تجديد',
    nameEn: 'Renovation Work',
    factorIds: ['site-occupied', 'access-limited', 'complexity-rework'],
    description: 'Work in occupied building with access challenges'
  },
  {
    id: 'high-rise',
    nameAr: 'مبنى شاهق',
    nameEn: 'High-Rise Building',
    factorIds: ['site-height', 'access-scaffolding'],
    description: 'Work on upper floors of tall buildings'
  },
  {
    id: 'underground-work',
    nameAr: 'أعمال تحت الأرض',
    nameEn: 'Underground Work',
    factorIds: ['site-underground', 'access-manual'],
    description: 'Basement or tunnel construction'
  },
  {
    id: 'fast-track',
    nameAr: 'تنفيذ سريع',
    nameEn: 'Fast-Track Execution',
    factorIds: ['schedule-rush', 'schedule-overtime', 'schedule-night'],
    description: 'Accelerated project with round-the-clock work'
  }
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): ConditionPreset | undefined {
  return conditionPresets.find(p => p.id === id);
}

/**
 * Apply a preset to a base productivity rate
 */
export function applyPreset(
  baseProductivity: number,
  presetId: string
): ReturnType<typeof applyConditionFactors> | null {
  const preset = getPresetById(presetId);
  if (!preset) return null;
  return applyConditionFactors(baseProductivity, preset.factorIds);
}

// Export count for reference
export const TOTAL_FACTORS = conditionFactors.length;
export const TOTAL_PRESETS = conditionPresets.length;
