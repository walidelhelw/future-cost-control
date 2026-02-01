#!/usr/bin/env python3
"""
Extract data from Excel files and generate seed data for Smart Estimate module
"""

import msoffcrypto
import pandas as pd
import io
import json
import re
from datetime import datetime

PASSWORD = "BETA"

def decrypt_excel(file_path):
    """Decrypt password-protected Excel file"""
    decrypted = io.BytesIO()
    with open(file_path, 'rb') as file:
        office_file = msoffcrypto.OfficeFile(file)
        office_file.load_key(password=PASSWORD)
        office_file.decrypt(decrypted)
    return decrypted

def extract_labor_rates():
    """Extract labor rates from Sheet 16"""
    # Data extracted from Excel Sheet 16
    labor_data = [
        {"code": "LAB-CARP-FND", "name_ar": "نجار - قواعد عادية", "name_en": "Carpenter - Plain Foundations", "unit": "م³/يوم", "rate": 10, "type": "LABOR"},
        {"code": "LAB-CARP-SLAB", "name_ar": "نجار - لبشة عادية", "name_en": "Carpenter - Plain Slab", "unit": "م³/يوم", "rate": 50, "type": "LABOR"},
        {"code": "LAB-CARP-RFND", "name_ar": "نجار - قواعد مسلحة", "name_en": "Carpenter - Reinforced Foundations", "unit": "م³/يوم", "rate": 3, "type": "LABOR"},
        {"code": "LAB-CARP-COL", "name_ar": "نجار - أعمدة", "name_en": "Carpenter - Columns", "unit": "م³/يوم", "rate": 1.5, "type": "LABOR"},
        {"code": "LAB-CARP-SOLID", "name_ar": "نجار - أسقف سوليد", "name_en": "Carpenter - Solid Slab", "unit": "م³/يوم", "rate": 3, "type": "LABOR"},
        {"code": "LAB-CARP-FLAT", "name_ar": "نجار - أسقف فلات", "name_en": "Carpenter - Flat Slab", "unit": "م³/يوم", "rate": 5, "type": "LABOR"},
        {"code": "LAB-STEEL-FND", "name_ar": "حداد - قواعد مسلحة", "name_en": "Steel Fixer - Foundations", "unit": "م³/يوم", "rate": 3, "type": "LABOR"},
        {"code": "LAB-STEEL-SLAB", "name_ar": "حداد - لبشة", "name_en": "Steel Fixer - Slab", "unit": "م³/يوم", "rate": 5, "type": "LABOR"},
        {"code": "LAB-STEEL-COL", "name_ar": "حداد - أعمدة", "name_en": "Steel Fixer - Columns", "unit": "م³/يوم", "rate": 2.5, "type": "LABOR"},
        {"code": "LAB-MASON-BRICK", "name_ar": "بناء - طوب", "name_en": "Mason - Brickwork", "unit": "م³/يوم", "rate": 4, "type": "LABOR"},
        {"code": "LAB-PLASTER-SPRAY", "name_ar": "مبيض - طرطشة", "name_en": "Plasterer - Spray", "unit": "م²/يوم", "rate": 200, "type": "LABOR"},
        {"code": "LAB-PLASTER-DOTS", "name_ar": "مبيض - بؤج", "name_en": "Plasterer - Dots", "unit": "م²/يوم", "rate": 150, "type": "LABOR"},
        {"code": "LAB-PLASTER-INT", "name_ar": "مبيض - ملو داخلي", "name_en": "Plasterer - Interior", "unit": "م²/يوم", "rate": 40, "type": "LABOR"},
        {"code": "LAB-PLASTER-CEIL", "name_ar": "مبيض - ملو أسقف", "name_en": "Plasterer - Ceiling", "unit": "م²/يوم", "rate": 30, "type": "LABOR"},
        {"code": "LAB-PLASTER-EXT", "name_ar": "مبيض - ملو خارجي", "name_en": "Plasterer - Exterior", "unit": "م²/يوم", "rate": 25, "type": "LABOR"},
        {"code": "LAB-PAINT-PUTTY", "name_ar": "نقاش - معجون وصنفرة", "name_en": "Painter - Putty & Sanding", "unit": "م²/يوم", "rate": 60, "type": "LABOR"},
        {"code": "LAB-PAINT-PLASTIC", "name_ar": "نقاش - دهان بلاستيك", "name_en": "Painter - Plastic Paint", "unit": "م²/يوم", "rate": 200, "type": "LABOR"},
        {"code": "LAB-TILE-FLOOR", "name_ar": "مبلط - أرضيات سيراميك", "name_en": "Tiler - Floor Ceramic", "unit": "م²/يوم", "rate": 25, "type": "LABOR"},
        {"code": "LAB-TILE-WALL", "name_ar": "مبلط - حوائط سيراميك", "name_en": "Tiler - Wall Ceramic", "unit": "م²/يوم", "rate": 15, "type": "LABOR"},
        {"code": "LAB-MARBLE-FLOOR", "name_ar": "مرخماتي - أرضيات", "name_en": "Marble Worker - Floor", "unit": "م²/يوم", "rate": 15, "type": "LABOR"},
        {"code": "LAB-MARBLE-STAIR", "name_ar": "مرخماتي - درج سلم", "name_en": "Marble Worker - Stairs", "unit": "م.ط/يوم", "rate": 12, "type": "LABOR"},
        {"code": "LAB-WP-BITUMEN", "name_ar": "صنايعي - عزل بيتومين", "name_en": "Waterproofing - Bitumen", "unit": "م²/يوم", "rate": 100, "type": "LABOR"},
    ]

    return labor_data

