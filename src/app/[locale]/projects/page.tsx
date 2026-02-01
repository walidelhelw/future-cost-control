"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Plus,
  Search,
  Filter,
  Building2,
  FileSpreadsheet,
  MapPin,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { Project, ProjectStatus } from "@/lib/supabase";

interface ProjectWithCount {
  id: string;
  code: string;
  name: string;
  client: string;
  description?: string;
  project_type: string;
  location?: string;
  area?: number;
  floors?: number;
  units?: number;
  duration?: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  estimates_count: number;
}

// Sample data
const sampleProjects: ProjectWithCount[] = [
  {
    id: "1",
    code: "PRJ-2024-001",
    name: "فيلا سكنية - التجمع الخامس",
    client: "شركة الفيصل للتطوير العقاري",
    description: "بناء فيلا سكنية مكونة من 3 أدوار",
    project_type: "RESIDENTIAL",
    location: "القاهرة - التجمع الخامس",
    area: 450,
    floors: 3,
    units: 1,
    duration: 12,
    status: "ACTIVE",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    estimates_count: 2,
  },
  {
    id: "2",
    code: "PRJ-2024-002",
    name: "مجمع تجاري - المعادي",
    client: "شركة النور التجارية",
    description: "مجمع تجاري يحتوي على محلات ومكاتب",
    project_type: "COMMERCIAL",
    location: "القاهرة - المعادي",
    area: 2500,
    floors: 5,
    units: 24,
    duration: 18,
    status: "DRAFT",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
    estimates_count: 1,
  },
  {
    id: "3",
    code: "PRJ-2024-003",
    name: "مصنع مواد غذائية",
    client: "شركة الغذاء الصحي",
    description: "مصنع لتعبئة وتغليف المواد الغذائية",
    project_type: "INDUSTRIAL",
    location: "السادس من أكتوبر",
    area: 5000,
    floors: 2,
    duration: 24,
    status: "ON_HOLD",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
    estimates_count: 3,
  },
];

const statusColors: Record<ProjectStatus, string> = {
  DRAFT: "bg-gray-500",
  ACTIVE: "bg-green-500",
  ON_HOLD: "bg-yellow-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-red-500",
};

