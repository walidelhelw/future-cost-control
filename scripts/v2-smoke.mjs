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
    const response = await assertOk("/ar/v2");
    const html = await response.text();
    if (!html.includes("Future") && !html.includes("المستقبل")) {
      throw new Error("/ar/v2 did not render the V2 command center copy");
    }
    console.log("PASS /ar/v2");
  },
  async () => {
    const response = await assertOk("/ar/v2/estimate");
    const html = await response.text();
    if (!html.includes("ارفع مناقصة") && !html.includes("وظيفة تقدير فعلية")) {
      throw new Error("/ar/v2/estimate did not render the functional Smart Estimate copy");
    }
    console.log("PASS /ar/v2/estimate");
  },
  async () => {
    for (const path of ["/ar/v2/cost", "/ar/v2/field", "/ar/v2/flow", "/ar/v2/change", "/ar/v2/rfq", "/ar/v2/ask", "/ar/v2/admin"]) {
      const response = await assertOk(path);
      const html = await response.text();
      if (!html.includes("مسار تشغيل فعلي")) {
        throw new Error(`${path} did not render the functional workflow shell`);
      }
      console.log(`PASS ${path}`);
    }
  },
  async () => {
    const response = await assertOk("/api/v2/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale: "ar",
        message: "ما هي المشاريع الأعلى مخاطرة؟",
      }),
    });
    const body = await response.text();
    if (!body.trim()) {
      throw new Error("assistant smoke response was empty");
    }
    console.log("PASS /api/v2/assistant");
  },
];

for (const check of checks) {
  await check();
}
