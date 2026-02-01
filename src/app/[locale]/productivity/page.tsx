"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Zap, Calculator, Database, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ProductivityTable,
  ProductivityCalculator,
  CrewComposition
} from "@/components/productivity";
import { formatNumber } from "@/lib/utils";
import { productivityTemplates, getTemplateById, type ProductivityTemplate } from "@/data/productivity-templates";
import { productivityCategories } from "@/data/productivity-categories";
import { crewRoles, crewRoleCategoryLabels } from "@/data/crew-roles";

export default function ProductivityPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [selectedTemplate, setSelectedTemplate] = useState<ProductivityTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<string>("browse");

  const handleTemplateSelect = (template: ProductivityTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("calculate");
  };

  // Stats for overview
  const totalTemplates = productivityTemplates.filter(t => t.isActive).length;
  const totalCategories = productivityCategories.length;
  const totalRoles = crewRoles.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            {isArabic ? "معدلات الإنتاجية" : "Productivity Rates"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "استعرض معدلات الإنتاجية وحساب تكاليف العمالة"
              : "Browse productivity rates and calculate labor costs"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTemplates}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "نشاط مسجل" : "Activities Recorded"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Info className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCategories}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "فئة أعمال" : "Work Categories"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Calculator className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRoles}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "دور عمالي" : "Labor Roles"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse" className="gap-2">
            <Database className="h-4 w-4" />
            {isArabic ? "استعراض البيانات" : "Browse Data"}
          </TabsTrigger>
          <TabsTrigger value="calculate" className="gap-2">
            <Calculator className="h-4 w-4" />
            {isArabic ? "حاسبة الإنتاجية" : "Calculator"}
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? "جدول معدلات الإنتاجية" : "Productivity Rates Table"}</CardTitle>
              <CardDescription>
                {isArabic
                  ? "انقر على أي صف للانتقال إلى الحاسبة"
                  : "Click any row to go to the calculator"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductivityTable
                onSelect={handleTemplateSelect}
                selectedId={selectedTemplate?.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculate Tab */}
        <TabsContent value="calculate" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calculator */}
            <ProductivityCalculator
              initialTemplateId={selectedTemplate?.id}
              onCalculate={(result) => {
                console.log("Calculation result:", result);
                // TODO: Integrate with estimates workflow
              }}
            />

            {/* Selected Template Details */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isArabic ? "تفاصيل النشاط" : "Activity Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Activity Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "الوصف" : "Description"}
                      </p>
                      <p className="font-medium">
                        {isArabic ? selectedTemplate.nameAr : (selectedTemplate.nameEn ?? selectedTemplate.nameAr)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? "الكود" : "Code"}
                        </p>
                        <Badge variant="outline">{selectedTemplate.code}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? "الوحدة" : "Unit"}
                        </p>
                        <p className="font-medium">{selectedTemplate.unitAr}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? "معدل الإنتاجية" : "Productivity Rate"}
                        </p>
                        <p className="font-medium">
                          {formatNumber(selectedTemplate.productivityRate, isArabic ? "ar-EG" : "en-US")} {selectedTemplate.unitAr}/
                          {isArabic ? "يوم" : "day"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? "المصدر" : "Source"}
                        </p>
                        <p className="font-medium">{selectedTemplate.source}</p>
                      </div>
                    </div>
                  </div>

                  {/* Crew Composition */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      {isArabic ? "تكوين الطاقم" : "Crew Composition"}
                    </p>
                    <CrewComposition crew={selectedTemplate.crew} showCost />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!selectedTemplate && (
              <Card className="flex items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isArabic
                      ? "اختر نشاطاً من القائمة لعرض التفاصيل"
                      : "Select an activity from the list to view details"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Source Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isArabic ? "مصادر البيانات" : "Data Sources"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic
                  ? "تم جمع معدلات الإنتاجية من عدة مصادر: بتروجت، H.A، البقري/النادي، ومصادر أخرى. المعدلات المعروضة هي متوسطات حيثما توفرت بيانات متعددة."
                  : "Productivity rates collected from multiple sources: Petrojet, H.A, El-Baqari/El-Nadi, and others. Rates shown are averages where multiple data points exist."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
