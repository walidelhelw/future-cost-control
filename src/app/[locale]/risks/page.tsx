"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskMatrix } from "@/components/risks/RiskMatrix";
import { RiskForm, type RiskFormData } from "@/components/risks/RiskForm";
import { RiskCard } from "@/components/risks/RiskCard";
import { calculateRiskEMV } from "@/lib/calculations";
import { riskCatalog } from "@/data/risk-catalog";

interface Risk {
  id: string;
  riskId: string;
  riskStatement: string;
  probability: number;
  impact: number;
  category: string;
  mitigationPlan?: string;
  emv: number;
  riskCategory: "high" | "medium" | "low";
}

// Initialize with some risks from the catalog
const initialRisks: Risk[] = riskCatalog.slice(0, 6).map((template, index) => {
  const { emv, category } = calculateRiskEMV(
    template.defaultProbability,
    template.defaultImpact
  );
  return {
    id: `${index + 1}`,
    riskId: template.id,
    riskStatement: template.statementAr,
    probability: template.defaultProbability,
    impact: template.defaultImpact,
    category: template.category,
    emv,
    riskCategory: category,
  };
});

export default function RisksPage() {
  const t = useTranslations("risks");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const handleAddRisk = (data: RiskFormData) => {
    const { emv, category } = calculateRiskEMV(data.probability, data.impact);

    const newRisk: Risk = {
      id: Date.now().toString(),
      riskId: data.riskId,
      riskStatement: data.riskStatement,
      probability: data.probability,
      impact: data.impact,
      category: data.category,
      mitigationPlan: data.mitigationPlan || undefined,
      emv,
      riskCategory: category,
    };

    setRisks((prev) => [...prev, newRisk]);
  };

  const handleEditRisk = (data: RiskFormData) => {
    if (!editingRisk) return;

    const { emv, category } = calculateRiskEMV(data.probability, data.impact);

    setRisks((prev) =>
      prev.map((r) =>
        r.id === editingRisk.id
          ? {
              ...r,
              riskId: data.riskId,
              riskStatement: data.riskStatement,
              probability: data.probability,
              impact: data.impact,
              category: data.category,
              mitigationPlan: data.mitigationPlan || undefined,
              emv,
              riskCategory: category,
            }
          : r
      )
    );

    setEditingRisk(null);
  };

  const handleDeleteRisk = (id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRiskClickInMatrix = (matrixRisk: { id: string }) => {
    const fullRisk = risks.find((r) => r.riskId === matrixRisk.id);
    if (fullRisk) {
      setSelectedRisk(fullRisk);
    }
  };

  // Stats
  const stats = {
    total: risks.length,
    high: risks.filter((r) => r.riskCategory === "high").length,
    medium: risks.filter((r) => r.riskCategory === "medium").length,
    low: risks.filter((r) => r.riskCategory === "low").length,
    totalEMV: risks.reduce((sum, r) => sum + r.emv, 0),
  };

  // Format risks for matrix
  const matrixRisks = risks.map((r) => ({
    id: r.riskId,
    probability: r.probability,
    impact: r.impact,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("riskCount")}: {risks.length}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addRisk")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{t("riskCount")}</p>
        </div>
        <div className="rounded-lg border bg-red-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.high}</p>
          <p className="text-sm text-muted-foreground">{t("highRisk")}</p>
        </div>
        <div className="rounded-lg border bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
          <p className="text-sm text-muted-foreground">{t("mediumRisk")}</p>
        </div>
        <div className="rounded-lg border bg-green-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.low}</p>
          <p className="text-sm text-muted-foreground">{t("lowRisk")}</p>
        </div>
        <div className="rounded-lg border bg-primary/10 p-4 text-center">
          <p className="text-3xl font-bold text-primary">
            {stats.totalEMV.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">{t("totalEmv")}</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">{t("riskMatrix")}</TabsTrigger>
          <TabsTrigger value="list">{t("riskCount")}</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <RiskMatrix risks={matrixRisks} onRiskClick={handleRiskClickInMatrix} />
            </CardContent>
          </Card>

          {/* Selected Risk Details */}
          {selectedRisk && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {selectedRisk.riskId}: {selectedRisk.riskStatement}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("probability")}
                    </p>
                    <p className="text-xl font-bold">
                      {(selectedRisk.probability * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">{t("impact")}</p>
                    <p className="text-xl font-bold">
                      {(selectedRisk.impact * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">{t("emv")}</p>
                    <p className="text-xl font-bold">
                      {selectedRisk.emv.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("riskCategory")}
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        selectedRisk.riskCategory === "high"
                          ? "text-red-500"
                          : selectedRisk.riskCategory === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {selectedRisk.riskCategory === "high"
                        ? t("highRisk")
                        : selectedRisk.riskCategory === "medium"
                        ? t("mediumRisk")
                        : t("lowRisk")}
                    </p>
                  </div>
                </div>
                {selectedRisk.mitigationPlan && (
                  <div className="mt-4 rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("mitigationPlan")}
                    </p>
                    <p>{selectedRisk.mitigationPlan}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list">
          {risks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {risks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  onEdit={() => {
                    setEditingRisk(risk);
                    setFormOpen(true);
                  }}
                  onDelete={() => handleDeleteRisk(risk.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{tCommon("noData")}</p>
              <Button
                variant="link"
                onClick={() => setFormOpen(true)}
                className="mt-2"
              >
                {t("addRisk")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <RiskForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingRisk(null);
        }}
        onSubmit={editingRisk ? handleEditRisk : handleAddRisk}
        initialData={
          editingRisk
            ? {
                riskId: editingRisk.riskId,
                riskStatement: editingRisk.riskStatement,
                probability: editingRisk.probability,
                impact: editingRisk.impact,
                category: editingRisk.category,
                mitigationPlan: editingRisk.mitigationPlan || "",
              }
            : undefined
        }
      />
    </div>
  );
}
