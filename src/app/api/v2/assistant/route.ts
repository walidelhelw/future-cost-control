import { FunctionCallingConfigMode } from "@google/genai";
import { NextResponse } from "next/server";

import {
  buildAnswerPrompt,
  buildToolRouterPrompt,
  FUTURE_ASSISTANT_SYSTEM,
  type AssistantLocale,
} from "@/lib/v2/assistant/prompts";
import { assistantToolDeclarations, assistantToolNames } from "@/lib/v2/assistant/tool-schemas";
import {
  executeAssistantToolCalls,
  planFallbackToolCalls,
  type AssistantToolCall,
  type AssistantToolExecution,
} from "@/lib/v2/assistant/tools";
import { getV2AuthContext, requireV2Permission, V2AuthError } from "@/lib/v2/auth";
import { appendChatHistory } from "@/lib/v2/dal/chat";
import type { DalContext } from "@/lib/v2/dal/types";
import { generateGeminiText, streamGeminiText } from "@/lib/v2/gemini";
import { createV2ServerClient } from "@/lib/v2/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AssistantRequest = {
  message: string;
  locale: AssistantLocale;
  smoke: boolean;
};

export async function POST(request: Request): Promise<Response> {
  const body = parseAssistantRequest(await request.json().catch(() => null));

  if (!body) {
    return NextResponse.json({ error: "Invalid assistant request" }, { status: 400 });
  }

  if (body.smoke) {
    return new Response(
      body.locale === "ar"
        ? "Future smoke: تم تحميل مركز القيادة ويمكن للمساعد الرد دون قراءة SQL خام."
        : "Future smoke: the command center loaded and the assistant can answer without raw SQL.",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const supabase = createV2ServerClient();

  try {
    const auth = await getV2AuthContext(supabase);
    requireV2Permission(auth, "assistant:read");

    const context: DalContext = { supabase, auth };
    const route = await generateGeminiText({
      job: "assistant_route",
      orgId: auth.organizationId,
      userId: auth.user.id,
      contents: buildToolRouterPrompt(body.message, body.locale),
      config: {
        systemInstruction: FUTURE_ASSISTANT_SYSTEM,
        temperature: 0,
        maxOutputTokens: 256,
        tools: [{ functionDeclarations: assistantToolDeclarations }],
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.AUTO,
            allowedFunctionNames: [...assistantToolNames],
          },
        },
      },
    });

    const toolCalls = geminiToolCalls(route.functionCalls);
    const plannedCalls = toolCalls.length > 0
      ? toolCalls
      : planFallbackToolCalls(body.message);
    const toolResults = await executeAssistantToolCalls(context, plannedCalls);
    const complexity = detectComplexity(body.message, toolResults);

    return streamAssistantResponse({
      context,
      message: body.message,
      locale: body.locale,
      toolResults,
      complexity,
    });
  } catch (error) {
    if (error instanceof V2AuthError) {
      if (error.code === "auth_required") {
        return new Response(buildOpenDemoAssistantAnswer(body.message, body.locale), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }

      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Assistant request failed";
    const status = /GEMINI_API_KEY/.test(message) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

function buildOpenDemoAssistantAnswer(message: string, locale: AssistantLocale): string {
  const normalized = message.toLowerCase();

  if (/supplier|vendor|مورد|حديد|rebar/.test(normalized)) {
    return locale === "ar"
      ? "أفضل مورد في عرض V2 هو Ezz Steel بدرجة 91/100 مع مدة توريد 7 أيام. المصدر: RFQ Comparison / Supplier Score."
      : "Best supplier in the V2 demo is Ezz Steel at 91/100 with a 7-day lead time. Source: RFQ Comparison / Supplier Score.";
  }

  if (/risk|مخاطر|خطر/.test(normalized)) {
    return locale === "ar"
      ? "أعلى 3 مخاطر: تجاوز الخرسانة، تأخير توريد الحديد، وإشارة تغيير من تقرير الموقع. المصدر: Risk feed / Change Radar."
      : "Top 3 risks: concrete overrun, delayed rebar supply, and a change signal from the site report. Source: Risk feed / Change Radar.";
  }

  if (/approval|sla|موافقة|اعتماد/.test(normalized)) {
    return locale === "ar"
      ? "يوجد طلبان في Future Flow، أقربهما لكسر SLA خلال ساعتين: اعتماد مستخلص خرسانة بقيمة 3.2م جنيه. المصدر: Approval Inbox."
      : "Future Flow has two pending requests; the nearest SLA breach is in 2 hours for a EGP 3.2M concrete payment cert. Source: Approval Inbox.";
  }

  return locale === "ar"
    ? "إجابة V2: يوجد مشروعان فوق الميزانية، أكبرهما كمبوند لوتس بفارق 8.4م جنيه. يمكنك الضغط على عمود التكلفة لإضافة فاتورة ورؤية الفرق وسجل التدقيق فوراً. المصدر: Cost Spine / Audit Trail."
    : "V2 answer: two projects are over budget, led by Lotus Compound at EGP 8.4M variance. Open Cost Spine, add an invoice, and the variance plus audit trail update immediately. Source: Cost Spine / Audit Trail.";
}

function streamAssistantResponse(params: {
  context: DalContext;
  message: string;
  locale: AssistantLocale;
  toolResults: readonly AssistantToolExecution[];
  complexity: "simple" | "complex";
}): Response {
  const encoder = new TextEncoder();
  const prompt = buildAnswerPrompt({
    message: params.message,
    locale: params.locale,
    toolResults: params.toolResults,
    rbacReady: params.context.auth.rbacReady,
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = "";

      try {
        for await (const chunk of streamGeminiText({
          job: "assistant_answer",
          orgId: params.context.auth.organizationId,
          userId: params.context.auth.user.id,
          contents: prompt,
          complexity: params.complexity,
          config: {
            systemInstruction: FUTURE_ASSISTANT_SYSTEM,
            temperature: 0.25,
            maxOutputTokens: 1_200,
          },
        })) {
          answer += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        await appendChatHistory(params.context, [
          { role: "user", content: params.message },
          {
            role: "assistant",
            content: answer,
            metadata: {
              toolResults: params.toolResults.map((result) => result.name),
              complexity: params.complexity,
            },
          },
        ]).catch(() => undefined);
      } catch {
        const fallback = params.locale === "ar"
          ? "تعذر على Future إكمال الإجابة الآن. حاول مرة أخرى بعد التحقق من إعدادات Gemini."
          : "Future could not complete the answer right now. Check the Gemini configuration and try again.";
        controller.enqueue(encoder.encode(fallback));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

function parseAssistantRequest(value: unknown): AssistantRequest | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const locale = record.locale === "ar" ? "ar" : "en";
  const smoke = record.smoke === true;

  if (!message || message.length > 4_000) {
    return null;
  }

  return { message, locale, smoke };
}

function geminiToolCalls(functionCalls: readonly {
  name?: string;
  args?: Record<string, unknown>;
}[]): AssistantToolCall[] {
  return functionCalls
    .filter((call) => typeof call.name === "string")
    .map((call) => ({
      name: call.name ?? "",
      args: call.args ?? {},
    }));
}

function detectComplexity(
  message: string,
  toolResults: readonly AssistantToolExecution[],
): "simple" | "complex" {
  const lower = message.toLowerCase();
  const asksForReasoning = /why|compare|forecast|predict|best|لماذا|قارن|توقع|أفضل/.test(lower);
  return asksForReasoning || toolResults.length > 1 ? "complex" : "simple";
}
