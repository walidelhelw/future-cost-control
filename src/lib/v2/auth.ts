import "server-only";

import type { User } from "@supabase/supabase-js";

import type { ProfileRow } from "./database.types";
import { createV2ServerClient } from "./supabase/server";
import type { createV2ServiceClient } from "./supabase/service";

export type V2Permission =
  | "assistant:read"
  | "projects:read"
  | "estimates:read"
  | "suppliers:read"
  | "rates:read"
  | "risks:read"
  | "cashflow:read"
  | "variances:read"
  | "semantic:read";

export type V2SupabaseClient = ReturnType<typeof createV2ServerClient>;
export type V2ServiceClient = NonNullable<ReturnType<typeof createV2ServiceClient>>;

export type V2AuthContext = {
  user: User;
  profile: ProfileRow | null;
  organizationId: string | null;
  role: string;
  projectIds: readonly string[];
  permissions: ReadonlySet<V2Permission>;
  rbacReady: boolean;
};

export class V2AuthError extends Error {
  constructor(
    message: string,
    readonly status: 401 | 403,
    readonly code: "auth_required" | "forbidden",
  ) {
    super(message);
    this.name = "V2AuthError";
  }
}

const READ_PERMISSIONS: readonly V2Permission[] = [
  "assistant:read",
  "projects:read",
  "estimates:read",
  "suppliers:read",
  "rates:read",
  "risks:read",
  "cashflow:read",
  "variances:read",
  "semantic:read",
];

const ROLE_DEFAULTS: Record<string, readonly V2Permission[]> = {
  admin: READ_PERMISSIONS,
  executive: READ_PERMISSIONS,
  pm: READ_PERMISSIONS,
  estimator: ["assistant:read", "projects:read", "estimates:read", "rates:read"],
  viewer: READ_PERMISSIONS,
};

type MaybePostgrestError = {
  code?: string;
  message?: string;
};

function isMissingRelation(error: MaybePostgrestError | null): boolean {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || /does not exist/i.test(error.message ?? "");
}

function toPermission(value: string): V2Permission | null {
  return READ_PERMISSIONS.includes(value as V2Permission)
    ? (value as V2Permission)
    : null;
}

export async function getV2AuthContext(
  supabase: V2SupabaseClient = createV2ServerClient(),
): Promise<V2AuthContext> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new V2AuthError("Authentication required", 401, "auth_required");
  }

  const user = data.user;
  const profileResult = await supabase
    .from("profiles")
    .select("id, org_id, email, full_name, role, status, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileResult.error && !isMissingRelation(profileResult.error)) {
    throw new V2AuthError("Unable to load V2 profile", 403, "forbidden");
  }

  const profile = profileResult.error ? null : profileResult.data;
  const role = profile?.role ?? "viewer";

  const membershipsResult = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id);

  if (membershipsResult.error && !isMissingRelation(membershipsResult.error)) {
    throw new V2AuthError("Unable to load V2 project membership", 403, "forbidden");
  }

  const projectIds = membershipsResult.error
    ? []
    : (membershipsResult.data ?? []).map((row) => row.project_id);

  const permissionsResult = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("role", role);

  if (permissionsResult.error && !isMissingRelation(permissionsResult.error)) {
    throw new V2AuthError("Unable to load V2 role permissions", 403, "forbidden");
  }

  const explicitPermissions = permissionsResult.error
    ? []
    : (permissionsResult.data ?? [])
        .map((row) => toPermission(row.permission))
        .filter((permission): permission is V2Permission => permission !== null);

  const defaults = ROLE_DEFAULTS[role] ?? ROLE_DEFAULTS.viewer;
  const permissions = new Set<V2Permission>([...defaults, ...explicitPermissions]);

  return {
    user,
    profile,
    organizationId: profile?.org_id ?? null,
    role,
    projectIds,
    permissions,
    rbacReady: Boolean(profile && !membershipsResult.error && !permissionsResult.error),
  };
}

export function requireV2Permission(
  context: V2AuthContext,
  permission: V2Permission,
): void {
  if (!context.permissions.has(permission)) {
    throw new V2AuthError("Insufficient V2 permissions", 403, "forbidden");
  }
}

export function canAccessProject(context: V2AuthContext, projectId: string): boolean {
  if (context.role === "admin" || context.role === "executive") {
    return true;
  }

  if (!context.rbacReady) {
    return true;
  }

  return context.projectIds.includes(projectId);
}
