import assert from "node:assert/strict";
import test from "node:test";

import {
  ASSISTANT_MAX_LIMIT,
  clampAssistantLimit,
  isAllowedAssistantTool,
  normalizeAssistantQuery,
} from "./limits";

test("clampAssistantLimit keeps assistant reads small and deterministic", () => {
  assert.equal(clampAssistantLimit(undefined, 5), 5);
  assert.equal(clampAssistantLimit(0, 5), 1);
  assert.equal(clampAssistantLimit(999, 5), ASSISTANT_MAX_LIMIT);
});

test("normalizeAssistantQuery trims unsafe noise without expanding access", () => {
  assert.equal(normalizeAssistantQuery("  steel%,_ rebar  "), "steel rebar");
  assert.equal(normalizeAssistantQuery("x".repeat(200)).length, 80);
});

test("isAllowedAssistantTool only allows the typed V2 assistant surface", () => {
  assert.equal(isAllowedAssistantTool("getProjects"), true);
  assert.equal(isAllowedAssistantTool("rawSql"), false);
});
