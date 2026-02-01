#!/usr/bin/env python3
"""
Generate productivity-templates.ts from extracted-productivity.json
"""

import json
import re
from pathlib import Path

# Load extracted data
data_path = Path(__file__).parent.parent / "src/data/extracted-productivity.json"
with open(data_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

def clean_text(text):
    """Remove RTL markers and extra whitespace"""
    if not text:
        return ""
    # Remove RTL/LTR markers
    text = re.sub(r'[\u200e\u200f\u202a-\u202e]', '', text)
    return text.strip()

def parse_crew(crew_str):
    """Parse crew string into structured format"""
    if not crew_str:
        return []

    crew_str = clean_text(crew_str)
    if not crew_str:
        return []

    crew = []

    # Common patterns
    patterns = [
        (r'(\d+)\s*عامل', 'LAB-GENERAL', 'عامل'),
        (r'(\d+)\s*مساعد', 'LAB-GENERAL', 'مساعد'),
        (r'صناعيى\s*و\s*(\d+)\s*مساعد', 'LAB-PLUMBER', 'صناعي'),  # Will add assistants
        (r'كهربائى\s*و\s*(\d+)\s*مساعد', 'LAB-ELECTRICIAN', 'كهربائي'),
        (r'نجار\s*\+\s*(\d+)\s*عامل', 'LAB-CARPENTER-FW', 'نجار'),
        (r'نحات\s*\+\s*عامل', 'LAB-DEMOLITION', 'نحات'),
        (r'(\d+)\s*نحات', 'LAB-DEMOLITION', 'نحات'),
        (r'نحات', 'LAB-DEMOLITION', 'نحات'),
        (r'ماكينة\s*\+\s*عامل', 'LAB-GENERAL', 'عامل'),
        (r'مجموعة عمل', 'LAB-GENERAL', 'مجموعة عمل'),
    ]

    # Try to match patterns
    if 'صناعيى و' in crew_str:
        crew.append({'roleCode': 'LAB-PLUMBER', 'qty': 1, 'description': 'صناعي'})
        match = re.search(r'(\d+)\s*مساعد', crew_str)
        if match:
            crew.append({'roleCode': 'LAB-PLUMBER-ASST', 'qty': int(match.group(1)), 'description': 'مساعد'})
    elif 'كهربائى و' in crew_str:
        crew.append({'roleCode': 'LAB-ELECTRICIAN', 'qty': 1, 'description': 'كهربائي'})
        match = re.search(r'(\d+)\s*مساعد', crew_str)
        if match:
            crew.append({'roleCode': 'LAB-ELECTRICIAN-ASST', 'qty': int(match.group(1)), 'description': 'مساعد'})
    elif 'صناعيى ومساعد' in crew_str:
        crew.append({'roleCode': 'LAB-CRAFTSMAN', 'qty': 1, 'description': 'صناعي'})
        crew.append({'roleCode': 'LAB-GENERAL', 'qty': 1, 'description': 'مساعد'})
    elif 'نجار+' in crew_str or 'نجار +' in crew_str:
        crew.append({'roleCode': 'LAB-CARPENTER-FW', 'qty': 1, 'description': 'نجار'})
        match = re.search(r'(\d+)\s*عامل', crew_str)
        if match:
            crew.append({'roleCode': 'LAB-GENERAL', 'qty': int(match.group(1)), 'description': 'عامل'})
    elif 'نحات+عامل' in crew_str or 'نحات + عامل' in crew_str:
        crew.append({'roleCode': 'LAB-DEMOLITION', 'qty': 1, 'description': 'نحات'})
        crew.append({'roleCode': 'LAB-GENERAL', 'qty': 1, 'description': 'عامل'})
    elif re.match(r'^\d+نحات$', crew_str.replace(' ', '')):
        match = re.search(r'(\d+)', crew_str)
        if match:
            crew.append({'roleCode': 'LAB-DEMOLITION', 'qty': int(match.group(1)), 'description': 'نحات'})
    elif crew_str == 'نحات':
        crew.append({'roleCode': 'LAB-DEMOLITION', 'qty': 1, 'description': 'نحات'})
    elif 'ماكينة' in crew_str:
        crew.append({'roleCode': 'EQP-COMPRESSOR', 'qty': 1, 'description': 'ماكينة'})
        crew.append({'roleCode': 'LAB-GENERAL', 'qty': 1, 'description': 'عامل'})
    elif 'مجموعة عمل' in crew_str:
        crew.append({'roleCode': 'LAB-GENERAL', 'qty': 3, 'description': 'مجموعة عمل'})
    elif re.match(r'^\d+عامل$', crew_str.replace(' ', '')):
        match = re.search(r'(\d+)', crew_str)
        if match:
            crew.append({'roleCode': 'LAB-GENERAL', 'qty': int(match.group(1)), 'description': 'عامل'})

    return crew

def generate_id(category, index, description):
    """Generate unique ID"""
    prefix_map = {
        'site-services': 'SVC',
        'pipe-installation': 'PIP',
        'electrical': 'ELE',
        'steel-works': 'STL',
        'metal-works': 'MTL',
        'carpentry': 'CRP',
        'aluminum': 'ALU',
        'landscape': 'LND',
        'elevator': 'ELV',
    }
    prefix = prefix_map.get(category, 'GEN')
    return f"{prefix}-{index:03d}"

def generate_code(category, index):
    """Generate code"""
    prefix_map = {
        'site-services': 'SVC',
        'pipe-installation': 'PIPE',
        'electrical': 'ELEC',
        'steel-works': 'STEEL',
        'metal-works': 'METAL',
        'carpentry': 'CARP',
        'aluminum': 'ALUM',
        'landscape': 'LAND',
        'elevator': 'ELEV',
    }
    prefix = prefix_map.get(category, 'GEN')
    return f"{prefix}-{index:03d}"

# Group by category
by_category = {}
for item in items:
    cat = item['category']
    if cat not in by_category:
        by_category[cat] = []
    by_category[cat].append(item)

# Generate TypeScript
output = '''/**
 * Productivity Templates - BOQTemplate Data with Productivity Rates
 *
 * Contains ALL productivity data extracted from the Excel workbook (الانتاجيات).
 * Total: ''' + str(len(items)) + ''' templates from 9 sheets.
 *
 * Each template includes:
 * - productivity_rate: units produced per crew per day
 * - crew: labor roles needed with quantities
 * - source: origin of the productivity data (sheet name)
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
  productivityRate: number;
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
  | 'متوسط'
  | 'اعمال تخديميه'
  | 'تركيب المواسير'
  | 'اعمال الكهرباء'
  | 'اعمال الحديد'
  | 'الاعمال المعدنيه'
  | 'اعمال الخشب'
  | 'اعمال الالمونيوم'
  | 'اعمال الاند اسكيب'
  | 'اعمال الاسانسير';

/**
 * Productivity Templates Database
 * Extracted from Excel: الانتاجيات
 */
export const productivityTemplates: ProductivityTemplate[] = [
'''

category_names = {
    'site-services': 'أعمال تخديمية - Site Services',
    'pipe-installation': 'تركيب المواسير - Pipe Installation',
    'electrical': 'أعمال الكهرباء - Electrical Works',
    'steel-works': 'أعمال الحديد - Steel Works',
    'metal-works': 'الأعمال المعدنية - Metal Works',
    'carpentry': 'أعمال الخشب - Carpentry',
    'aluminum': 'أعمال الألومنيوم - Aluminum Works',
    'landscape': 'أعمال الاند اسكيب - Landscape',
    'elevator': 'أعمال الأسانسير - Elevator Works',
}

for cat_id, cat_items in by_category.items():
    cat_name = category_names.get(cat_id, cat_id)
    output += f'''  // ========================================
  // {cat_name}
  // ========================================
'''

    for idx, item in enumerate(cat_items, 1):
        template_id = generate_id(cat_id, idx, item['description'])
        code = generate_code(cat_id, idx)
        name_ar = clean_text(item['description'])
        unit_ar = clean_text(item['unit'])
        productivity = item['productivity']
        crew = parse_crew(item.get('crew', ''))
        crew_size = sum(c['qty'] for c in crew) if crew else 1
        source = item['sheet']
        note = item.get('note', '')

        crew_str = ',\n      '.join([
            f"{{ roleCode: '{c['roleCode']}', qty: {c['qty']}, description: '{c['description']}' }}"
            for c in crew
        ]) if crew else ''

        output += f'''  {{
    id: '{template_id}',
    code: '{code}',
    nameAr: '{name_ar}',
    categoryId: '{cat_id}',
    unit: '{unit_ar}',
    unitAr: '{unit_ar}',
    productivityRate: {productivity},
    crewSize: {crew_size},
    crew: [{crew_str}],
    source: '{source}',
    sourceRef: '{source}','''

        if note:
            output += f"\n    notes: '{note}',"

        output += '''
    isActive: true
  },
'''

output += '''];

// ========================================
// Helper Functions
// ========================================

export function getTemplateById(id: string): ProductivityTemplate | undefined {
  return productivityTemplates.find(t => t.id === id);
}

export function getTemplateByCode(code: string): ProductivityTemplate | undefined {
  return productivityTemplates.find(t => t.code === code);
}

export function getTemplatesByCategory(categoryId: string): ProductivityTemplate[] {
  return productivityTemplates.filter(t => t.categoryId === categoryId && t.isActive);
}

export function getTemplatesBySource(source: ProductivitySource): ProductivityTemplate[] {
  return productivityTemplates.filter(t => t.source === source && t.isActive);
}

export function searchTemplates(query: string): ProductivityTemplate[] {
  const lowerQuery = query.toLowerCase();
  return productivityTemplates.filter(t =>
    t.nameAr.includes(query) ||
    (t.nameEn?.toLowerCase().includes(lowerQuery))
  );
}

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
'''

# Write output
output_path = Path(__file__).parent.parent / "src/data/productivity-templates.ts"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Generated {len(items)} templates to {output_path}")
