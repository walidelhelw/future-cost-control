"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  // Sample stats
  const stats = {
    suppliers: {
      total: 12,
      primary: 5,
      conditional: 4,
      backup: 2,
      rejected: 1,
    },
    boq: {
      activeEstimates: 3,
      totalValue: 15750000,
    },
    risks: {
      total: 17,
      high: 4,
      medium: 8,
      low: 5,
    },
    cashflow: {
      status: "positive",
      npv: 3500000,
    },
  };

  // Sample recent activity
  const recentActivity = [
    {
      id: 1,
      type: "supplier",
      action: locale === "ar" ? "تم تقييم مورد جديد" : "New supplier evaluated",
      name: "شركة الأهرام للمقاولات",
      status: "primary",
      time: locale === "ar" ? "منذ ساعتين" : "2 hours ago",
    },
    {
      id: 2,
      type: "risk",
      action: locale === "ar" ? "تم إضافة خطر جديد" : "New risk added",
      name: locale === "ar" ? "زيادة أسعار مواد البناء" : "Material price increase",
      status: "high",
      time: locale === "ar" ? "منذ 5 ساعات" : "5 hours ago",
    },
    {
      id: 3,
      type: "boq",
      action: locale === "ar" ? "تقدير جديد" : "New estimate",
      name: locale === "ar" ? "مشروع البرج السكني" : "Residential Tower Project",
      status: "active",
      time: locale === "ar" ? "أمس" : "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Suppliers Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalSuppliers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suppliers.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="success" className="text-xs">
                {stats.suppliers.primary} {t("primary")}
              </Badge>
              <Badge variant="warning" className="text-xs">
                {stats.suppliers.conditional} {t("conditional")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* BOQ Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeEstimates")}
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.boq.activeEstimates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 0,
              }).format(stats.boq.totalValue)}
            </p>
          </CardContent>
        </Card>

        {/* Risks Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("highRisks")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.risks.high}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="warning" className="text-xs">
                {stats.risks.medium}{" "}
                {locale === "ar" ? "متوسط" : "Medium"}
              </Badge>
              <Badge variant="success" className="text-xs">
                {stats.risks.low} {locale === "ar" ? "منخفض" : "Low"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cashflow Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cashflowStatus")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.cashflow.status === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.cashflow.status === "positive" ? t("positive") : t("negative")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              NPV:{" "}
              {new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 0,
              }).format(stats.cashflow.npv)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href={`/${locale}/suppliers`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>{t("newSupplier")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/boq`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <Calculator className="h-6 w-6 mb-2" />
                <span>{t("newEstimate")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/risks`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span>{t("newRisk")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/cashflow`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>{t("newCashflow")}</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === "supplier"
                        ? "bg-blue-500/10 text-blue-600"
                        : activity.type === "risk"
                        ? "bg-red-500/10 text-red-600"
                        : "bg-green-500/10 text-green-600"
                    }`}
                  >
                    {activity.type === "supplier" ? (
                      <Users className="h-4 w-4" />
                    ) : activity.type === "risk" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Calculator className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{t("totalSuppliers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {stats.suppliers.primary}
              </p>
              <p className="text-sm text-muted-foreground">{t("primary")}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
              <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {stats.suppliers.conditional}
              </p>
              <p className="text-sm text-muted-foreground">{t("conditional")}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10">
              <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {stats.suppliers.backup}
              </p>
              <p className="text-sm text-muted-foreground">{t("backup")}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold text-red-600">
                {stats.suppliers.rejected}
              </p>
              <p className="text-sm text-muted-foreground">{t("rejected")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
