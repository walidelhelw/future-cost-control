import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo } from "next/font/google";
import { LocaleFrame } from "@/components/layout/LocaleFrame";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!["ar", "en"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleFrame>{children}</LocaleFrame>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
