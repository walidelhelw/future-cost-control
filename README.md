# Future Cost Control - نظام التكاليف المصغر

<div align="center">
  <img src="public/logo.svg" alt="Future Logo" width="120" height="120">

  **شركة المستقبل للاستثمار والمقاولات العامة**

  *Construction Cost Estimation & Control System*

  [![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://future-cost-control.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
</div>

---

## Overview | نظرة عامة

Future Cost Control is a comprehensive construction cost estimation and management system built for **The Future Construction Company (شركة المستقبل للمقاولات)**. It provides tools for managing rates, creating estimates, tracking projects, and calculating labor productivity.

نظام التكاليف المصغر هو نظام شامل لتقدير وإدارة تكاليف البناء مصمم خصيصاً لشركة المستقبل للمقاولات.

## Features | المميزات

### 1. Rate Database | قاعدة بيانات الأسعار
- **51 rates** extracted from actual Excel cost estimation sheets
- Categories: Materials (20), Labor (22), Equipment (9)
- Bilingual support (Arabic/English)
- Search and filter functionality
- CRUD operations for rate management

### 2. Projects Management | إدارة المشاريع
- Project creation and tracking
- Project types: Residential, Commercial, Industrial, Infrastructure
- Status management: Draft, Active, On Hold, Completed, Cancelled
- Area and floor metrics
- Estimate count per project

### 3. Cost Estimates | التقديرات
- **15 BOQ templates** from Excel data
- Real-time cost calculation engine
- Direct/Indirect cost breakdown
- Configurable profit margins (0-40%)
- Contingency rates (0-15%)
- Cost preview before submission
- Categories: Excavation, Concrete, Masonry, Finishing, Waterproofing

### 4. Productivity Rates | معدلات الإنتاجية
- **30+ productivity templates** for construction activities
- Crew composition calculator
- Condition factor adjustments (weather, access, experience)
- Daily cost estimation
- Multiple data sources (Petrojet, H.A, El-Baqari/El-Nadi)

### 5. Supplier Evaluation | تقييم الموردين
- 7-criteria scoring system
- Supplier database management
- Rating badges and categories

### 6. Risk Assessment | تقييم المخاطر
- Risk register with probability/impact matrix
- EMV (Expected Monetary Value) calculation
- Mitigation strategies

### 7. Cash Flow | التدفقات النقدية
- S-curve visualization
- Monthly projections
- Budget vs actual tracking

### 8. BOQ Calculator | حاسبة البنود
- Bill of Quantities management
- Item-level cost breakdown

## Technology Stack | التقنيات المستخدمة

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS |
| **UI Components** | Shadcn/ui + Radix UI |
| **Charts** | Recharts |
| **i18n** | next-intl (Arabic RTL + English) |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |

## Project Structure | هيكل المشروع

```
future-cost-control/
├── public/
│   └── logo.svg              # Company logo
├── scripts/
│   ├── extract-excel-data.py # Excel data extraction
│   └── seed-data.json        # Extracted rates & templates
├── src/
│   ├── app/
│   │   └── [locale]/         # i18n routes
│   │       ├── page.tsx      # Dashboard
│   │       ├── rates/        # Rate database
│   │       ├── projects/     # Project management
│   │       ├── estimates/    # Cost estimation
│   │       ├── productivity/ # Productivity rates
│   │       ├── suppliers/    # Supplier evaluation
│   │       ├── risks/        # Risk assessment
│   │       ├── cashflow/     # Cash flow tracking
│   │       └── boq/          # BOQ calculator
│   ├── components/
│   │   ├── layout/           # Sidebar, Header
│   │   ├── productivity/     # Productivity components
│   │   └── ui/               # Shadcn components
│   ├── data/
│   │   ├── productivity-templates.ts
│   │   ├── productivity-categories.ts
│   │   ├── crew-roles.ts
│   │   └── condition-factors.ts
│   ├── lib/
│   │   ├── calculations.ts   # Cost calculation engine
│   │   ├── supabase.ts       # Database client
│   │   └── utils.ts          # Utility functions
│   └── messages/
│       ├── ar.json           # Arabic translations
│       └── en.json           # English translations
└── package.json
```

## Getting Started | البدء

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/walidelhelw/future-cost-control.git
cd future-cost-control

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Sources | مصادر البيانات

The rate and BOQ data was extracted from encrypted Excel cost estimation sheets using the `scripts/extract-excel-data.py` script. Sources include:

- **Labor Rates**: Sheet 16 (22 trade rates)
- **Material Rates**: Sheets 17-18 (20 material costs)
- **Equipment Rates**: Equipment daily rates (9 items)
- **BOQ Templates**: Sheets 19-52 (15 standard templates)
- **Indirect Costs**: Site overhead 8%, Head office 5%, Insurance 2%, Taxes 5%, Contingency 5%

## Calculation Engine | محرك الحسابات

The cost estimation follows this formula:

```
Direct Cost = Material Cost + Labor Cost + Equipment Cost
Indirect Cost = Direct Cost × Indirect Rate
Subtotal = Direct Cost + Indirect Cost
Profit = Subtotal × Profit Margin
Contingency = (Subtotal + Profit) × Contingency Rate
Selling Price = Subtotal + Profit + Contingency
```

## Live Demo | العرض المباشر

**URL**: [https://future-cost-control.vercel.app](https://future-cost-control.vercel.app)

- Arabic version: `/ar`
- English version: `/en`

## Screenshots | لقطات الشاشة

| Dashboard | Rate Database | Cost Estimates |
|-----------|---------------|----------------|
| Overview with KPIs | 51 rates with filtering | BOQ-based estimation |

## Contributing | المساهمة

This is a private project for The Future Construction Company.

## License | الرخصة

Proprietary - All rights reserved.

---

<div align="center">
  <p>Built with ❤️ for شركة المستقبل للمقاولات</p>
  <p>© 2024 The Future Construction Company</p>
</div>
