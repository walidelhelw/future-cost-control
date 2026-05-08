import "server-only";

import type { Json } from "../database.types";
import type { DalContext } from "./types";

export type ChatMessageInsert = {
  role: "user" | "assistant";
  content: string;
  metadata?: Json;
};

export async function appendChatHistory(
  context: DalContext,
  messages: readonly ChatMessageInsert[],
): Promise<void> {
  if (messages.length === 0) {
    return;
  }

  const rows = messages.map((message) => ({
    user_id: context.auth.user.id,
    org_id: context.auth.organizationId,
    role: message.role,
    content: message.content,
    metadata: message.metadata ?? null,
  }));

  const { error } = await context.supabase.from("chat_history").insert(rows);

  if (error) {
    throw new Error(`Unable to append chat history: ${error.message}`);
  }
}
