"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

type LocaleFrameProps = {
  children: ReactNode;
};

export function LocaleFrame({ children }: LocaleFrameProps) {
  const [firstSegment] = useSelectedLayoutSegments();

  if (firstSegment === "v2") {
    return <div className="relative min-h-screen">{children}</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main className="lg:rtl:mr-64 lg:ltr:ml-64">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
