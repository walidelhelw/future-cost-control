"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createV2BrowserClient } from "@/lib/v2/supabase/client";
import type { V2Locale } from "./localize";

type V2AuthGateProps = {
  locale: V2Locale;
};

export function V2AuthGate({ locale }: V2AuthGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const supabase = createV2BrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(locale === "ar" ? "تعذر تسجيل الدخول" : "Sign in failed", {
        description: error.message,
      });
      return;
    }

    window.location.reload();
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-5xl place-items-center p-4">
      <section className="grid w-full gap-4 rounded-md border border-cyan-300/20 bg-black/45 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1fr_380px] md:p-8">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
              <LockKeyhole className="h-4 w-4" />
              {locale === "ar" ? "دخول بدعوة فقط" : "Invite-only access"}
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold text-white md:text-5xl">
              {locale === "ar" ? "مركز قيادة Future مؤمن لكل مشروع" : "Future Command Center is secured per project"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              {locale === "ar"
                ? "يتم تحميل بيانات V2 عبر جلسة Supabase وسياسات RLS فقط. لا توجد قراءة SQL خام أو وصول عابر بين المشاريع."
                : "V2 data loads through Supabase sessions and RLS policies only. No raw SQL and no cross-project access."}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            {["RLS", "Audit log", "AI cost log"].map((item) => (
              <div className="rounded border border-white/10 bg-white/[0.04] p-3" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-md border border-white/10 bg-white/[0.04] p-4" onSubmit={submit}>
          <h2 className="text-lg font-semibold text-white">
            {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
          </h2>
          <label className="mt-5 block text-xs text-slate-400">
            {locale === "ar" ? "البريد الإلكتروني" : "Email"}
            <div className="mt-2 flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3">
              <Mail className="h-4 w-4 text-cyan-200" />
              <input
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                dir="ltr"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>
          </label>
          <label className="mt-4 block text-xs text-slate-400">
            {locale === "ar" ? "كلمة المرور" : "Password"}
            <input
              className="mt-2 h-11 w-full rounded border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-cyan-300/40"
              dir="ltr"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <Button
            className="mt-5 w-full bg-cyan-300 text-black hover:bg-cyan-200"
            disabled={loading}
          >
            {loading
              ? locale === "ar" ? "جار التحقق..." : "Checking..."
              : locale === "ar" ? "دخول إلى V2" : "Enter V2"}
          </Button>
        </form>
      </section>
    </div>
  );
}
