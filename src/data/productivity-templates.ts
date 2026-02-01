/**
 * Productivity Templates - BOQTemplate Data with Productivity Rates
 *
 * Contains ALL productivity data extracted from the Excel workbook (الانتاجيات).
 * Total: 131 templates from 9 sheets.
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
  // ========================================
  // أعمال تخديمية - Site Services
  // ========================================
  {
    id: 'SVC-001',
    code: 'SVC-001',
    nameAr: 'رفع بلوك طابق واحد باليد العاملة',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 4.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-002',
    code: 'SVC-002',
    nameAr: 'تنزيل ورفع بلوك بالونش الجمل',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 12.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-003',
    code: 'SVC-003',
    nameAr: 'تحميل وتنزيل بلوك على العربية',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 10.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-004',
    code: 'SVC-004',
    nameAr: 'نقل وتوزيع بلوك ضمن الابنية فى المنسوب الواحد',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 16.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-005',
    code: 'SVC-005',
    nameAr: 'رفع بلاط ورخام للطوابق بالونش',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 180.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-006',
    code: 'SVC-006',
    nameAr: 'تحميل وتنزيل بلاط ورخام وسيراميك ضمن الادوار',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 200.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-007',
    code: 'SVC-007',
    nameAr: 'تحميل وتنزيل اسمنت على العربية',
    categoryId: 'site-services',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 10.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-008',
    code: 'SVC-008',
    nameAr: 'تكسير خرسانة يدوى',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 0.5,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-DEMOLITION', qty: 1, description: 'نحات' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-009',
    code: 'SVC-009',
    nameAr: 'تكسير خرسانة بالكمبروسور',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 3.0,
    crewSize: 2,
    crew: [{ roleCode: 'EQP-COMPRESSOR', qty: 1, description: 'ماكينة' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-010',
    code: 'SVC-010',
    nameAr: 'تكسير بلوك مع ازالة الناتج',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 3.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-DEMOLITION', qty: 2, description: 'نحات' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-011',
    code: 'SVC-011',
    nameAr: 'ترآيب سقائل معدنية للوجهات',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 70.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-CARPENTER-FW', qty: 1, description: 'نجار' },
      { roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-012',
    code: 'SVC-012',
    nameAr: 'فك سقايل للوجهات',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 100.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-CARPENTER-FW', qty: 1, description: 'نجار' },
      { roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-013',
    code: 'SVC-013',
    nameAr: 'ازالة البياض الداخلى مع ازالة الناتج',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 16.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-DEMOLITION', qty: 1, description: 'نحات' },
      { roleCode: 'LAB-GENERAL', qty: 1, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-014',
    code: 'SVC-014',
    nameAr: 'تحميل وتنزيل حديد تسليح مشكل',
    categoryId: 'site-services',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 2.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-015',
    code: 'SVC-015',
    nameAr: 'تكسير بلاط وازالة الناتج خارج من المبنى',
    categoryId: 'site-services',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 30.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-016',
    code: 'SVC-016',
    nameAr: 'رفع ورص بلوك هوردى',
    categoryId: 'site-services',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 250.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-017',
    code: 'SVC-017',
    nameAr: 'رفع وتوزيع اسمنت على الادوار بالونش',
    categoryId: 'site-services',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 7.0,
    crewSize: 2,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 2, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  {
    id: 'SVC-018',
    code: 'SVC-018',
    nameAr: 'رفع وتوزيع رمل على الادوار بالونش',
    categoryId: 'site-services',
    unit: 'م3',
    unitAr: 'م3',
    productivityRate: 6.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'عامل' }],
    source: 'اعمال تخديميه',
    sourceRef: 'اعمال تخديميه',
    isActive: true
  },
  // ========================================
  // تركيب المواسير - Pipe Installation
  // ========================================
  {
    id: 'PIP-001',
    code: 'PIPE-001',
    nameAr: 'مواسير صرف PVC طول القطعة 3م قطر الماسورة حتى 150 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 145.6,
    crewSize: 4,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 3, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-002',
    code: 'PIPE-002',
    nameAr: 'مواسير صرف PVC طول القطعة 6م قطر الماسورة حتى 150 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 266.4,
    crewSize: 4,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 3, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-003',
    code: 'PIPE-003',
    nameAr: 'مواسير صرف PVC طول القطعة 3م قطر الماسورة حتى 200 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 102.4,
    crewSize: 4,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 3, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-004',
    code: 'PIPE-004',
    nameAr: 'مواسير صرف PVC طول القطعة 6م قطر الماسورة حتى 200 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 204.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-005',
    code: 'PIPE-005',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة 75 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 52.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-006',
    code: 'PIPE-006',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة 100 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 49.6,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-007',
    code: 'PIPE-007',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة 150 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 36.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-008',
    code: 'PIPE-008',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة 225 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 24.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-009',
    code: 'PIPE-009',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة 300 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 19.2,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-010',
    code: 'PIPE-010',
    nameAr: 'مواسير من الفخار والتقفيل بمونة اسمنتية قطر الماسورة اآبر 300 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 12.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-011',
    code: 'PIPE-011',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة 75 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 100.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-012',
    code: 'PIPE-012',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة 100 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 80.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-013',
    code: 'PIPE-013',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة 150 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 61.6,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-014',
    code: 'PIPE-014',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة 225 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 32.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-015',
    code: 'PIPE-015',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة 300 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 20.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-016',
    code: 'PIPE-016',
    nameAr: 'مواسير من الفخار Flexible Joints قطر الماسورة اآبر 300 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 16.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-017',
    code: 'PIPE-017',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 375 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 30.4,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-018',
    code: 'PIPE-018',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 450 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 28.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-019',
    code: 'PIPE-019',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 525 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 27.2,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-020',
    code: 'PIPE-020',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 600 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 26.4,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-021',
    code: 'PIPE-021',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 675 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 23.2,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-022',
    code: 'PIPE-022',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 750 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 20.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-023',
    code: 'PIPE-023',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 1500 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 2.5,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-024',
    code: 'PIPE-024',
    nameAr: 'مواسير خرسانية طول القطعة 1.5 م قطر الماسورة حتى 1800 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 2.1,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-025',
    code: 'PIPE-025',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 375 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 40.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-026',
    code: 'PIPE-026',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 450 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 36.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-027',
    code: 'PIPE-027',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 525 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 32.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-028',
    code: 'PIPE-028',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 600 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 32.0,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-029',
    code: 'PIPE-029',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 675 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 29.6,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-030',
    code: 'PIPE-030',
    nameAr: 'مواسير خرسانية طول القطعة 2.5 م قطر الماسورة حتى 750 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 28.8,
    crewSize: 5,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 4, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-031',
    code: 'PIPE-031',
    nameAr: 'مواسير UPVC قطر 75 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 26.4,
    crewSize: 4,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 3, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-032',
    code: 'PIPE-032',
    nameAr: 'مواسير UPVC Fittings قطر 75 مم',
    categoryId: 'pipe-installation',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 24.8,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-033',
    code: 'PIPE-033',
    nameAr: 'مواسير Cast Iron قطر 75 مم',
    categoryId: 'pipe-installation',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 16.8,
    crewSize: 4,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' },
      { roleCode: 'LAB-PLUMBER-ASST', qty: 3, description: 'مساعد' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  {
    id: 'PIP-034',
    code: 'PIPE-034',
    nameAr: 'مواسير Cast Iron Fittings قطر 75 مم',
    categoryId: 'pipe-installation',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 17.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'تركيب المواسير',
    sourceRef: 'تركيب المواسير',
    isActive: true
  },
  // ========================================
  // أعمال الكهرباء - Electrical Works
  // ========================================
  {
    id: 'ELE-001',
    code: 'ELEC-001',
    nameAr: 'تركيب كابل، كابل واحد في خندق مع حماية',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 49.6,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-002',
    code: 'ELEC-002',
    nameAr: 'تركيب كابل، كابلان في خندق مع حماية',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 44.8,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-003',
    code: 'ELEC-003',
    nameAr: 'تركيب كابل، 5 كابلات في خندق مع حماية',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 34.4,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-004',
    code: 'ELEC-004',
    nameAr: 'تركيب كابل، 7 كابلات في خندق مع حماية',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 29.6,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-005',
    code: 'ELEC-005',
    nameAr: 'تركيب كابل، 8 كابلات في خندق مع حماية',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 28.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-006',
    code: 'ELEC-006',
    nameAr: 'تركيب كابل، كابلان في خندق مع حماية، قطر 100 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 14.4,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-007',
    code: 'ELEC-007',
    nameAr: 'تركيب كابل، كابلان في خندق مع حماية، قطر 135 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 12.8,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-008',
    code: 'ELEC-008',
    nameAr: 'تركيب كابل، 3 كابلات في خندق مع حماية، قطر 100 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 8.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-009',
    code: 'ELEC-009',
    nameAr: 'تركيب كابل، 6 كابلات في خندق مع حماية، قطر 100 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 5.6,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-010',
    code: 'ELEC-010',
    nameAr: 'تركيب كابل، 4 كابلات في خندق مع حماية، قطر 150 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 9.6,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-011',
    code: 'ELEC-011',
    nameAr: 'تركيب كابل، 36 كابل في خندق مع حماية، قطر 100 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 1.6,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-012',
    code: 'ELEC-012',
    nameAr: 'تركيب كابل، 10 كابلات في خندق مع حماية، قطر 100 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 4.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  {
    id: 'ELE-013',
    code: 'ELEC-013',
    nameAr: 'تركيب كابل، كابل واحد في خندق مع حماية، قطر 300 مم',
    categoryId: 'electrical',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 10.4,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-ELECTRICIAN', qty: 1, description: 'كهربائي' },
      { roleCode: 'LAB-ELECTRICIAN-ASST', qty: 2, description: 'مساعد' }],
    source: 'اعمال الكهرباء',
    sourceRef: 'اعمال الكهرباء',
    isActive: true
  },
  // ========================================
  // أعمال الحديد - Steel Works
  // ========================================
  {
    id: 'STL-001',
    code: 'STEEL-001',
    nameAr: 'Steel Frame and Roof Members',
    categoryId: 'steel-works',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 4.6,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-002',
    code: 'STEEL-002',
    nameAr: 'Wall Frame, Bow String Truss and Frame',
    categoryId: 'steel-works',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 1.6,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-003',
    code: 'STEEL-003',
    nameAr: 'Roof Frame, Curved Truss and Frame',
    categoryId: 'steel-works',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 5.2,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-004',
    code: 'STEEL-004',
    nameAr: 'Wall Frame, Glazed Frame and Atrium',
    categoryId: 'steel-works',
    unit: 'طن',
    unitAr: 'طن',
    productivityRate: 0.3,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-005',
    code: 'STEEL-005',
    nameAr: 'Horizontal heavy duty strutting',
    categoryId: 'steel-works',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-006',
    code: 'STEEL-006',
    nameAr: 'Diagonal heavy duty strutting',
    categoryId: 'steel-works',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 6.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-007',
    code: 'STEEL-007',
    nameAr: 'Metal Decking, large areas',
    categoryId: 'steel-works',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 70.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  {
    id: 'STL-008',
    code: 'STEEL-008',
    nameAr: 'Metal Decking, small or complicated',
    categoryId: 'steel-works',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 28.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الحديد',
    sourceRef: 'اعمال الحديد',
    isActive: true
  },
  // ========================================
  // الأعمال المعدنية - Metal Works
  // ========================================
  {
    id: 'MTL-001',
    code: 'METAL-001',
    nameAr: 'تركيب ابواب و شابيبك',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 150.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-002',
    code: 'METAL-002',
    nameAr: 'Windows, Steel, 1.0-3.0m2',
    categoryId: 'metal-works',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 9.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-003',
    code: 'METAL-003',
    nameAr: 'Windows, Steel, 3.0-7.0m2',
    categoryId: 'metal-works',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 4.8,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-004',
    code: 'METAL-004',
    nameAr: 'Windows, Steel, 7.0-10.0m2',
    categoryId: 'metal-works',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-005',
    code: 'METAL-005',
    nameAr: 'تركيب اعمال معدنية للاسوار والبلكونات',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 150.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-006',
    code: 'METAL-006',
    nameAr: 'تركيب اعمال معدنية للاسوار والبلكونات',
    categoryId: 'metal-works',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 20.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-007',
    code: 'METAL-007',
    nameAr: 'تركيب اعمال معدنية للدرابزين والادراج',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 100.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-008',
    code: 'METAL-008',
    nameAr: 'تركيب باب جرار',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 150.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-009',
    code: 'METAL-009',
    nameAr: 'تصنيع خزان سماآة 2-1.5 مم',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 80.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-010',
    code: 'METAL-010',
    nameAr: 'تصنيع خزانات 3 مم',
    categoryId: 'metal-works',
    unit: 'كجم',
    unitAr: 'كجم',
    productivityRate: 120.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-011',
    code: 'METAL-011',
    nameAr: 'تصنيع وتركيب زاوية معدنية لفواصل التمدد',
    categoryId: 'metal-works',
    unit: 'م.ط',
    unitAr: 'م.ط',
    productivityRate: 40.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  {
    id: 'MTL-012',
    code: 'METAL-012',
    nameAr: 'قص وتركيب زجاج على الحديد',
    categoryId: 'metal-works',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 9.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'الاعمال المعدنيه',
    sourceRef: 'الاعمال المعدنيه',
    isActive: true
  },
  // ========================================
  // أعمال الخشب - Carpentry
  // ========================================
  {
    id: 'CRP-001',
    code: 'CARP-001',
    nameAr: 'شبابيك خشب بعد اكتمال أعمال الحوائط',
    categoryId: 'carpentry',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 16.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-002',
    code: 'CARP-002',
    nameAr: 'تزجيج النوافذ – زجاج مفرد',
    categoryId: 'carpentry',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 16.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-003',
    code: 'CARP-003',
    nameAr: 'تزجيج النوافذ – زجاج مزدوج',
    categoryId: 'carpentry',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 10.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-004',
    code: 'CARP-004',
    nameAr: 'حلق أبواب من 1.0 إلى 3.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 1.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-005',
    code: 'CARP-005',
    nameAr: 'حلق أبواب من 3.0 إلى 7.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 3.2,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-006',
    code: 'CARP-006',
    nameAr: 'حلق أبواب من 7.0 إلى 10.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 6.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-007',
    code: 'CARP-007',
    nameAr: 'شبابيك خشب لين من 1.0 إلى 3.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 1.7,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-008',
    code: 'CARP-008',
    nameAr: 'شبابيك من 3.0 إلى 7.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 3.2,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-009',
    code: 'CARP-009',
    nameAr: 'شبابيك من 7.0 إلى 10.0 م²',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 7.2,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-010',
    code: 'CARP-010',
    nameAr: 'عتب خشب',
    categoryId: 'carpentry',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 97.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-011',
    code: 'CARP-011',
    nameAr: 'تعليق الأبواب (المفصلات والإكسسوارات)',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 7.2,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-012',
    code: 'CARP-012',
    nameAr: 'التخريم في الباب وتركيب الكالون',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 5.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-013',
    code: 'CARP-013',
    nameAr: 'تركيب نظام فواصل دورات المياه – ألواح الفصل',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 6.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-014',
    code: 'CARP-014',
    nameAr: 'تركيب نظام فواصل دورات المياه – الألواح الأمامية للحائط',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 5.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  {
    id: 'CRP-015',
    code: 'CARP-015',
    nameAr: 'تركيب نظام فواصل دورات المياه – باب مفصلي مثبت بالحائط',
    categoryId: 'carpentry',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 4.8,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الخشب',
    sourceRef: 'اعمال الخشب',
    isActive: true
  },
  // ========================================
  // أعمال الألومنيوم - Aluminum Works
  // ========================================
  {
    id: 'ALU-001',
    code: 'ALUM-001',
    nameAr: 'ابواب وشبابيك جرارة او مفصلات',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 3.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-002',
    code: 'ALUM-002',
    nameAr: 'قواطع المنيوم ثابتة',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 4.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-003',
    code: 'ALUM-003',
    nameAr: 'درابزين المنيوم',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 6.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-004',
    code: 'ALUM-004',
    nameAr: 'شبابيك ألومنيوم من 1.0 إلى 3.0 م²',
    categoryId: 'aluminum',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 6.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-005',
    code: 'ALUM-005',
    nameAr: 'شبابيك ألومنيوم من 3.0 إلى 7.0 م²',
    categoryId: 'aluminum',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 3.2,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-006',
    code: 'ALUM-006',
    nameAr: 'شبابيك ألومنيوم من 7.0 إلى 10.0 م²',
    categoryId: 'aluminum',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.4,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-007',
    code: 'ALUM-007',
    nameAr: 'وزرة ألومنيوم مثبتة بالمسامير على مسافات 150–300 مم',
    categoryId: 'aluminum',
    unit: 'م',
    unitAr: 'م',
    productivityRate: 60.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-008',
    code: 'ALUM-008',
    nameAr: 'حوائط ستائر زجاجية – المرحلة الأولى',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 9.6,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-009',
    code: 'ALUM-009',
    nameAr: 'حوائط ستائر زجاجية – المرحلة الثانية',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 8.8,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-010',
    code: 'ALUM-010',
    nameAr: 'حوائط ستائر زجاجية عالية الجودة – تركيب ثلاثي المراحل',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 25.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  {
    id: 'ALU-011',
    code: 'ALUM-011',
    nameAr: 'تركيب واجهات المنيوم مستمرة',
    categoryId: 'aluminum',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 3.0,
    crewSize: 1,
    crew: [{ roleCode: 'LAB-PLUMBER', qty: 1, description: 'صناعي' }],
    source: 'اعمال الالمونيوم',
    sourceRef: 'اعمال الالمونيوم',
    isActive: true
  },
  // ========================================
  // أعمال الاند اسكيب - Landscape
  // ========================================
  {
    id: 'LND-001',
    code: 'LAND-001',
    nameAr: 'بلاطات خرسانية على طبقة رمل مدموكة',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 20.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-002',
    code: 'LAND-002',
    nameAr: 'بلاطات خرسانية على طبقة مونة اسمنتية',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 10.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-003',
    code: 'LAND-003',
    nameAr: 'اعمال حجر بازلت على مونة اسمنتية',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 2.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-004',
    code: 'LAND-004',
    nameAr: 'اعمال الحجر الصناعى على فرشة رمل',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 20.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-005',
    code: 'LAND-005',
    nameAr: 'أعمال بلاطات طوب',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 9.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-006',
    code: 'LAND-006',
    nameAr: 'ممرات حصوية شاملة تجهيز طبقة الأساس',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 84.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-007',
    code: 'LAND-007',
    nameAr: 'فرش طبقة الرمل وتسويتها فبل وضع النجيلة',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 20.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-008',
    code: 'LAND-008',
    nameAr: 'تركيب طبقات النجيلة',
    categoryId: 'landscape',
    unit: 'م2',
    unitAr: 'م2',
    productivityRate: 130.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-009',
    code: 'LAND-009',
    nameAr: 'زرع شجر بطول 75 سم',
    categoryId: 'landscape',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 32.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  {
    id: 'LND-010',
    code: 'LAND-010',
    nameAr: 'زرع شجر بطول اآبر 75 سم',
    categoryId: 'landscape',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 12.0,
    crewSize: 3,
    crew: [{ roleCode: 'LAB-GENERAL', qty: 3, description: 'مجموعة عمل' }],
    source: 'اعمال الاند اسكيب',
    sourceRef: 'اعمال الاند اسكيب',
    isActive: true
  },
  // ========================================
  // أعمال الأسانسير - Elevator Works
  // ========================================
  {
    id: 'ELV-001',
    code: 'ELEV-001',
    nameAr: 'مصعد هيدروليكي – تركيب من 2 إلى 3 أدوار',
    categoryId: 'elevator',
    unit: 'دور',
    unitAr: 'دور',
    productivityRate: 3.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-002',
    code: 'ELEV-002',
    nameAr: 'مصعد هيدروليكي – تركيب 4 أدوار فأكثر',
    categoryId: 'elevator',
    unit: 'دور',
    unitAr: 'دور',
    productivityRate: 2.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-003',
    code: 'ELEV-003',
    nameAr: 'مصعد عادي – تصنيع واختبار وتسليم',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 12.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-004',
    code: 'ELEV-004',
    nameAr: 'نوع ترس (Truss) – التركيب الكامل (باستثناء الأعمال المعمارية)',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 60.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-005',
    code: 'ELEV-005',
    nameAr: 'نوع ترس (Truss) – تصنيع واختبار وتسليم',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 1.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-006',
    code: 'ELEV-006',
    nameAr: 'نوع ترس (Truss) – المرحلة A تجميع الهيكل المعدني',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 6.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-007',
    code: 'ELEV-007',
    nameAr: 'نوع ترس (Truss) – إيقاف الأعمال لاستكمال التشطيبات المحيطة',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 5.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-008',
    code: 'ELEV-008',
    nameAr: 'نوع ترس (Truss) – المرحلة B تركيب الأرضيات والزجاج وغيرها',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-009',
    code: 'ELEV-009',
    nameAr: 'نوع ترس (Truss) – المرحلة C اختبارات الأداء',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
  {
    id: 'ELV-010',
    code: 'ELEV-010',
    nameAr: 'نوع ترس (Truss) – المرحلة D اختبار التحميل الكامل',
    categoryId: 'elevator',
    unit: 'عدد',
    unitAr: 'عدد',
    productivityRate: 2.0,
    crewSize: 1,
    crew: [],
    source: 'اعمال الاسانسير',
    sourceRef: 'اعمال الاسانسير',
    notes: 'بالاسبوع',
    isActive: true
  },
];

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
