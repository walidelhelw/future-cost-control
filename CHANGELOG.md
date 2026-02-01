# Changelog

All notable changes to the Future Cost Control project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-02-02

### Added

#### Productivity Module - Complete Data Integration
- **131 productivity templates** extracted from الانتاجيات Excel workbook (up from 30)
- **36 labor roles** with daily rates in EGP (up from 33)
- **31 work categories** organized by construction phase (up from 26)
- New categories: site-services, steel-works, metal-works, landscape, elevator

#### Productivity Templates by Category
| Category | Count | Description |
|----------|-------|-------------|
| اعمال تخديميه | 18 | Site services, material handling, demolition |
| تركيب المواسير | 36 | PVC, cast iron, concrete pipe installation |
| اعمال الكهرباء | 15 | Cable installation, conduit work |
| اعمال الحديد | 8 | Structural steel frames, trusses, decking |
| الاعمال المعدنيه | 12 | Metal doors, windows, railings, tanks |
| اعمال الخشب | 14 | Carpentry, door frames, glazing |
| اعمال الالمونيوم | 12 | Aluminum windows, curtain walls, facades |
| اعمال الاند اسكيب | 10 | Paving, landscaping, grass installation |
| اعمال الاسانسير | 10 | Elevator installation and testing |

#### New Components
- `ProductivityTemplateSelector` - Template picker for Estimates workflow
- `SourceComparison` - Multi-source productivity comparison chart
- `generate-templates.py` - Script to regenerate templates from JSON

#### Estimates Integration
- Added "قوالب الإنتاجية" tab in Add Item dialog
- Productivity templates auto-convert to labor cost items
- Labor rates from crew-roles integrated into rate lookup
- Real-time cost preview based on productivity rates

#### Rate Database Enhancement
- Added 36 productivity labor rates to Rate Database
- Source: الانتاجيات Excel workbook
- Categories: masonry, concrete, finishing, MEP, structural, general, equipment, supervision

### Changed
- Productivity page now shows 131 activities (was 30)
- Stats display updated: 131 activities, 31 categories, 36 roles
- Estimates page bundle size: 8.12 kB (includes productivity integration)

### Technical
- Added `extracted-productivity.json` for raw Excel data
- Python script for template generation from JSON
- Updated TypeScript interfaces for new data sources

---

## [0.1.0] - 2024-02-02

### Added

#### Core Infrastructure
- **Next.js 14 App Router** setup with TypeScript
- **Internationalization (i18n)** with next-intl supporting Arabic (RTL) and English
- **Tailwind CSS** with custom configuration for Arabic typography
- **Shadcn/ui components** integration (Dialog, Table, Select, Slider, Tabs, etc.)
- **Supabase** database integration for PostgreSQL backend

#### Dashboard (لوحة التحكم)
- Overview page with key performance indicators
- Quick action cards for common operations
- Recent activity feed
- Supplier summary widget

#### Rate Database Module (قاعدة بيانات الأسعار)
- 51 rates imported from Excel cost estimation sheets:
  - 22 Labor rates (نجار، حداد، مبيض، نقاش، مبلط، مرخماتي)
  - 20 Material rates (خرسانة، حديد، أسمنت، طوب، سيراميك، رخام)
  - 9 Equipment rates (خلاطة، حفار، رافعة، مضخة)
- Search and filter functionality
- Category badges with color coding
- Rate type filtering (Material, Labor, Equipment)
- CRUD operations with form validation

#### Projects Module (المشاريع)
- Project creation with rich metadata
- Project types: Residential, Commercial, Industrial, Infrastructure
- Status management: Draft, Active, On Hold, Completed, Cancelled
- Project cards with area metrics and estimate counts
- Search and status filtering

#### Estimates Module (التقديرات)
- 15 BOQ templates extracted from Excel:
  - Excavation: حفر، ردم بالرمل
  - Concrete: خرسانة عادية، خرسانة مسلحة للقواعد/الأعمدة/الأسقف
  - Masonry: مباني طوب 25 سم، مباني طوب 12 سم
  - Finishing: بياض داخلي، دهان بلاستيك، سيراميك أرضيات/حوائط، رخام
  - Waterproofing: عزل بيتومين، عزل ممبرين
