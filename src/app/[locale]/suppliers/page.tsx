"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplierForm, type SupplierFormData } from "@/components/suppliers/SupplierForm";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import {
  calculateSupplierScore,
  getSupplierStatus,
  type SupplierStatus,
} from "@/lib/calculations";

interface Supplier {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  address?: string;
  totalScore: number;
  status: SupplierStatus;
  scores: {
    quality: number;
    price: number;
    delivery: number;
    paymentTerms: number;
    experience: number;
    afterSales: number;
    riskDeduction: number;
  };
}

// Sample data
const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "شركة الأهرام للمقاولات",
    category: "materials",
    phone: "+20 111 234 5678",
    email: "info@ahram.com",
    address: "القاهرة، مصر",
    totalScore: 8.35,
    status: "primary",
    scores: {
      quality: 9,
      price: 8,
      delivery: 8.5,
      paymentTerms: 7,
      experience: 9,
      afterSales: 7.5,
      riskDeduction: 1,
    },
  },
  {
    id: "2",
    name: "مصنع النيل للحديد",
    category: "materials",
    phone: "+20 122 345 6789",
    email: "sales@nile-steel.com",
    totalScore: 7.55,
    status: "conditional",
    scores: {
      quality: 8,
      price: 8.5,
      delivery: 7,
      paymentTerms: 6.5,
      experience: 8,
      afterSales: 6,
      riskDeduction: 2,
    },
  },
  {
    id: "3",
    name: "شركة المعدات الثقيلة",
    category: "equipment",
    phone: "+20 100 456 7890",
    totalScore: 6.25,
    status: "backup",
    scores: {
      quality: 7,
      price: 7,
      delivery: 6,
      paymentTerms: 5.5,
      experience: 6.5,
      afterSales: 5,
      riskDeduction: 1.5,
    },
  },
];

export default function SuppliersPage() {
  const t = useTranslations("suppliers");
  const tCommon = useTranslations("common");

  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const handleAddSupplier = (data: SupplierFormData) => {
    const totalScore = calculateSupplierScore(data.scores);
    const status = getSupplierStatus(totalScore);

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      totalScore,
      status,
      scores: data.scores,
    };

    setSuppliers((prev) => [...prev, newSupplier]);
  };

  const handleEditSupplier = (data: SupplierFormData) => {
    if (!editingSupplier) return;

    const totalScore = calculateSupplierScore(data.scores);
    const status = getSupplierStatus(totalScore);

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === editingSupplier.id
          ? {
              ...s,
              name: data.name,
              category: data.category,
              phone: data.phone || undefined,
              email: data.email || undefined,
              address: data.address || undefined,
              totalScore,
              status,
              scores: data.scores,
            }
          : s
      )
    );

    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || supplier.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || supplier.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Stats
  const stats = {
    total: suppliers.length,
    primary: suppliers.filter((s) => s.status === "primary").length,
    conditional: suppliers.filter((s) => s.status === "conditional").length,
    backup: suppliers.filter((s) => s.status === "backup").length,
    rejected: suppliers.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {tCommon("total")}: {suppliers.length}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addSupplier")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{tCommon("total")}</p>
        </div>
        <div className="rounded-lg border bg-green-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.primary}</p>
          <p className="text-sm text-muted-foreground">{t("statusPrimary")}</p>
        </div>
        <div className="rounded-lg border bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.conditional}</p>
          <p className="text-sm text-muted-foreground">{t("statusConditional")}</p>
        </div>
        <div className="rounded-lg border bg-orange-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.backup}</p>
          <p className="text-sm text-muted-foreground">{t("statusBackup")}</p>
        </div>
        <div className="rounded-lg border bg-red-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-muted-foreground">{t("statusRejected")}</p>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("supplierStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon("filter")}: {tCommon("total")}</SelectItem>
            <SelectItem value="primary">{t("statusPrimary")}</SelectItem>
            <SelectItem value="conditional">{t("statusConditional")}</SelectItem>
            <SelectItem value="backup">{t("statusBackup")}</SelectItem>
            <SelectItem value="rejected">{t("statusRejected")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("supplierCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon("filter")}: {tCommon("total")}</SelectItem>
            <SelectItem value="materials">{t("categories.materials")}</SelectItem>
            <SelectItem value="equipment">{t("categories.equipment")}</SelectItem>
            <SelectItem value="services">{t("categories.services")}</SelectItem>
            <SelectItem value="labor">{t("categories.labor")}</SelectItem>
            <SelectItem value="transportation">{t("categories.transportation")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Supplier Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={() => {
                setEditingSupplier(supplier);
                setFormOpen(true);
              }}
              onDelete={() => handleDeleteSupplier(supplier.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">{tCommon("noData")}</p>
          <Button
            variant="link"
            onClick={() => setFormOpen(true)}
            className="mt-2"
          >
            {t("addSupplier")}
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <SupplierForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingSupplier(null);
        }}
        onSubmit={editingSupplier ? handleEditSupplier : handleAddSupplier}
        initialData={
          editingSupplier
            ? {
                name: editingSupplier.name,
                category: editingSupplier.category,
                phone: editingSupplier.phone || "",
                email: editingSupplier.email || "",
                address: editingSupplier.address || "",
                scores: editingSupplier.scores,
              }
            : undefined
        }
      />
    </div>
  );
}