def extract_material_rates():
    """Extract material consumption rates from Sheet 18"""
    materials = [
        # Concrete materials
        {"code": "MAT-CONC-PLAIN", "name_ar": "خرسانة عادية", "name_en": "Plain Concrete", "unit": "م³", "rate": 750, "type": "MATERIAL", "components": "0.8م³ زلط + 0.4م³ رمل + 250كجم أسمنت"},
        {"code": "MAT-CONC-REINF", "name_ar": "خرسانة مسلحة", "name_en": "Reinforced Concrete", "unit": "م³", "rate": 950, "type": "MATERIAL", "components": "0.8م³ زلط + 0.4م³ رمل + 350كجم أسمنت"},
        {"code": "MAT-STEEL-FND", "name_ar": "حديد تسليح قواعد", "name_en": "Steel Rebar - Foundations", "unit": "كجم", "rate": 28, "type": "MATERIAL", "waste_factor": 1.05},
        {"code": "MAT-STEEL-COL", "name_ar": "حديد تسليح أعمدة", "name_en": "Steel Rebar - Columns", "unit": "كجم", "rate": 28, "type": "MATERIAL", "waste_factor": 1.03},
        {"code": "MAT-STEEL-SLAB", "name_ar": "حديد تسليح أسقف", "name_en": "Steel Rebar - Slabs", "unit": "كجم", "rate": 28, "type": "MATERIAL", "waste_factor": 1.03},
        {"code": "MAT-CEMENT", "name_ar": "أسمنت رمادي", "name_en": "Grey Cement", "unit": "طن", "rate": 2500, "type": "MATERIAL"},
        {"code": "MAT-SAND", "name_ar": "رمل", "name_en": "Sand", "unit": "م³", "rate": 180, "type": "MATERIAL"},
        {"code": "MAT-GRAVEL", "name_ar": "زلط", "name_en": "Gravel", "unit": "م³", "rate": 220, "type": "MATERIAL"},
        # Masonry materials
        {"code": "MAT-BRICK-SINGLE", "name_ar": "طوب فرداني", "name_en": "Single Brick", "unit": "1000 طوبة", "rate": 1800, "type": "MATERIAL"},
        {"code": "MAT-BRICK-DOUBLE", "name_ar": "طوب دبل", "name_en": "Double Brick", "unit": "1000 طوبة", "rate": 3200, "type": "MATERIAL"},
        # Finishing materials
        {"code": "MAT-PLASTER-MORTAR", "name_ar": "مونة بياض", "name_en": "Plaster Mortar", "unit": "م³", "rate": 850, "type": "MATERIAL", "components": "1م³ رمل + 350كجم أسمنت"},
        {"code": "MAT-PUTTY", "name_ar": "معجون", "name_en": "Putty", "unit": "كجم", "rate": 25, "type": "MATERIAL"},
        {"code": "MAT-SEALER", "name_ar": "سيلار", "name_en": "Sealer", "unit": "لتر", "rate": 45, "type": "MATERIAL"},
        {"code": "MAT-PAINT-PLASTIC", "name_ar": "دهان بلاستيك", "name_en": "Plastic Paint", "unit": "لتر", "rate": 85, "type": "MATERIAL"},
        {"code": "MAT-CERAMIC-FLOOR", "name_ar": "سيراميك أرضيات", "name_en": "Floor Ceramic", "unit": "م²", "rate": 120, "type": "MATERIAL"},
        {"code": "MAT-CERAMIC-WALL", "name_ar": "سيراميك حوائط", "name_en": "Wall Ceramic", "unit": "م²", "rate": 100, "type": "MATERIAL"},
        {"code": "MAT-MARBLE", "name_ar": "رخام", "name_en": "Marble", "unit": "م²", "rate": 450, "type": "MATERIAL"},
        {"code": "MAT-GRANITE", "name_ar": "جرانيت", "name_en": "Granite", "unit": "م²", "rate": 550, "type": "MATERIAL"},
        # Waterproofing materials
        {"code": "MAT-BITUMEN", "name_ar": "بيتومين", "name_en": "Bitumen", "unit": "لتر", "rate": 35, "type": "MATERIAL"},
        {"code": "MAT-MEMBRANE", "name_ar": "ممبرين", "name_en": "Membrane", "unit": "م²", "rate": 75, "type": "MATERIAL", "waste_factor": 1.10},
    ]
    return materials

