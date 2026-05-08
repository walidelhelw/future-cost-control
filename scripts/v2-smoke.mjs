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
    const response = await assertOk("/en/v2");
    const html = await response.text();
    if (!html.includes("Future")) {
      throw new Error("/en/v2 did not render the V2 command center copy");
    }
    console.log("PASS /en/v2");
  },
  async () => {
    const response = await assertOk("/api/v2/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale: "ar",
        message: "ما هي المشاريع الأعلى مخاطرة؟",
        smoke: true,
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
