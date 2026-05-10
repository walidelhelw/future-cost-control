const baseUrl = process.env.V2_SMOKE_BASE_URL ?? "http://localhost:3000";

async function assertOk(path, init) {
  const response = await fetch(new URL(path, baseUrl), init);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response;
}

const checks = [
  async () => {
    for (const path of ["/ar/v2", "/en/v2"]) {
      const response = await assertOk(path);
      const html = await response.text();
      if (!html.includes("Future") && !html.includes("المستقبل")) {
        throw new Error(`${path} did not render the V2 command center copy`);
      }
      console.log(`PASS ${path}`);
    }
  },
  async () => {
    const response = await assertOk("/ar/v2");
    const html = await response.text();
    if (html.includes("اختيار الصفحة") || html.includes("حاسبة ذكية لتكاليف")) {
      throw new Error("/ar/v2 rendered the V1 shell or V1 homepage copy");
    }
    console.log("PASS /ar/v2 isolation");
  },
  async () => {
    const estimateChecks = [
      { path: "/ar/v2/estimate", expected: ["ارفع مناقصة", "وظيفة تقدير فعلية"] },
      { path: "/en/v2/estimate", expected: ["Upload a tender", "Functional estimate job"] },
    ];

    for (const check of estimateChecks) {
      const response = await assertOk(check.path);
      const html = await response.text();
      if (!check.expected.some((copy) => html.includes(copy))) {
        throw new Error(`${check.path} did not render the functional Smart Estimate copy`);
      }
      console.log(`PASS ${check.path}`);
    }
  },
  async () => {
    const operationalPaths = [
      ["/ar/v2/cost", "مسار تشغيل فعلي"],
      ["/ar/v2/field", "مسار تشغيل فعلي"],
      ["/ar/v2/flow", "مسار تشغيل فعلي"],
      ["/ar/v2/change", "مسار تشغيل فعلي"],
      ["/ar/v2/rfq", "مسار تشغيل فعلي"],
      ["/ar/v2/ask", "مسار تشغيل فعلي"],
      ["/ar/v2/admin", "مسار تشغيل فعلي"],
      ["/en/v2/cost", "Functional workflow"],
      ["/en/v2/field", "Functional workflow"],
      ["/en/v2/flow", "Functional workflow"],
      ["/en/v2/change", "Functional workflow"],
      ["/en/v2/rfq", "Functional workflow"],
      ["/en/v2/ask", "Functional workflow"],
      ["/en/v2/admin", "Functional workflow"],
    ];

    for (const [path, expected] of operationalPaths) {
      const response = await assertOk(path);
      const html = await response.text();
      if (!html.includes(expected)) {
        throw new Error(`${path} did not render the functional workflow shell`);
      }
      console.log(`PASS ${path}`);
    }
  },
  async () => {
    const response = await assertOk("/en/v2/ask");
    const html = await response.text();
    if (!html.includes("Which projects are over budget?") || html.includes("كم تكلفة المشاريع")) {
      throw new Error("/en/v2/ask did not render localized executive prompts");
    }
    console.log("PASS /en/v2/ask localization");
  },
  async () => {
    const parityPaths = [
      "/ar/v2/rates",
      "/ar/v2/productivity",
      "/ar/v2/projects",
      "/ar/v2/estimates",
      "/ar/v2/suppliers",
      "/ar/v2/boq",
      "/ar/v2/risks",
      "/ar/v2/cashflow",
      "/en/v2/rates",
      "/en/v2/productivity",
      "/en/v2/projects",
      "/en/v2/estimates",
      "/en/v2/suppliers",
      "/en/v2/boq",
      "/en/v2/risks",
      "/en/v2/cashflow",
    ];

    for (const path of parityPaths) {
      const response = await assertOk(path);
      const html = await response.text();
      if (!html.includes("مسار V2 كامل") && !html.includes("Full V2 path")) {
        throw new Error(`${path} did not render the native V2 parity shell`);
      }
      console.log(`PASS ${path}`);
    }
  },
  async () => {
    const assistantChecks = [
      { locale: "ar", message: "أفضل مورد للحديد؟", expected: /المصدر:.*Supplier Score|Source:.*Supplier Score/ },
      { locale: "ar", message: "ما سعر الحديد الحالي؟", expected: /المصدر:.*Rates|Source:.*Rates/ },
      { locale: "ar", message: "ما فجوة التدفق النقدي؟", expected: /المصدر:.*Cashflow|Source:.*Cashflow/ },
      { locale: "ar", message: "ما حالة المشاريع؟", expected: /المصدر:.*Projects|Source:.*Projects/ },
      { locale: "ar", message: "ما تقدير المناقصة؟", expected: /المصدر:.*Smart Estimate|Source:.*Smart Estimate/ },
      { locale: "ar", message: "ما أكبر فرق تكلفة؟", expected: /المصدر:.*Variance|Source:.*Variance/ },
      { locale: "ar", message: "ما الموافقات التي ستكسر SLA؟", expected: /المصدر:.*Approval|Source:.*Approval/ },
      { locale: "ar", message: "ما أفضل RFQ؟", expected: /المصدر:.*RFQ|Source:.*RFQ/ },
      { locale: "ar", message: "اعرض أوامر التغيير", expected: /المصدر:.*Change Order|Source:.*Change Order/ },
      { locale: "en", message: "Current rebar rate?", expected: /Source:.*Rates/ },
      { locale: "en", message: "What is the cashflow gap?", expected: /Source:.*Cashflow/ },
      { locale: "en", message: "Best RFQ award?", expected: /Source:.*RFQ/ },
      { locale: "en", message: "Show open change orders", expected: /Source:.*Change Order/ },
    ];

    for (const check of assistantChecks) {
      const response = await assertOk("/api/v2/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: check.locale,
          message: check.message,
        }),
      });
      const body = await response.text();
      if (!body.trim()) {
        throw new Error(`assistant smoke response was empty for "${check.message}"`);
      }
      if (!check.expected.test(body)) {
        throw new Error(`assistant answer for "${check.message}" did not include expected V2 source context: ${body}`);
      }
    }
    console.log("PASS /api/v2/assistant coverage");
  },
];

for (const check of checks) {
  await check();
}
