"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Edit2,
  Filter,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatV2Money, formatV2Number, pickText, type V2Locale } from "./localize";
import {
  parityMeta,
  seedBoqTemplates,
  seedCashflow,
  seedEstimates,
  seedProductivity,
  seedProjects,
  seedRates,
  seedRisks,
  seedSuppliers,
  type BoqTemplate,
  type CashflowPeriod,
  type EstimateItem,
  type EstimateLine,
  type ProjectItem,
  type ProjectStatus,
  type RateItem,
  type RateKind,
  type RiskItem,
  type RiskLevel,
  type SupplierItem,
  type SupplierScores,
  type SupplierStatus,
  type V2ParityModuleKey,
} from "./parity-data";

type V2ParityModulePageProps = {
  locale: V2Locale;
  moduleKey: V2ParityModuleKey;
};

type CopyKey =
  | "all"
  | "add"
  | "update"
  | "edit"
  | "delete"
  | "clear"
  | "search"
  | "filters"
  | "total"
  | "quantity"
  | "rate"
  | "status"
  | "type"
  | "category"
  | "score"
  | "name"
  | "code"
  | "unit"
  | "source"
  | "amount"
  | "probability"
  | "impact"
  | "emv"
  | "month"
  | "cashIn"
  | "cashOut"
  | "net"
  | "cumulative"
  | "npv"
  | "fundingGap"
  | "breakEven"
  | "discountRate"
  | "demoOnly";