const projectTypeIcons: Record<string, React.ReactNode> = {
  RESIDENTIAL: <Building2 className="h-5 w-5" />,
  COMMERCIAL: <Building2 className="h-5 w-5" />,
  INDUSTRIAL: <Building2 className="h-5 w-5" />,
  INFRASTRUCTURE: <Building2 className="h-5 w-5" />,
};

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [projects, setProjects] = useState<ProjectWithCount[]>(sampleProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithCount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    client: "",
    description: "",
    project_type: "RESIDENTIAL",
    location: "",
    area: 0,
    floors: 0,
    units: 0,
    duration: 0,
    status: "DRAFT" as ProjectStatus,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      client: "",
      description: "",
      project_type: "RESIDENTIAL",
      location: "",
      area: 0,
      floors: 0,
      units: 0,
      duration: 0,
      status: "DRAFT",
    });
    setEditingProject(null);
  };

  const handleOpenForm = (project?: ProjectWithCount) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        code: project.code,
        name: project.name,
        client: project.client,
        description: project.description || "",
        project_type: project.project_type,
        location: project.location || "",
        area: project.area || 0,
        floors: project.floors || 0,
        units: project.units || 0,
        duration: project.duration || 0,
        status: project.status,
      });
    } else {
      resetForm();
      // Generate project code
      const year = new Date().getFullYear();
      const count = projects.filter((p) => p.code.includes(year.toString())).length + 1;
      setFormData((prev) => ({
        ...prev,
        code: `PRJ-${year}-${count.toString().padStart(3, "0")}`,
      }));
    }
    setFormOpen(true);
  };

  const handleSubmit = () => {
    const newProject: ProjectWithCount = {
      id: editingProject?.id || Date.now().toString(),
      code: formData.code,
      name: formData.name,
      client: formData.client,
      description: formData.description || undefined,
      project_type: formData.project_type,
      location: formData.location || undefined,
      area: formData.area || undefined,
      floors: formData.floors || undefined,
      units: formData.units || undefined,
      duration: formData.duration || undefined,
      status: formData.status,
      created_at: editingProject?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimates_count: editingProject?.estimates_count || 0,
    };

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? newProject : p))
      );
    } else {
      setProjects((prev) => [...prev, newProject]);
    }

    setFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesType =
      typeFilter === "all" || project.project_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    draft: projects.filter((p) => p.status === "DRAFT").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  };

  const formatArea = (value: number | undefined) => {
    if (!value) return "-";
    return `${value.toLocaleString("ar-EG")} م²`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {tCommon("total")}: {projects.length}
          </p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addProject")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{tCommon("total")}</p>
        </div>
        <div className="rounded-lg border bg-green-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.active")}</p>
        </div>
        <div className="rounded-lg border bg-gray-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.draft")}</p>
        </div>
        <div className="rounded-lg border bg-yellow-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.onHold}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.onHold")}</p>
        </div>
        <div className="rounded-lg border bg-blue-500/10 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
          <p className="text-sm text-muted-foreground">{t("statuses.completed")}</p>
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
            <SelectValue placeholder={t("projectStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon("total")}</SelectItem>
            <SelectItem value="DRAFT">{t("statuses.draft")}</SelectItem>
            <SelectItem value="ACTIVE">{t("statuses.active")}</SelectItem>
            <SelectItem value="ON_HOLD">{t("statuses.onHold")}</SelectItem>
            <SelectItem value="COMPLETED">{t("statuses.completed")}</SelectItem>
            <SelectItem value="CANCELLED">{t("statuses.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("projectType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon("total")}</SelectItem>
            <SelectItem value="RESIDENTIAL">{t("types.residential")}</SelectItem>
            <SelectItem value="COMMERCIAL">{t("types.commercial")}</SelectItem>
            <SelectItem value="INDUSTRIAL">{t("types.industrial")}</SelectItem>
            <SelectItem value="INFRASTRUCTURE">{t("types.infrastructure")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-mono text-muted-foreground">
                      {project.code}
                    </p>
                    <CardTitle className="text-lg mt-1">{project.name}</CardTitle>
                    <CardDescription>{project.client}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenForm(project)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        {tCommon("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/estimates?project=${project.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("viewEstimates")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(project.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {tCommon("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={statusColors[project.status]}>
                    {t(`statuses.${project.status.toLowerCase().replace("_", "")}`)}
                  </Badge>
                  <Badge variant="outline">
                    {t(`types.${project.project_type.toLowerCase()}`)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {project.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>
                      {formatArea(project.area)}
                      {project.floors && ` • ${project.floors} ${t("floors")}`}
                    </span>
                  </div>
                  {project.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{project.duration} {t("duration").replace("(months)", "").replace("(شهور)", "").trim()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {project.estimates_count} {t("estimatesCount")}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${locale}/estimates?project=${project.id}`}>
                      {t("createEstimate")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{tCommon("noData")}</p>
          <Button variant="link" onClick={() => handleOpenForm()} className="mt-2">
            {t("addProject")}
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? t("editProject") : t("addProject")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("projectCode")}</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!editingProject}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("projectStatus")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as ProjectStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">{t("statuses.draft")}</SelectItem>
                  <SelectItem value="ACTIVE">{t("statuses.active")}</SelectItem>
                  <SelectItem value="ON_HOLD">{t("statuses.onHold")}</SelectItem>
                  <SelectItem value="COMPLETED">{t("statuses.completed")}</SelectItem>
                  <SelectItem value="CANCELLED">{t("statuses.cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>{t("projectName")}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="فيلا سكنية - التجمع الخامس"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>{t("client")}</Label>
              <Input
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="شركة الفيصل للتطوير العقاري"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>{tCommon("description")}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("projectType")}</Label>
              <Select
                value={formData.project_type}
                onValueChange={(value) => setFormData({ ...formData, project_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENTIAL">{t("types.residential")}</SelectItem>
                  <SelectItem value="COMMERCIAL">{t("types.commercial")}</SelectItem>
                  <SelectItem value="INDUSTRIAL">{t("types.industrial")}</SelectItem>
                  <SelectItem value="INFRASTRUCTURE">{t("types.infrastructure")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("location")}</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="القاهرة - التجمع الخامس"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("area")}</Label>
              <Input
                type="number"
                value={formData.area || ""}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("floors")}</Label>
              <Input
                type="number"
                value={formData.floors || ""}
                onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("units")}</Label>
              <Input
                type="number"
                value={formData.units || ""}
                onChange={(e) => setFormData({ ...formData, units: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("duration")}</Label>
              <Input
                type="number"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleSubmit}>{tCommon("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