- Real-time cost calculation engine
- Configurable rates:
  - Indirect Rate: 0-30% (default 15%)
  - Profit Margin: 0-40% (default 20%)
  - Contingency: 0-15% (default 5%)
- Cost preview with breakdown
- Estimate versioning support
- Status workflow: Draft → Pending Review → Approved/Rejected

#### Productivity Module (معدلات الإنتاجية)
- 30+ productivity templates for construction activities
- Data from multiple sources: Petrojet, H.A, El-Baqari/El-Nadi
- Productivity calculator with:
  - Crew composition display
  - Condition factor adjustments
  - Time and cost estimation
- Sortable and filterable productivity table
- RTL-optimized layout

#### Supplier Evaluation Module (تقييم الموردين)
- Supplier database with rating system
- 7-criteria scoring framework
- Category and status badges

#### Risk Assessment Module (تقييم المخاطر)
- Risk register with probability/impact matrix
- EMV calculation
- Risk severity levels

#### Cash Flow Module (التدفقات النقدية)
- S-curve visualization with Recharts
- Monthly cash flow projections
- Budget variance tracking

#### BOQ Calculator (حاسبة البنود)
- Bill of Quantities item management
- Cost breakdown per item

#### Company Branding
- Custom SVG logo for Future Construction Company
- Purple circle with blue building design
- "فيوتشر" Arabic text
- Wave decoration element

#### Data Extraction Scripts
- Python script for Excel data extraction (`scripts/extract-excel-data.py`)
- Decryption support for password-protected Excel files
- Generated seed data JSON (`scripts/seed-data.json`)

### Technical Details

#### Cost Calculation Formula
```
Direct Cost = Σ(Material × Rate) + Σ(Labor × Rate) + Σ(Equipment × Rate)
Indirect Cost = Direct Cost × Indirect Rate
Subtotal = Direct Cost + Indirect Cost
Profit = Subtotal × Profit Margin
Contingency = (Subtotal + Profit) × Contingency Rate
Selling Price = Subtotal + Profit + Contingency
```

#### Database Schema (Supabase)
- `rate_categories` - Rate type categories
- `master_rates` - Rate database with history tracking
- `projects` - Project information
- `estimates` - Cost estimates with versioning
- `estimate_items` - Individual BOQ items
- `boq_templates` - Standard BOQ templates

### Fixed
- RTL layout for productivity tabs and filters
- Search icon positioning for Arabic interface
- Type error in ProductivityTable category sorting
- formatNumber utility to support decimal places parameter

### Security
- Environment variables for sensitive configuration
- Supabase Row Level Security (RLS) ready

---

## Development Notes

### Data Sources
All rate and BOQ data was extracted from actual cost estimation Excel sheets provided by The Future Construction Company. The data includes:
- Labor productivity rates from multiple construction projects
- Material costs current as of extraction date
- Equipment rental rates for common construction equipment

### Localization
The application is fully bilingual:
- **Arabic (ar)**: Primary language with complete RTL support
- **English (en)**: Secondary language for international users

All UI elements, labels, and data display properly in both languages.

### Deployment
The application is deployed on Vercel with automatic deployments from the main branch:
- Production URL: https://future-cost-control.vercel.app
- GitHub Repository: https://github.com/walidelhelw/future-cost-control

---

## Roadmap

### Planned Features
- [ ] User authentication with NextAuth.js
- [ ] Approval workflow automation
- [ ] PDF report generation (Arabic support)
- [ ] Excel export matching current format
- [ ] Real-time collaboration with Socket.io
- [ ] Mobile PWA support
- [ ] Supplier quote import (PDF parsing)
- [ ] ML-based cost prediction

### Phase 2 Enhancements
- [ ] Rate history tracking with audit trail
- [ ] Escalation formula automation
- [ ] Project actual vs estimated comparison
- [ ] Dashboard analytics with KPIs
- [ ] Notification system for approvals

---

*Maintained by The Future Construction Company Development Team*
