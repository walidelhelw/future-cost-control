"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mic, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { V2Locale } from "./localize";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const suggestions = {
  ar: [
    "كم تكلفة المشاريع المتأخرة؟",
    "ما سعر الحديد الحالي؟",
    "ما فجوة التدفق النقدي؟",
    "ما الموافقات التي ستكسر SLA؟",
    "ما أفضل RFQ؟",
    "اعرض أوامر التغيير",
  ],
  en: [
    "Which projects are over budget?",
    "Current rebar rate?",
    "What is the cashflow gap?",
    "Which approvals will breach SLA?",
    "Best RFQ award?",
    "Show open change orders",
  ],
};

type FutureAssistantProps = {
  locale: V2Locale;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function FutureAssistant({ locale, onOpenChange, open }: FutureAssistantProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text:
        locale === "ar"
          ? "أنا Future. اسألني عن التكلفة، الموردين، المخاطر، أو حالة الموافقات."
          : "I am Future. Ask about costs, suppliers, risks, or approval status.",
    },
  ]);

  async function submitQuestion(event?: FormEvent<HTMLFormElement>, override?: string) {
    event?.preventDefault();
    const question = (override ?? input).trim();
    if (!question || loading) return;

    const assistantId = Date.now() + 1;
    setLoading(true);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: question },
      {
        id: assistantId,
        role: "assistant",
        text: locale === "ar" ? "Future يقرأ البيانات..." : "Future is reading the data...",
      },
    ]);
    setInput("");

    try {
      const response = await fetch("/api/v2/assistant", {
        body: JSON.stringify({ locale, message: question }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok || !response.body) {
        throw new Error(`Assistant returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, text: answer } : message
          )
        );
      }
    } catch {
      const fallback =
        locale === "ar"
          ? "إجابة العرض: يوجد مشروعان فوق الميزانية، أكبرهما كمبوند لوتس بقيمة 8.4م جنيه. المصادر: Cost Spine / Variance Feed."
          : "Demo answer: two projects are over budget, led by Lotus Compound at EGP 8.4M. Sources: Cost Spine / Variance Feed.";
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, text: fallback } : message
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function startVoiceInput() {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      toast(locale === "ar" ? "المتصفح لا يدعم إدخال الصوت" : "Voice input is not supported in this browser");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = locale === "ar" ? "ar-EG" : "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
      }
    };
    recognition.start();
  }

  return (
    <>
      <Button
        className={cn(
          "fixed end-5 z-[90] h-14 w-14 rounded-full border border-cyan-500 bg-cyan-600 text-white shadow-[0_18px_44px_rgba(14,165,233,0.3)] hover:bg-cyan-500",
          "bottom-20 lg:bottom-5"
        )}
        onClick={() => onOpenChange(true)}
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.section
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-24 end-4 z-[110] flex h-[min(680px,78vh)] w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-cyan-200 bg-white/95 text-slate-950 shadow-[0_24px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl lg:bottom-24"
            dir={locale === "ar" ? "rtl" : "ltr"}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
          >
            <header className="flex items-center gap-3 border-b border-slate-200 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-cyan-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-950">Future</h2>
                <p className="text-xs text-slate-400">
                  {locale === "ar" ? "مساعد تنفيذي ثنائي اللغة" : "Bilingual executive assistant"}
                </p>
              </div>
              <Button
                className="h-8 w-8 border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                onClick={() => onOpenChange(false)}
                size="icon"
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  className={cn(
                    "max-w-[88%] rounded-md border px-3 py-2 text-sm leading-6",
                    message.role === "assistant"
                      ? "border-cyan-200 bg-cyan-50 text-slate-800"
                      : "ms-auto border-cyan-500 bg-cyan-600 text-white"
                  )}
                  key={message.id}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions[locale].map((suggestion) => (
                  <button
                    className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-cyan-300 hover:text-cyan-800"
                    key={suggestion}
                    onClick={() => submitQuestion(undefined, suggestion)}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <form className="flex items-center gap-2" onSubmit={submitQuestion}>
                <button
                  className="grid h-10 w-10 place-items-center rounded border border-slate-200 text-slate-500 hover:border-cyan-300 hover:text-cyan-800"
                  onClick={startVoiceInput}
                  type="button"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  className="h-10 min-w-0 flex-1 rounded border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={locale === "ar" ? "اسأل عن أي مشروع..." : "Ask about any project..."}
                  value={input}
                />
                <Button
                  className="h-10 bg-cyan-600 text-white hover:bg-cyan-500"
                  disabled={loading}
                  size="icon"
                >
                  <Send className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </form>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}

type SpeechRecognitionConstructor = new () => {
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEventLike) => void;
  start: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};
