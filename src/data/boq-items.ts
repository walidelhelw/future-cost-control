export interface BOQItem {
  id: string;
  nameAr: string;
  nameEn: string;
  unit: string;
  unitAr: string;
  directCost: number;
  category: string;
}

export interface BOQCategory {
  id: string;
  nameAr: string;
  nameEn: string;
}

export const boqCategories: BOQCategory[] = [
  { id: "excavation", nameAr: "أعمال الحفر", nameEn: "Excavation Works" },
  { id: "concrete", nameAr: "أعمال الخرسانة", nameEn: "Concrete Works" },
  { id: "masonry", nameAr: "أعمال المباني", nameEn: "Masonry Works" },
  { id: "waterproofing", nameAr: "أعمال العزل", nameEn: "Waterproofing" },
  { id: "plastering", nameAr: "أعمال البياض", nameEn: "Plastering Works" },
  { id: "painting", nameAr: "أعمال الدهانات", nameEn: "Painting Works" },
  { id: "flooring", nameAr: "أعمال الأرضيات", nameEn: "Flooring Works" },
  { id: "mep", nameAr: "الأعمال الكهروميكانيكية", nameEn: "MEP Works" },
];

export const boqItems: BOQItem[] = [
  // Excavation Works (أعمال الحفر)
  {
    id: "exc-001",
    nameAr: "حفر في تربة عادية",
    nameEn: "Excavation in normal soil",
    unit: "m³",
    unitAr: "م³",
    directCost: 35,
    category: "excavation",
  },
  {
    id: "exc-002",
    nameAr: "حفر في تربة صخرية",
    nameEn: "Excavation in rocky soil",
    unit: "m³",
    unitAr: "م³",
    directCost: 120,
    category: "excavation",
  },
  {
    id: "exc-003",
    nameAr: "ردم بالرمل",
    nameEn: "Backfill with sand",
    unit: "m³",
    unitAr: "م³",
    directCost: 85,
    category: "excavation",
  },
  {
    id: "exc-004",
    nameAr: "إحلال بالزلط",
    nameEn: "Replacement with gravel",
    unit: "m³",
    unitAr: "م³",
    directCost: 150,
    category: "excavation",
  },

  // Concrete Works (أعمال الخرسانة)
  {
    id: "con-001",
    nameAr: "خرسانة عادية C150",
    nameEn: "Plain Concrete C150",
    unit: "m³",
    unitAr: "م³",
    directCost: 750,
    category: "concrete",
  },
  {
    id: "con-002",
    nameAr: "خرسانة مسلحة C250",
    nameEn: "Reinforced Concrete C250",
    unit: "m³",
    unitAr: "م³",
    directCost: 1450,
    category: "concrete",
  },
  {
    id: "con-003",
    nameAr: "خرسانة مسلحة C300",
    nameEn: "Reinforced Concrete C300",
    unit: "m³",
    unitAr: "م³",
    directCost: 1650,
    category: "concrete",
  },
  {
    id: "con-004",
    nameAr: "حديد تسليح",
    nameEn: "Steel Reinforcement",
    unit: "ton",
    unitAr: "طن",
    directCost: 28000,
    category: "concrete",
  },
  {
    id: "con-005",
    nameAr: "شدة خشبية للأسقف",
    nameEn: "Wooden formwork for slabs",
    unit: "m²",
    unitAr: "م²",
    directCost: 180,
    category: "concrete",
  },

  // Masonry Works (أعمال المباني)
  {
    id: "mas-001",
    nameAr: "مباني طوب أحمر 12سم",
    nameEn: "Red brick masonry 12cm",
    unit: "m²",
    unitAr: "م²",
    directCost: 180,
    category: "masonry",
  },
  {
    id: "mas-002",
    nameAr: "مباني طوب أحمر 25سم",
    nameEn: "Red brick masonry 25cm",
    unit: "m²",
    unitAr: "م²",
    directCost: 320,
    category: "masonry",
  },
  {
    id: "mas-003",
    nameAr: "مباني بلوك خرساني",
    nameEn: "Concrete block masonry",
    unit: "m²",
    unitAr: "م²",
    directCost: 250,
    category: "masonry",
  },

  // Waterproofing (أعمال العزل)
  {
    id: "wat-001",
    nameAr: "عزل رولات بيتومين",
    nameEn: "Bitumen roll waterproofing",
    unit: "m²",
    unitAr: "م²",
    directCost: 120,
    category: "waterproofing",
  },
  {
    id: "wat-002",
    nameAr: "عزل إنسوميل",
    nameEn: "Insomeal waterproofing",
    unit: "m²",
    unitAr: "م²",
    directCost: 85,
    category: "waterproofing",
  },
  {
    id: "wat-003",
    nameAr: "عزل حراري فوم",
    nameEn: "Foam thermal insulation",
    unit: "m²",
    unitAr: "م²",
    directCost: 150,
    category: "waterproofing",
  },

  // Plastering Works (أعمال البياض)
  {
    id: "pla-001",
    nameAr: "بياض طرطشة",
    nameEn: "Rough plastering",
    unit: "m²",
    unitAr: "م²",
    directCost: 25,
    category: "plastering",
  },
  {
    id: "pla-002",
    nameAr: "بياض محارة داخلي",
    nameEn: "Internal cement plastering",
    unit: "m²",
    unitAr: "م²",
    directCost: 65,
    category: "plastering",
  },
  {
    id: "pla-003",
    nameAr: "بياض محارة خارجي",
    nameEn: "External cement plastering",
    unit: "m²",
    unitAr: "م²",
    directCost: 85,
    category: "plastering",
  },
  {
    id: "pla-004",
    nameAr: "بطانة جبس",
    nameEn: "Gypsum lining",
    unit: "m²",
    unitAr: "م²",
    directCost: 45,
    category: "plastering",
  },

  // Painting Works (أعمال الدهانات)
  {
    id: "pai-001",
    nameAr: "دهان بلاستيك داخلي",
    nameEn: "Internal plastic paint",
    unit: "m²",
    unitAr: "م²",
    directCost: 55,
    category: "painting",
  },
  {
    id: "pai-002",
    nameAr: "دهان بلاستيك خارجي",
    nameEn: "External plastic paint",
    unit: "m²",
    unitAr: "م²",
    directCost: 75,
    category: "painting",
  },
  {
    id: "pai-003",
    nameAr: "دهان زيتي للأخشاب",
    nameEn: "Oil paint for wood",
    unit: "m²",
    unitAr: "م²",
    directCost: 95,
    category: "painting",
  },
  {
    id: "pai-004",
    nameAr: "دهان إيبوكسي",
    nameEn: "Epoxy paint",
    unit: "m²",
    unitAr: "م²",
    directCost: 180,
    category: "painting",
  },

  // Flooring Works (أعمال الأرضيات)
  {
    id: "flo-001",
    nameAr: "سيراميك أرضيات عادي",
    nameEn: "Standard floor ceramic",
    unit: "m²",
    unitAr: "م²",
    directCost: 180,
    category: "flooring",
  },
  {
    id: "flo-002",
    nameAr: "سيراميك أرضيات فاخر",
    nameEn: "Premium floor ceramic",
    unit: "m²",
    unitAr: "م²",
    directCost: 350,
    category: "flooring",
  },
  {
    id: "flo-003",
    nameAr: "بورسلين أرضيات",
    nameEn: "Porcelain flooring",
    unit: "m²",
    unitAr: "م²",
    directCost: 450,
    category: "flooring",
  },
  {
    id: "flo-004",
    nameAr: "رخام أرضيات محلي",
    nameEn: "Local marble flooring",
    unit: "m²",
    unitAr: "م²",
    directCost: 550,
    category: "flooring",
  },
  {
    id: "flo-005",
    nameAr: "جرانيت أرضيات",
    nameEn: "Granite flooring",
    unit: "m²",
    unitAr: "م²",
    directCost: 750,
    category: "flooring",
  },

  // MEP Works (الأعمال الكهروميكانيكية)
  {
    id: "mep-001",
    nameAr: "نقطة كهرباء إنارة",
    nameEn: "Lighting electrical point",
    unit: "point",
    unitAr: "نقطة",
    directCost: 250,
    category: "mep",
  },
  {
    id: "mep-002",
    nameAr: "نقطة كهرباء بريزة",
    nameEn: "Socket electrical point",
    unit: "point",
    unitAr: "نقطة",
    directCost: 200,
    category: "mep",
  },
  {
    id: "mep-003",
    nameAr: "مواسير صرف PVC 4\"",
    nameEn: "PVC drainage pipes 4\"",
    unit: "m.l",
    unitAr: "م.ط",
    directCost: 120,
    category: "mep",
  },
  {
    id: "mep-004",
    nameAr: "مواسير تغذية PPR",
    nameEn: "PPR supply pipes",
    unit: "m.l",
    unitAr: "م.ط",
    directCost: 85,
    category: "mep",
  },
  {
    id: "mep-005",
    nameAr: "طقم حمام كامل اقتصادي",
    nameEn: "Complete bathroom set (economy)",
    unit: "set",
    unitAr: "طقم",
    directCost: 8500,
    category: "mep",
  },
  {
    id: "mep-006",
    nameAr: "طقم حمام كامل فاخر",
    nameEn: "Complete bathroom set (premium)",
    unit: "set",
    unitAr: "طقم",
    directCost: 25000,
    category: "mep",
  },
];

export function getItemsByCategory(categoryId: string): BOQItem[] {
  return boqItems.filter((item) => item.category === categoryId);
}

export function getItemById(itemId: string): BOQItem | undefined {
  return boqItems.find((item) => item.id === itemId);
}

export function getCategoryById(categoryId: string): BOQCategory | undefined {
  return boqCategories.find((cat) => cat.id === categoryId);
}