def extract_equipment_rates():
    """Equipment rates"""
    equipment = [
        {"code": "EQP-MIXER", "name_ar": "خلاطة خرسانة", "name_en": "Concrete Mixer", "unit": "يوم", "rate": 500, "type": "EQUIPMENT"},
        {"code": "EQP-VIBRATOR", "name_ar": "هزاز خرسانة", "name_en": "Concrete Vibrator", "unit": "يوم", "rate": 200, "type": "EQUIPMENT"},
        {"code": "EQP-PUMP", "name_ar": "مضخة خرسانة", "name_en": "Concrete Pump", "unit": "يوم", "rate": 3500, "type": "EQUIPMENT"},
        {"code": "EQP-CRANE", "name_ar": "رافعة", "name_en": "Crane", "unit": "يوم", "rate": 5000, "type": "EQUIPMENT"},
        {"code": "EQP-SCAFFOLDING", "name_ar": "سقالات", "name_en": "Scaffolding", "unit": "م²/شهر", "rate": 25, "type": "EQUIPMENT"},
        {"code": "EQP-EXCAVATOR", "name_ar": "حفار", "name_en": "Excavator", "unit": "يوم", "rate": 4500, "type": "EQUIPMENT"},
        {"code": "EQP-LOADER", "name_ar": "لودر", "name_en": "Loader", "unit": "يوم", "rate": 3000, "type": "EQUIPMENT"},
        {"code": "EQP-TRUCK", "name_ar": "سيارة نقل", "name_en": "Truck", "unit": "رحلة", "rate": 350, "type": "EQUIPMENT"},
        {"code": "EQP-COMPACTOR", "name_ar": "هراس", "name_en": "Compactor", "unit": "يوم", "rate": 2500, "type": "EQUIPMENT"},
    ]
    return equipment

