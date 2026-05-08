import { Type, type FunctionDeclaration } from "@google/genai";

import type { AssistantToolName } from "../limits";

const limitProperty = {
  type: Type.INTEGER,
  description: "Maximum rows to return. The server clamps this to a small safe limit.",
  minimum: 1,
  maximum: 10,
};

const projectIdProperty = {
  type: Type.STRING,
  description: "Authorized project UUID. Omit only when asking for a bounded portfolio summary.",
};

export const assistantToolDeclarations: FunctionDeclaration[] = [
  {
    name: "getProjects",
    description: "List a small authorized project summary.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          enum: ["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
        },
        limit: limitProperty,
      },
    },
  },
  {
    name: "getEstimates",
    description: "List a small authorized estimate summary.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectId: projectIdProperty,
        status: {
          type: Type.STRING,
          enum: ["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "SUPERSEDED"],
        },
        limit: limitProperty,
      },
    },
  },
  {
    name: "getSuppliers",
    description: "List a small supplier summary with latest score.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        query: { type: Type.STRING },
        limit: limitProperty,
      },
    },
  },
  {
    name: "getRates",
    description: "Search a small active rate summary by Arabic name and optional rate type.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING },
        type: {
          type: Type.STRING,
          enum: ["MATERIAL", "LABOR", "EQUIPMENT", "SUBCONTRACTOR"],
        },
        limit: limitProperty,
      },
    },
  },
  {
    name: "getRisks",
    description: "List top authorized project risks by EMV.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectId: projectIdProperty,
        minimumEmv: { type: Type.NUMBER, minimum: 0, maximum: 1 },
        limit: limitProperty,
      },
    },
  },
  {
    name: "getCashflow",
    description: "List a small authorized cashflow period summary.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectId: projectIdProperty,
        limit: limitProperty,
      },
    },
  },
  {
    name: "searchSemantic",
    description: "Search the authorized V2 semantic index by bounded keyword fallback.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING },
        limit: limitProperty,
      },
      required: ["query"],
    },
  },
  {
    name: "getVariances",
    description: "List a small authorized project variance summary.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectId: projectIdProperty,
        limit: limitProperty,
      },
    },
  },
];

export const assistantToolNames = assistantToolDeclarations
  .map((tool) => tool.name)
  .filter((name): name is AssistantToolName => typeof name === "string");