const copy: Record<CopyKey, { ar: string; en: string }> = {
  all: { ar: "الكل", en: "All" },
  add: { ar: "إضافة", en: "Add" },
  update: { ar: "تحديث", en: "Update" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  clear: { ar: "مسح الكل", en: "Clear all" },
  search: { ar: "بحث", en: "Search" },
  filters: { ar: "الفلاتر", en: "Filters" },
  total: { ar: "الإجمالي", en: "Total" },
  quantity: { ar: "الكمية", en: "Quantity" },
  rate: { ar: "السعر", en: "Rate" },
  status: { ar: "الحالة", en: "Status" },
  type: { ar: "النوع", en: "Type" },
  category: { ar: "الفئة", en: "Category" },
  score: { ar: "النقاط", en: "Score" },
  name: { ar: "الاسم", en: "Name" },
  code: { ar: "الكود", en: "Code" },
  unit: { ar: "الوحدة", en: "Unit" },
  source: { ar: "المصدر", en: "Source" },
  amount: { ar: "القيمة", en: "Amount" },
  probability: { ar: "الاحتمال", en: "Probability" },
  impact: { ar: "الأثر", en: "Impact" },
  emv: { ar: "EMV", en: "EMV" },
  month: { ar: "الشهر", en: "Month" },
  cashIn: { ar: "داخل", en: "Cash in" },
  cashOut: { ar: "خارج", en: "Cash out" },
  net: { ar: "الصافي", en: "Net" },
  cumulative: { ar: "تراكمي", en: "Cumulative" },
  npv: { ar: "NPV", en: "NPV" },
  fundingGap: { ar: "فجوة التمويل", en: "Funding gap" },
  breakEven: { ar: "نقطة التعادل", en: "Break-even" },
  discountRate: { ar: "معدل الخصم", en: "Discount rate" },
  demoOnly: { ar: "مسار V2 كامل - بيانات محلية للتجربة فقط", en: "Full V2 path - local demo data only" },
};

const rateLabels: Record<RateKind, { ar: string; en: string }> = {
  MATERIAL: { ar: "مواد", en: "Materials" },
  LABOR: { ar: "عمالة", en: "Labor" },
  EQUIPMENT: { ar: "معدات", en: "Equipment" },
};

const statusLabels: Record<ProjectStatus, { ar: string; en: string }> = {
  DRAFT: { ar: "مسودة", en: "Draft" },
  ACTIVE: { ar: "نشط", en: "Active" },
  ON_HOLD: { ar: "متوقف", en: "On hold" },
  COMPLETED: { ar: "مكتمل", en: "Completed" },
};

const moduleOrder: V2ParityModuleKey[] = [
  "rates",
  "productivity",
  "projects",
  "estimates",
  "suppliers",
  "boq",
  "risks",
  "cashflow",
];

export function V2ParityModulePage({ locale, moduleKey }: V2ParityModulePageProps) {
  const meta = parityMeta[moduleKey];

  return (
    <div className="mx-auto max-w-[1700px] space-y-3">
      <section className="rounded-md border border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
              {pickText(meta.eyebrow, locale)}
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
              {pickText(meta.title, locale)}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {pickText(meta.subtitle, locale)}
            </p>
          </div>
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            <Sparkles className="me-1 h-3.5 w-3.5" />
            {txt("demoOnly", locale)}
          </Badge>
        </div>
      </section>

      {moduleKey === "rates" ? <RatesPanel locale={locale} /> : null}
      {moduleKey === "productivity" ? <ProductivityPanel locale={locale} /> : null}
      {moduleKey === "projects" ? <ProjectsPanel locale={locale} /> : null}
      {moduleKey === "estimates" ? <EstimatesPanel locale={locale} /> : null}
      {moduleKey === "suppliers" ? <SuppliersPanel locale={locale} /> : null}
      {moduleKey === "boq" ? <BoqPanel locale={locale} /> : null}
      {moduleKey === "risks" ? <RisksPanel locale={locale} /> : null}
      {moduleKey === "cashflow" ? <CashflowPanel locale={locale} /> : null}
    </div>
  );
}

function RatesPanel({ locale }: { locale: V2Locale }) {
  const [rates, setRates] = useState<RateItem[]>(seedRates);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<RateKind | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RateItem>(blankRate());
  const filtered = rates.filter((rate) => {
    const haystack = `${rate.code} ${pickText(rate.name, locale)} ${rate.source}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (type === "all" || rate.type === type);
  });

  const save = () => {
    if (!form.code || !pickText(form.name, locale)) return;
    setRates((current) =>
      editingId ? current.map((rate) => (rate.id === editingId ? form : rate)) : [...current, { ...form, id: newId("rate") }]
    );
    setEditingId(null);
    setForm(blankRate());
  };

  return (
    <PanelGrid
      aside={
        <Editor title={editingId ? txt("edit", locale) : txt("add", locale)} onSave={save} saveLabel={editingId ? txt("update", locale) : txt("add", locale)}>
          <TextField label={txt("code", locale)} value={form.code} onChange={(code) => setForm({ ...form, code })} />
          <TextField label={txt("name", locale)} value={pickText(form.name, locale)} onChange={(name) => setForm({ ...form, name: localized(name, locale) })} />
          <SelectField label={txt("type", locale)} value={form.type} onChange={(value) => setForm({ ...form, type: value as RateKind })} options={["MATERIAL", "LABOR", "EQUIPMENT"].map((value) => [value, pickText(rateLabels[value as RateKind], locale)])} />
          <div className="grid grid-cols-2 gap-2">
            <NumberField label={txt("rate", locale)} value={form.rate} onChange={(rate) => setForm({ ...form, rate })} />
            <NumberField label={txt("unit", locale)} value={0} onChange={() => undefined} textValue={form.unit} onTextChange={(unit) => setForm({ ...form, unit })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="Waste" value={form.waste} onChange={(waste) => setForm({ ...form, waste })} step={0.01} />
            <TextField label={txt("source", locale)} value={form.source} onChange={(source) => setForm({ ...form, source })} />
          </div>
        </Editor>
      }
    >
      <Toolbar query={query} setQuery={setQuery} locale={locale}>
        <SelectField label={txt("filters", locale)} value={type} onChange={(value) => setType(value as RateKind | "all")} options={[["all", txt("all", locale)], ...(["MATERIAL", "LABOR", "EQUIPMENT"] as RateKind[]).map((value) => [value, pickText(rateLabels[value], locale)] as [string, string])]} />
      </Toolbar>
      <DataTable headers={[txt("code", locale), txt("name", locale), txt("type", locale), txt("rate", locale), "Waste", ""]}>
        {filtered.map((rate) => (
          <TableRow key={rate.id}>
            <TableCell className="font-mono text-xs">{rate.code}</TableCell>
            <TableCell className="font-medium text-slate-950">{pickText(rate.name, locale)}</TableCell>
            <TableCell><SoftBadge>{pickText(rateLabels[rate.type], locale)}</SoftBadge></TableCell>
            <TableCell dir="ltr">{formatV2Money(rate.rate, locale)} / {rate.unit}</TableCell>
            <TableCell>{formatV2Number(rate.waste, locale)}</TableCell>
            <TableCell><RowActions onEdit={() => { setEditingId(rate.id); setForm(rate); }} onDelete={() => setRates((current) => current.filter((item) => item.id !== rate.id))} locale={locale} /></TableCell>
          </TableRow>
        ))}
      </DataTable>
    </PanelGrid>
  );
}

function ProductivityPanel({ locale }: { locale: V2Locale }) {
  const [templateId, setTemplateId] = useState(seedProductivity[0].id);
  const [quantity, setQuantity] = useState(500);
  const [factor, setFactor] = useState(0.85);
  const template = seedProductivity.find((item) => item.id === templateId) ?? seedProductivity[0];
  const adjustedOutput = template.baseOutput * factor;
  const days = quantity / adjustedOutput;
  const cost = days * template.dailyCost;

  return (
    <PanelGrid
      aside={
        <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">{locale === "ar" ? "نتيجة الحاسبة" : "Calculator Result"}</h2>
          <Metric label={locale === "ar" ? "إنتاجية معدلة" : "Adjusted output"} value={`${formatV2Number(adjustedOutput, locale)} ${template.unit}/day`} />
          <Metric label={locale === "ar" ? "مدة التنفيذ" : "Duration"} value={`${formatV2Number(days, locale)} ${locale === "ar" ? "يوم" : "days"}`} />
          <Metric label={locale === "ar" ? "تكلفة العمالة" : "Labor cost"} value={formatV2Money(cost, locale)} />
        </div>
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        {seedProductivity.map((item) => (
          <button
            className={`rounded-md border p-4 text-start shadow-sm transition ${item.id === templateId ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white hover:border-cyan-200"}`}
            key={item.id}
            onClick={() => setTemplateId(item.id)}
          >
            <p className="font-semibold text-slate-950">{pickText(item.activity, locale)}</p>
            <p className="mt-2 text-xs text-slate-500">{item.crew}</p>
            <p className="mt-3 text-sm text-cyan-700">{item.baseOutput} {item.unit}/day</p>
          </button>
        ))}
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">{locale === "ar" ? "مدخلات الحساب" : "Calculation Inputs"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <NumberField label={txt("quantity", locale)} value={quantity} onChange={setQuantity} />
          <NumberField label={locale === "ar" ? "معامل الظروف" : "Condition factor"} value={factor} onChange={setFactor} step={0.05} />
        </div>
      </section>
    </PanelGrid>
  );
}

