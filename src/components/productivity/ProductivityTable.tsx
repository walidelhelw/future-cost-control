"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Search, Filter, ArrowUpDown, Users, Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { CrewCompositionInline } from "./CrewComposition";
import {
  productivityTemplates,
  type ProductivityTemplate,
  type ProductivitySource
} from "@/data/productivity-templates";
import {
  productivityCategories,
  getCategoryById,
  type ProductivityCategory
} from "@/data/productivity-categories";
import { getCrewRoleByCode } from "@/data/crew-roles";

interface ProductivityTableProps {
  onSelect?: (template: ProductivityTemplate) => void;
  selectedId?: string;
  className?: string;
}

type SortField = 'name' | 'category' | 'productivity' | 'crew';
type SortDirection = 'asc' | 'desc';

/**
 * Searchable, filterable table of productivity templates
 */
export function ProductivityTable({
  onSelect,
  selectedId,
  className
}: ProductivityTableProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Get unique sources from templates
  const sources = useMemo(() => {
    const sourceSet = new Set(productivityTemplates.map(t => t.source));
    return Array.from(sourceSet);
  }, []);

  // Get unique categories from templates
  const categoriesInUse = useMemo(() => {
    const categoryIds = new Set(productivityTemplates.map(t => t.categoryId));
    return productivityCategories.filter(c => categoryIds.has(c.id));
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = productivityTemplates.filter(t => t.isActive);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.nameAr.includes(searchQuery) ||
        (t.nameEn?.toLowerCase().includes(query)) ||
        t.code.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(t => t.categoryId === categoryFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      result = result.filter(t => t.source === sourceFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (isArabic ? a.nameAr : (a.nameEn ?? a.nameAr))
            .localeCompare(isArabic ? b.nameAr : (b.nameEn ?? b.nameAr), locale);
          break;
        case 'category':
          const catA = getCategoryById(a.categoryId);
          const catB = getCategoryById(b.categoryId);
          const catAName = (isArabic ? catA?.nameAr : catA?.nameEn) ?? "";
          const catBName = (isArabic ? catB?.nameAr : catB?.nameEn) ?? "";
          comparison = catAName.localeCompare(catBName, locale);
          break;
        case 'productivity':
          comparison = a.productivityRate - b.productivityRate;
          break;
        case 'crew':
          comparison = a.crewSize - b.crewSize;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, categoryFilter, sourceFilter, sortField, sortDirection, isArabic, locale]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getDailyCost = (template: ProductivityTemplate): number => {
    return template.crew.reduce((sum, member) => {
      const role = getCrewRoleByCode(member.roleCode);
      return sum + (role?.dailyRate ?? 0) * member.qty;
    }, 0);
  };

  return (
    <div className={cn("space-y-4", className)} dir={isArabic ? "rtl" : "ltr"}>
      {/* Filters Row */}
      <div className={cn("flex flex-wrap gap-4", isArabic && "flex-row-reverse")}>
        {/* Source Filter */}
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={isArabic ? "جميع المصادر" : "All Sources"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isArabic ? "جميع المصادر" : "All Sources"}
            </SelectItem>
            {sources.map(source => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 me-2 text-muted-foreground" />
            <SelectValue placeholder={isArabic ? "جميع الفئات" : "All Categories"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isArabic ? "جميع الفئات" : "All Categories"}
            </SelectItem>
            {categoriesInUse.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {isArabic ? cat.nameAr : cat.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", isArabic ? "right-3" : "left-3")} />
            <Input
              placeholder={isArabic ? "بحث..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={isArabic ? "pr-9" : "pl-9"}
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className={cn("text-sm text-muted-foreground", isArabic && "text-right")}>
        {isArabic
          ? `${filteredTemplates.length} نتيجة`
          : `${filteredTemplates.length} results`}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ms-3 h-8"
                  onClick={() => handleSort('name')}
                >
                  {isArabic ? "الوصف" : "Description"}
                  <ArrowUpDown className="ms-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ms-3 h-8"
                  onClick={() => handleSort('category')}
                >
                  {isArabic ? "الفئة" : "Category"}
                  <ArrowUpDown className="ms-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ms-3 h-8"
                  onClick={() => handleSort('productivity')}
                >
                  <Zap className="me-1 h-4 w-4" />
                  {isArabic ? "الإنتاجية" : "Productivity"}
                  <ArrowUpDown className="ms-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ms-3 h-8"
                  onClick={() => handleSort('crew')}
                >
                  <Users className="me-1 h-4 w-4" />
                  {isArabic ? "الطاقم" : "Crew"}
                  <ArrowUpDown className="ms-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                {isArabic ? "التكلفة/يوم" : "Cost/Day"}
              </TableHead>
              <TableHead>
                {isArabic ? "المصدر" : "Source"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {isArabic ? "لا توجد نتائج" : "No results found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map(template => {
                const category = getCategoryById(template.categoryId);
                const dailyCost = getDailyCost(template);
                const isSelected = selectedId === template.id;

                return (
                  <TableRow
                    key={template.id}
                    className={cn(
                      onSelect && "cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/5"
                    )}
                    onClick={() => onSelect?.(template)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {isArabic ? template.nameAr : (template.nameEn ?? template.nameAr)}
                        </p>
                        <p className="text-xs text-muted-foreground">{template.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {isArabic ? category?.nameAr : category?.nameEn}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {formatNumber(template.productivityRate, isArabic ? "ar-EG" : "en-US")}
                      </span>
                      <span className="text-xs text-muted-foreground ms-1">
                        {template.unitAr}/{isArabic ? "يوم" : "day"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <CrewCompositionInline crew={template.crew} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {formatCurrency(dailyCost, "EGP", isArabic ? "ar-EG" : "en-US")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {template.source}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
