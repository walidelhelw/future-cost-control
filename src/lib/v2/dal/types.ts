import "server-only";

import { canAccessProject, requireV2Permission } from "../auth";
import type { V2AuthContext, V2Permission, V2SupabaseClient } from "../auth";

export type DalContext = {
  supabase: V2SupabaseClient;
  auth: V2AuthContext;
};

export type SourceCitation = {
  table: string;
  id: string;
  label: string;
};

export type AssistantDataResult<T> = {
  data: T;
  citations: SourceCitation[];
};

export function assertDalRead(
  context: DalContext,
  permission: V2Permission,
): void {
  requireV2Permission(context.auth, permission);
}

export function assertProjectAccess(context: DalContext, projectId: string): void {
  if (!canAccessProject(context.auth, projectId)) {
    throw new Error("Project is outside the authenticated V2 scope");
  }
}

export function assertNoDalError(
  error: { message: string } | null,
  label: string,
): void {
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}