function ProjectsPanel({ locale }: { locale: V2Locale }) {
  const [projects, setProjects] = useState<ProjectItem[]>(seedProjects);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectItem>(blankProject());
  const filtered = projects.filter((project) => {
    const haystack = `${project.code} ${pickText(project.name, locale)} ${project.client}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "all" || project.status === status);
  });
  const save = () => {
    if (!form.code || !pickText(form.name, locale)) return;
    setProjects((current) => editingId ? current.map((project) => project.id === editingId ? form : project) : [...current, { ...form, id: newId("project") }]);
    setEditingId(null);
    setForm(blankProject());
  };

  return (
    <PanelGrid aside={<ProjectEditor locale={locale} form={form} setForm={setForm} editing={Boolean(editingId)} save={save} />}>
      <Toolbar query={query} setQuery={setQuery} locale={locale}>
        <SelectField label={txt("status", locale)} value={status} onChange={(value) => setStatus(value as ProjectStatus | "all")} options={[["all", txt("all", locale)], ...(["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED"] as ProjectStatus[]).map((value) => [value, pickText(statusLabels[value], locale)] as [string, string])]} />
      </Toolbar>
      <DataTable headers={[txt("code", locale), txt("name", locale), "Client", txt("status", locale), txt("total", locale), ""]}>
        {filtered.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-mono text-xs">{project.code}</TableCell>
            <TableCell><p className="font-medium text-slate-950">{pickText(project.name, locale)}</p><p className="text-xs text-slate-500">{project.type} · {project.area} m2</p></TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell><SoftBadge>{pickText(statusLabels[project.status], locale)}</SoftBadge></TableCell>
            <TableCell>{project.estimates}</TableCell>
            <TableCell><RowActions locale={locale} onEdit={() => { setEditingId(project.id); setForm(project); }} onDelete={() => setProjects((current) => current.filter((item) => item.id !== project.id))} /></TableCell>
          </TableRow>
        ))}
      </DataTable>
    </PanelGrid>
  );
}

function EstimatesPanel({ locale }: { locale: V2Locale }) {
  const [estimates, setEstimates] = useState<EstimateItem[]>(seedEstimates);
  const [selectedId, setSelectedId] = useState(seedEstimates[0].id);
  const estimate = estimates.find((item) => item.id === selectedId) ?? estimates[0];
  const total = estimate.lines.reduce((sum, line) => sum + line.quantity * line.unitRate, 0);
  const updateLine = (lineId: string, patch: Partial<EstimateLine>) => {
    setEstimates((current) => current.map((item) => item.id === estimate.id ? { ...item, lines: item.lines.map((line) => line.id === lineId ? { ...line, ...patch } : line) } : item));
  };
  const addLine = () => updateEstimate(setEstimates, estimate.id, (item) => ({ ...item, lines: [...item.lines, { id: newId("line"), description: localized(locale === "ar" ? "بند جديد" : "New line", locale), unit: "م2", quantity: 1, unitRate: 100 }] }));

  return (
    <PanelGrid
      aside={
        <div className="space-y-3">
          {estimates.map((item) => (
            <button className={`w-full rounded-md border p-4 text-start shadow-sm ${item.id === estimate.id ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}`} key={item.id} onClick={() => setSelectedId(item.id)}>
              <p className="font-semibold text-slate-950">{item.code}</p>
              <p className="text-sm text-slate-600">{pickText(item.project, locale)}</p>
              <p className="mt-2 text-sm text-cyan-700">{formatV2Money(item.lines.reduce((sum, line) => sum + line.quantity * line.unitRate, 0), locale)}</p>
            </button>
          ))}
        </div>
      }
    >
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{estimate.code} · {pickText(estimate.project, locale)}</h2>
            <p className="text-sm text-slate-500">{txt("total", locale)}: {formatV2Money(total, locale)}</p>
          </div>
          <Button className="bg-cyan-600 text-white hover:bg-cyan-500" onClick={addLine}><Plus className="me-2 h-4 w-4" />{txt("add", locale)}</Button>
        </div>
        <DataTable headers={[txt("name", locale), txt("unit", locale), txt("quantity", locale), txt("rate", locale), txt("total", locale), ""]}>
          {estimate.lines.map((line) => (
            <TableRow key={line.id}>
              <TableCell><Input className="border-slate-200 bg-white" value={pickText(line.description, locale)} onChange={(event) => updateLine(line.id, { description: localized(event.target.value, locale) })} /></TableCell>
              <TableCell><Input className="w-20 border-slate-200 bg-white" value={line.unit} onChange={(event) => updateLine(line.id, { unit: event.target.value })} /></TableCell>
              <TableCell><Input className="w-28 border-slate-200 bg-white" type="number" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: toNumber(event.target.value) })} /></TableCell>
              <TableCell><Input className="w-32 border-slate-200 bg-white" type="number" value={line.unitRate} onChange={(event) => updateLine(line.id, { unitRate: toNumber(event.target.value) })} /></TableCell>
              <TableCell dir="ltr">{formatV2Money(line.quantity * line.unitRate, locale)}</TableCell>
              <TableCell><Button size="icon" variant="ghost" onClick={() => updateEstimate(setEstimates, estimate.id, (item) => ({ ...item, lines: item.lines.filter((row) => row.id !== line.id) }))}><Trash2 className="h-4 w-4 text-rose-600" /></Button></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </section>
    </PanelGrid>
  );
}

function SuppliersPanel({ locale }: { locale: V2Locale }) {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(seedSuppliers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierItem>(blankSupplier());
  const filtered = suppliers.filter((supplier) => supplier.name.includes(query) && (category === "all" || supplier.category === category));
  const save = () => {
    if (!form.name) return;
    setSuppliers((current) => editingId ? current.map((supplier) => supplier.id === editingId ? form : supplier) : [...current, { ...form, id: newId("supplier") }]);
    setEditingId(null);
    setForm(blankSupplier());
  };

  return (
    <PanelGrid aside={<SupplierEditor locale={locale} form={form} setForm={setForm} save={save} editing={Boolean(editingId)} />}>
      <Toolbar query={query} setQuery={setQuery} locale={locale}>
        <SelectField label={txt("category", locale)} value={category} onChange={setCategory} options={[["all", txt("all", locale)], ["materials", locale === "ar" ? "مواد" : "Materials"], ["equipment", locale === "ar" ? "معدات" : "Equipment"]]} />
      </Toolbar>
      <div className="grid gap-3 lg:grid-cols-3">
        {filtered.map((supplier) => {
          const score = supplierScore(supplier.scores);
          return (
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" key={supplier.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">{supplier.name}</h2>
                  <p className="text-xs text-slate-500">{supplier.category}</p>
                </div>
                <SoftBadge>{supplierStatus(score, locale)}</SoftBadge>
              </div>
              <p className="mt-4 text-3xl font-semibold text-cyan-700" dir="ltr">{score.toFixed(1)}/10</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                {Object.entries(supplier.scores).map(([key, value]) => <span key={key}>{scoreLabel(key, locale)}: {value}</span>)}
              </div>
              <RowActions locale={locale} onEdit={() => { setEditingId(supplier.id); setForm(supplier); }} onDelete={() => setSuppliers((current) => current.filter((item) => item.id !== supplier.id))} />
            </div>
          );
        })}
      </div>
    </PanelGrid>
  );
}

function BoqPanel({ locale }: { locale: V2Locale }) {
  const [templateId, setTemplateId] = useState(seedBoqTemplates[0].id);
  const [quantity, setQuantity] = useState(100);
  const [items, setItems] = useState<Array<BoqTemplate & { rowId: string; quantity: number }>>([]);
  const template = seedBoqTemplates.find((item) => item.id === templateId) ?? seedBoqTemplates[0];
  const total = items.reduce((sum, item) => sum + item.quantity * item.baseRate, 0);

  return (
    <PanelGrid
      aside={
        <Editor title={locale === "ar" ? "حاسبة BOQ" : "BOQ Calculator"} onSave={() => setItems((current) => [...current, { ...template, rowId: newId("boq"), quantity }])} saveLabel={txt("add", locale)}>
          <SelectField label={txt("name", locale)} value={templateId} onChange={setTemplateId} options={seedBoqTemplates.map((item) => [item.id, pickText(item.description, locale)])} />
          <NumberField label={txt("quantity", locale)} value={quantity} onChange={setQuantity} />
          <Metric label={txt("rate", locale)} value={formatV2Money(template.baseRate, locale)} />
        </Editor>
      }
    >
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-950">{txt("total", locale)}: {formatV2Money(total, locale)}</h2>
          <Button variant="outline" onClick={() => setItems([])}><RotateCcw className="me-2 h-4 w-4" />{txt("clear", locale)}</Button>
        </div>
        <DataTable headers={[txt("name", locale), txt("quantity", locale), txt("rate", locale), txt("total", locale), ""]}>
          {items.map((item) => (
            <TableRow key={item.rowId}>
              <TableCell className="font-medium text-slate-950">{pickText(item.description, locale)}</TableCell>
              <TableCell>{item.quantity} {item.unit}</TableCell>
              <TableCell>{formatV2Money(item.baseRate, locale)}</TableCell>
              <TableCell>{formatV2Money(item.baseRate * item.quantity, locale)}</TableCell>
              <TableCell><Button size="icon" variant="ghost" onClick={() => setItems((current) => current.filter((row) => row.rowId !== item.rowId))}><Trash2 className="h-4 w-4 text-rose-600" /></Button></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </section>
    </PanelGrid>
  );
}

function RisksPanel({ locale }: { locale: V2Locale }) {
  const [risks, setRisks] = useState<RiskItem[]>(seedRisks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RiskItem>(blankRisk());
  const totalEmv = risks.reduce((sum, risk) => sum + riskEmv(risk), 0);
  const save = () => {
    if (!form.code || !pickText(form.statement, locale)) return;
    setRisks((current) => editingId ? current.map((risk) => risk.id === editingId ? form : risk) : [...current, { ...form, id: newId("risk") }]);
    setEditingId(null);
    setForm(blankRisk());
  };

  return (
    <PanelGrid aside={<RiskEditor locale={locale} form={form} setForm={setForm} save={save} editing={Boolean(editingId)} />}>
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label={txt("total", locale)} value={String(risks.length)} />
        <Metric label={txt("emv", locale)} value={formatV2Money(totalEmv, locale)} />
        <Metric label={locale === "ar" ? "مخاطر عالية" : "High risks"} value={String(risks.filter((risk) => riskLevel(risk) === "high").length)} />
        <Metric label={locale === "ar" ? "أكبر أثر" : "Top impact"} value={formatV2Money(Math.max(...risks.map((risk) => risk.impact)), locale)} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">{locale === "ar" ? "مصفوفة الاحتمال/الأثر" : "Probability/Impact Matrix"}</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as RiskLevel[]).map((level) => (
              <div className={`min-h-24 rounded-md border p-3 ${levelClass(level)}`} key={level}>
                <p className="text-sm font-semibold">{levelName(level, locale)}</p>
                <p className="mt-2 text-2xl font-semibold">{risks.filter((risk) => riskLevel(risk) === level).length}</p>
              </div>
            ))}
          </div>
        </div>
        <DataTable headers={[txt("code", locale), txt("name", locale), txt("probability", locale), txt("impact", locale), txt("emv", locale), ""]}>
          {risks.map((risk) => (
            <TableRow key={risk.id}>
              <TableCell className="font-mono text-xs">{risk.code}</TableCell>
              <TableCell className="font-medium text-slate-950">{pickText(risk.statement, locale)}</TableCell>
              <TableCell>{formatV2Number(risk.probability * 100, locale)}%</TableCell>
              <TableCell>{formatV2Money(risk.impact, locale)}</TableCell>
              <TableCell><SoftBadge>{formatV2Money(riskEmv(risk), locale)}</SoftBadge></TableCell>
              <TableCell><RowActions locale={locale} onEdit={() => { setEditingId(risk.id); setForm(risk); }} onDelete={() => setRisks((current) => current.filter((item) => item.id !== risk.id))} /></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </PanelGrid>
  );
}

function CashflowPanel({ locale }: { locale: V2Locale }) {
  const [periods, setPeriods] = useState<CashflowPeriod[]>(seedCashflow);
  const [discountRate, setDiscountRate] = useState(10);
  const rows = useMemo(() => {
    let cumulative = 0;
    return periods.map((period) => {
      const net = period.cashIn - period.cashOut;
      cumulative += net;
      return { ...period, net, cumulative };
    });
  }, [periods]);
  const npv = rows.reduce((sum, row, index) => sum + row.net / (1 + discountRate / 100) ** index, 0);
  const fundingGap = Math.abs(Math.min(...rows.map((row) => row.cumulative), 0));
  const breakEven = rows.find((row) => row.cumulative >= 0)?.month;
  const update = (id: string, patch: Partial<CashflowPeriod>) => setPeriods((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label={txt("npv", locale)} value={formatV2Money(npv, locale)} />
        <Metric label={txt("fundingGap", locale)} value={formatV2Money(fundingGap, locale)} />
        <Metric label={txt("breakEven", locale)} value={breakEven === undefined ? "-" : `${breakEven}`} />
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <NumberField label={txt("discountRate", locale)} value={discountRate} onChange={setDiscountRate} />
        </div>
      </div>
      <DataTable headers={[txt("month", locale), txt("cashIn", locale), txt("cashOut", locale), txt("net", locale), txt("cumulative", locale)]}>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.month}</TableCell>
            <TableCell><Input className="w-36 border-slate-200 bg-white" type="number" value={row.cashIn} onChange={(event) => update(row.id, { cashIn: toNumber(event.target.value) })} /></TableCell>
            <TableCell><Input className="w-36 border-slate-200 bg-white" type="number" value={row.cashOut} onChange={(event) => update(row.id, { cashOut: toNumber(event.target.value) })} /></TableCell>
            <TableCell className={row.net >= 0 ? "text-emerald-700" : "text-rose-700"}>{formatV2Money(row.net, locale)}</TableCell>
            <TableCell>{formatV2Money(row.cumulative, locale)}</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </section>
  );
}

function PanelGrid({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  return <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-3">{children}</div><aside>{aside}</aside></section>;
}

function Toolbar({ children, locale, query, setQuery }: { children?: React.ReactNode; locale: V2Locale; query: string; setQuery: (query: string) => void }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
        <label className="relative block">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="border-slate-200 bg-white ps-9" placeholder={txt("search", locale)} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="flex items-end gap-2">
          <Filter className="mb-2 h-4 w-4 text-cyan-700" />
          {children}
        </div>
      </div>
    </div>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>{headers.map((header) => <TableHead className="text-slate-600" key={header}>{header}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

function Editor({ children, onSave, saveLabel, title }: { children: React.ReactNode; onSave: () => void; saveLabel: string; title: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950"><Calculator className="me-2 inline h-4 w-4 text-cyan-700" />{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
      <Button className="mt-4 w-full bg-cyan-600 text-white hover:bg-cyan-500" onClick={onSave}>{saveLabel}</Button>
    </div>
  );
}

function ProjectEditor({ editing, form, locale, save, setForm }: { editing: boolean; form: ProjectItem; locale: V2Locale; save: () => void; setForm: (form: ProjectItem) => void }) {
  return (
    <Editor title={editing ? txt("edit", locale) : txt("add", locale)} saveLabel={editing ? txt("update", locale) : txt("add", locale)} onSave={save}>
      <TextField label={txt("code", locale)} value={form.code} onChange={(code) => setForm({ ...form, code })} />
      <TextField label={txt("name", locale)} value={pickText(form.name, locale)} onChange={(name) => setForm({ ...form, name: localized(name, locale) })} />
      <TextField label="Client" value={form.client} onChange={(client) => setForm({ ...form, client })} />
      <SelectField label={txt("status", locale)} value={form.status} onChange={(status) => setForm({ ...form, status: status as ProjectStatus })} options={(["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED"] as ProjectStatus[]).map((value) => [value, pickText(statusLabels[value], locale)])} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Area" value={form.area} onChange={(area) => setForm({ ...form, area })} />
        <NumberField label="Months" value={form.duration} onChange={(duration) => setForm({ ...form, duration })} />
      </div>
    </Editor>
  );
}

function SupplierEditor({ editing, form, locale, save, setForm }: { editing: boolean; form: SupplierItem; locale: V2Locale; save: () => void; setForm: (form: SupplierItem) => void }) {
  const setScore = (key: keyof SupplierScores, value: number) => setForm({ ...form, scores: { ...form.scores, [key]: value } });
  return (
    <Editor title={editing ? txt("edit", locale) : txt("add", locale)} saveLabel={editing ? txt("update", locale) : txt("add", locale)} onSave={save}>
      <TextField label={txt("name", locale)} value={form.name} onChange={(name) => setForm({ ...form, name })} />
      <SelectField label={txt("category", locale)} value={form.category} onChange={(category) => setForm({ ...form, category })} options={[["materials", locale === "ar" ? "مواد" : "Materials"], ["equipment", locale === "ar" ? "معدات" : "Equipment"]]} />
      {(Object.keys(form.scores) as Array<keyof SupplierScores>).map((key) => (
        <NumberField key={key} label={scoreLabel(key, locale)} value={form.scores[key]} onChange={(value) => setScore(key, value)} step={0.5} />
      ))}
    </Editor>
  );
}

function RiskEditor({ editing, form, locale, save, setForm }: { editing: boolean; form: RiskItem; locale: V2Locale; save: () => void; setForm: (form: RiskItem) => void }) {
  return (
    <Editor title={editing ? txt("edit", locale) : txt("add", locale)} saveLabel={editing ? txt("update", locale) : txt("add", locale)} onSave={save}>
      <TextField label={txt("code", locale)} value={form.code} onChange={(code) => setForm({ ...form, code })} />
      <TextField label={txt("name", locale)} value={pickText(form.statement, locale)} onChange={(statement) => setForm({ ...form, statement: localized(statement, locale) })} />
      <TextField label={txt("category", locale)} value={form.category} onChange={(category) => setForm({ ...form, category })} />
      <NumberField label={txt("probability", locale)} value={form.probability} onChange={(probability) => setForm({ ...form, probability })} step={0.05} />
      <NumberField label={txt("impact", locale)} value={form.impact} onChange={(impact) => setForm({ ...form, impact })} />
    </Editor>
  );
}

function RowActions({ locale, onDelete, onEdit }: { locale: V2Locale; onDelete: () => void; onEdit: () => void }) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={onEdit}><Edit2 className="me-1 h-4 w-4" />{txt("edit", locale)}</Button>
      <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="me-1 h-4 w-4 text-rose-600" />{txt("delete", locale)}</Button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="mt-3 rounded-md border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-slate-950" dir="ltr">{value}</p></div>;
}

function SoftBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{children}</Badge>;
}

function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return <Label className="grid gap-2 text-xs text-slate-600">{label}<Input className="border-slate-200 bg-white text-slate-950" value={value} onChange={(event) => onChange(event.target.value)} /></Label>;
}

function NumberField({ label, onChange, onTextChange, step = 1, textValue, value }: { label: string; onChange: (value: number) => void; onTextChange?: (value: string) => void; step?: number; textValue?: string; value: number }) {
  if (textValue !== undefined && onTextChange) {
    return <Label className="grid gap-2 text-xs text-slate-600">{label}<Input className="border-slate-200 bg-white text-slate-950" value={textValue} onChange={(event) => onTextChange(event.target.value)} /></Label>;
  }
  return <Label className="grid gap-2 text-xs text-slate-600">{label}<Input className="border-slate-200 bg-white text-slate-950" type="number" step={step} value={value} onChange={(event) => onChange(toNumber(event.target.value))} /></Label>;
}

function SelectField({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: Array<[string, string]>; value: string }) {
  return (
    <Label className="grid w-full gap-2 text-xs text-slate-600">
      {label}
      <select className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-cyan-400" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </Label>
  );
}

function txt(key: CopyKey, locale: V2Locale) {
  return pickText(copy[key], locale);
}

function localized(value: string, locale: V2Locale) {
  return locale === "ar" ? { ar: value, en: value } : { ar: value, en: value };
}

function blankRate(): RateItem {
  return { id: "draft", code: "", name: { ar: "", en: "" }, type: "MATERIAL", unit: "م2", rate: 0, waste: 1, source: "manual" };
}

function blankProject(): ProjectItem {
  return { id: "draft", code: "PRJ-2026-NEW", name: { ar: "", en: "" }, client: "", type: "تجاري", status: "DRAFT", area: 0, duration: 0, estimates: 0 };
}

function blankSupplier(): SupplierItem {
  return { id: "draft", name: "", category: "materials", scores: { quality: 7, price: 7, delivery: 7, payment: 7, experience: 7, afterSales: 7, riskDeduction: 1 } };
}

function blankRisk(): RiskItem {
  return { id: "draft", code: "R-NEW", statement: { ar: "", en: "" }, category: "cost", probability: 0.2, impact: 100000 };
}

function updateEstimate(setEstimates: React.Dispatch<React.SetStateAction<EstimateItem[]>>, id: string, updater: (item: EstimateItem) => EstimateItem) {
  setEstimates((current) => current.map((item) => item.id === id ? updater(item) : item));
}

function supplierScore(scores: SupplierScores) {
  return Math.max(0, (scores.quality + scores.price + scores.delivery + scores.payment + scores.experience + scores.afterSales) / 6 - scores.riskDeduction * 0.25);
}

function supplierStatus(score: number, locale: V2Locale) {
  const status: SupplierStatus = score >= 8 ? "primary" : score >= 7 ? "conditional" : score >= 6 ? "backup" : "rejected";
  const labels: Record<SupplierStatus, { ar: string; en: string }> = {
    primary: { ar: "أساسي", en: "Primary" },
    conditional: { ar: "مشروط", en: "Conditional" },
    backup: { ar: "احتياطي", en: "Backup" },
    rejected: { ar: "مرفوض", en: "Rejected" },
  };
  return pickText(labels[status], locale);
}

function scoreLabel(key: string, locale: V2Locale) {
  const labels: Record<string, { ar: string; en: string }> = {
    quality: { ar: "الجودة", en: "Quality" },
    price: { ar: "السعر", en: "Price" },
    delivery: { ar: "التسليم", en: "Delivery" },
    payment: { ar: "شروط الدفع", en: "Payment" },
    experience: { ar: "الخبرة", en: "Experience" },
    afterSales: { ar: "ما بعد البيع", en: "After-sales" },
    riskDeduction: { ar: "خصم المخاطر", en: "Risk deduction" },
  };
  return pickText(labels[key], locale);
}

function riskEmv(risk: RiskItem) {
  return risk.probability * risk.impact;
}

function riskLevel(risk: RiskItem): RiskLevel {
  const emv = riskEmv(risk);
  if (emv >= 250000) return "high";
  if (emv >= 100000) return "medium";
  return "low";
}

function levelName(level: RiskLevel, locale: V2Locale) {
  const labels: Record<RiskLevel, { ar: string; en: string }> = {
    low: { ar: "منخفض", en: "Low" },
    medium: { ar: "متوسط", en: "Medium" },
    high: { ar: "مرتفع", en: "High" },
  };
  return pickText(labels[level], locale);
}

function levelClass(level: RiskLevel) {
  if (level === "high") return "border-rose-200 bg-rose-50 text-rose-800";
  if (level === "medium") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-emerald-200 bg-emerald-50 text-emerald-800";
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export { moduleOrder };