def extract_boq_templates():
    """Extract BOQ templates based on Excel sheets 20-52"""
    templates = [
        # Excavation
        {
            "code": "EXC-01",
            "name_ar": "حفر في جميع أنواع التربة",
            "name_en": "Excavation in All Soil Types",
            "unit": "م³",
            "category": "excavation",
            "materials": [],
            "labor": [{"rateCode": "LAB-HELPER", "qty": 0.5, "description": "عامل حفر"}],
            "equipment": [{"rateCode": "EQP-EXCAVATOR", "qty": 0.02, "description": "حفار"}],
        },
        {
            "code": "EXC-02",
            "name_ar": "ردم بالرمل",
            "name_en": "Sand Backfill",
            "unit": "م³",
            "category": "excavation",
            "materials": [{"rateCode": "MAT-SAND", "qty": 1.25, "description": "رمل ردم"}],
            "labor": [{"rateCode": "LAB-HELPER", "qty": 0.3, "description": "عامل"}],
            "equipment": [{"rateCode": "EQP-COMPACTOR", "qty": 0.01, "description": "هراس"}],
        },
        # Plain Concrete
        {
            "code": "CON-PC-01",
            "name_ar": "خرسانة عادية للقواعد",
            "name_en": "Plain Concrete for Foundations",
            "unit": "م³",
            "category": "concrete",
            "materials": [
                {"rateCode": "MAT-CONC-PLAIN", "qty": 1.05, "description": "خرسانة عادية"},
            ],
            "labor": [
                {"rateCode": "LAB-CARP-FND", "qty": 0.1, "description": "نجار"},
                {"rateCode": "LAB-HELPER", "qty": 0.2, "description": "مساعد"},
            ],
            "equipment": [{"rateCode": "EQP-MIXER", "qty": 0.05, "description": "خلاطة"}],
        },
        # Reinforced Concrete Foundations
        {
            "code": "CON-RC-FND",
            "name_ar": "خرسانة مسلحة للقواعد والسملات",
            "name_en": "Reinforced Concrete for Foundations",
            "unit": "م³",
            "category": "concrete",
            "materials": [
                {"rateCode": "MAT-CONC-REINF", "qty": 1.05, "description": "خرسانة مسلحة"},
                {"rateCode": "MAT-STEEL-FND", "qty": 90, "description": "حديد تسليح (90 كجم/م³)"},
            ],
            "labor": [
                {"rateCode": "LAB-CARP-RFND", "qty": 0.33, "description": "نجار مسلح"},
                {"rateCode": "LAB-STEEL-FND", "qty": 0.33, "description": "حداد"},
                {"rateCode": "LAB-HELPER", "qty": 0.5, "description": "مساعد"},
            ],
            "equipment": [
                {"rateCode": "EQP-MIXER", "qty": 0.05, "description": "خلاطة"},
                {"rateCode": "EQP-VIBRATOR", "qty": 0.05, "description": "هزاز"},
            ],
        },
        # Reinforced Concrete Columns
        {
            "code": "CON-RC-COL",
            "name_ar": "خرسانة مسلحة للأعمدة",
            "name_en": "Reinforced Concrete for Columns",
            "unit": "م³",
            "category": "concrete",
            "materials": [
                {"rateCode": "MAT-CONC-REINF", "qty": 1.05, "description": "خرسانة مسلحة"},
                {"rateCode": "MAT-STEEL-COL", "qty": 130, "description": "حديد تسليح (130 كجم/م³)"},
            ],
            "labor": [
                {"rateCode": "LAB-CARP-COL", "qty": 0.67, "description": "نجار مسلح"},
                {"rateCode": "LAB-STEEL-COL", "qty": 0.4, "description": "حداد"},
                {"rateCode": "LAB-HELPER", "qty": 0.5, "description": "مساعد"},
            ],
            "equipment": [
                {"rateCode": "EQP-MIXER", "qty": 0.05, "description": "خلاطة"},
                {"rateCode": "EQP-VIBRATOR", "qty": 0.1, "description": "هزاز"},
            ],
        },
        # Reinforced Concrete Slabs
        {
            "code": "CON-RC-SLAB",
            "name_ar": "خرسانة مسلحة للأسقف",
            "name_en": "Reinforced Concrete for Slabs",
            "unit": "م³",
            "category": "concrete",
            "materials": [
                {"rateCode": "MAT-CONC-REINF", "qty": 1.05, "description": "خرسانة مسلحة"},
                {"rateCode": "MAT-STEEL-SLAB", "qty": 85, "description": "حديد تسليح (85 كجم/م³)"},
            ],
            "labor": [
                {"rateCode": "LAB-CARP-SOLID", "qty": 0.33, "description": "نجار مسلح"},
                {"rateCode": "LAB-STEEL-SLAB", "qty": 0.33, "description": "حداد"},
                {"rateCode": "LAB-HELPER", "qty": 0.5, "description": "مساعد"},
            ],
            "equipment": [
                {"rateCode": "EQP-PUMP", "qty": 0.02, "description": "مضخة"},
                {"rateCode": "EQP-VIBRATOR", "qty": 0.1, "description": "هزاز"},
            ],
        },
        # Masonry - Brick Wall
        {
            "code": "MAS-BRICK-25",
            "name_ar": "مباني طوب سمك 25 سم",
            "name_en": "Brick Wall 25cm Thick",
            "unit": "م³",
            "category": "masonry",
            "materials": [
                {"rateCode": "MAT-BRICK-SINGLE", "qty": 0.44, "description": "طوب (440 طوبة)"},
                {"rateCode": "MAT-CEMENT", "qty": 0.06, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.2, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-MASON-BRICK", "qty": 0.25, "description": "بناء"},
                {"rateCode": "LAB-HELPER", "qty": 0.25, "description": "مساعد"},
            ],
            "equipment": [],
        },
        {
            "code": "MAS-BRICK-12",
            "name_ar": "مباني طوب سمك 12 سم",
            "name_en": "Brick Wall 12cm Thick",
            "unit": "م²",
            "category": "masonry",
            "materials": [
                {"rateCode": "MAT-BRICK-SINGLE", "qty": 0.055, "description": "طوب (55 طوبة)"},
                {"rateCode": "MAT-CEMENT", "qty": 0.006, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.02, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-MASON-BRICK", "qty": 0.037, "description": "بناء"},
                {"rateCode": "LAB-HELPER", "qty": 0.037, "description": "مساعد"},
            ],
            "equipment": [],
        },
        # Plastering
        {
            "code": "PLT-INT",
            "name_ar": "بياض محارة داخلي",
            "name_en": "Interior Plastering",
            "unit": "م²",
            "category": "finishing",
            "materials": [
                {"rateCode": "MAT-CEMENT", "qty": 0.012, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.03, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-PLASTER-SPRAY", "qty": 0.005, "description": "طرطشة"},
                {"rateCode": "LAB-PLASTER-DOTS", "qty": 0.007, "description": "بؤج"},
                {"rateCode": "LAB-PLASTER-INT", "qty": 0.025, "description": "ملو"},
            ],
            "equipment": [],
        },
        # Painting
        {
            "code": "PAINT-PLASTIC",
            "name_ar": "دهان بلاستيك (3 أوجه)",
            "name_en": "Plastic Paint (3 coats)",
            "unit": "م²",
            "category": "finishing",
            "materials": [
                {"rateCode": "MAT-PUTTY", "qty": 0.3, "description": "معجون"},
                {"rateCode": "MAT-SEALER", "qty": 0.1, "description": "سيلار"},
                {"rateCode": "MAT-PAINT-PLASTIC", "qty": 0.35, "description": "دهان بلاستيك"},
            ],
            "labor": [
                {"rateCode": "LAB-PAINT-PUTTY", "qty": 0.017, "description": "معجون وصنفرة"},
                {"rateCode": "LAB-PAINT-PLASTIC", "qty": 0.015, "description": "دهان"},
            ],
            "equipment": [],
        },
        # Floor Ceramic
        {
            "code": "TILE-FLOOR",
            "name_ar": "سيراميك أرضيات",
            "name_en": "Floor Ceramic Tiles",
            "unit": "م²",
            "category": "finishing",
            "materials": [
                {"rateCode": "MAT-CERAMIC-FLOOR", "qty": 1.05, "description": "سيراميك"},
                {"rateCode": "MAT-CEMENT", "qty": 0.012, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.1, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-TILE-FLOOR", "qty": 0.04, "description": "مبلط"},
                {"rateCode": "LAB-HELPER", "qty": 0.04, "description": "مساعد"},
            ],
            "equipment": [],
        },
        # Wall Ceramic
        {
            "code": "TILE-WALL",
            "name_ar": "سيراميك حوائط",
            "name_en": "Wall Ceramic Tiles",
            "unit": "م²",
            "category": "finishing",
            "materials": [
                {"rateCode": "MAT-CERAMIC-WALL", "qty": 1.05, "description": "سيراميك"},
                {"rateCode": "MAT-CEMENT", "qty": 0.015, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.03, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-TILE-WALL", "qty": 0.067, "description": "مبلط"},
                {"rateCode": "LAB-HELPER", "qty": 0.067, "description": "مساعد"},
            ],
            "equipment": [],
        },
        # Marble Floor
        {
            "code": "MARBLE-FLOOR",
            "name_ar": "رخام أرضيات",
            "name_en": "Floor Marble",
            "unit": "م²",
            "category": "finishing",
            "materials": [
                {"rateCode": "MAT-MARBLE", "qty": 1.05, "description": "رخام"},
                {"rateCode": "MAT-CEMENT", "qty": 0.015, "description": "أسمنت"},
                {"rateCode": "MAT-SAND", "qty": 0.1, "description": "رمل"},
            ],
            "labor": [
                {"rateCode": "LAB-MARBLE-FLOOR", "qty": 0.067, "description": "مرخماتي"},
                {"rateCode": "LAB-HELPER", "qty": 0.067, "description": "مساعد"},
            ],
            "equipment": [],
        },
        # Waterproofing - Bitumen
        {
            "code": "WP-BITUMEN",
            "name_ar": "عزل بيتومين (وجهين)",
            "name_en": "Bitumen Waterproofing (2 coats)",
            "unit": "م²",
            "category": "waterproofing",
            "materials": [
                {"rateCode": "MAT-BITUMEN", "qty": 2.0, "description": "بيتومين"},
            ],
            "labor": [
                {"rateCode": "LAB-WP-BITUMEN", "qty": 0.01, "description": "صنايعي عزل"},
            ],
            "equipment": [],
        },
        # Waterproofing - Membrane
        {
            "code": "WP-MEMBRANE",
            "name_ar": "عزل ممبرين",
            "name_en": "Membrane Waterproofing",
            "unit": "م²",
            "category": "waterproofing",
            "materials": [
                {"rateCode": "MAT-MEMBRANE", "qty": 1.1, "description": "ممبرين"},
                {"rateCode": "MAT-BITUMEN", "qty": 0.5, "description": "بيتومين تحضير"},
            ],
            "labor": [
                {"rateCode": "LAB-WP-BITUMEN", "qty": 0.02, "description": "صنايعي عزل"},
            ],
            "equipment": [],
        },
    ]
    return templates

def extract_indirect_costs():
    """Extract indirect cost configuration"""
    indirect_costs = [
        {"code": "IND-SITE", "name_ar": "مصاريف الموقع", "name_en": "Site Overhead", "percentage": 0.08, "applies_to": ["ALL"]},
        {"code": "IND-HEAD", "name_ar": "مصاريف إدارية", "name_en": "Head Office Overhead", "percentage": 0.05, "applies_to": ["ALL"]},
        {"code": "IND-INS", "name_ar": "التأمينات", "name_en": "Insurance", "percentage": 0.02, "applies_to": ["ALL"]},
        {"code": "IND-TAX", "name_ar": "ضرائب", "name_en": "Taxes", "percentage": 0.05, "applies_to": ["ALL"]},
        {"code": "IND-CONT", "name_ar": "احتياطي", "name_en": "Contingency", "percentage": 0.05, "applies_to": ["ALL"]},
    ]
    return indirect_costs

def main():
    print("Extracting data from Excel files...")

    # Combine all rates
    all_rates = []
    all_rates.extend(extract_labor_rates())
    all_rates.extend(extract_material_rates())
    all_rates.extend(extract_equipment_rates())

    # Get BOQ templates
    boq_templates = extract_boq_templates()

    # Get indirect costs
    indirect_costs = extract_indirect_costs()

    # Generate JSON output
    output = {
        "rates": all_rates,
        "boq_templates": boq_templates,
        "indirect_costs": indirect_costs,
        "generated_at": datetime.now().isoformat(),
    }

    # Save to JSON file
    output_path = "/Users/walidelhelw/AI/Future/future-cost-control/scripts/seed-data.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Extracted {len(all_rates)} rates")
    print(f"✓ Extracted {len(boq_templates)} BOQ templates")
    print(f"✓ Extracted {len(indirect_costs)} indirect cost configs")
    print(f"\n✓ Saved to: {output_path}")

    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Labor rates: {len([r for r in all_rates if r['type'] == 'LABOR'])}")
    print(f"Material rates: {len([r for r in all_rates if r['type'] == 'MATERIAL'])}")
    print(f"Equipment rates: {len([r for r in all_rates if r['type'] == 'EQUIPMENT'])}")
    print(f"BOQ Templates: {len(boq_templates)}")

if __name__ == "__main__":
    main()
