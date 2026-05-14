import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next';
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from 'sonner';
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mono.vinayweb.in'),
  title: {
    default: "Mono | Focused AI Agents",
    template: "%s | Mono"
  },
  description: "Build a bench of AI agents that remember the work. The minimalist workspace for focused operations.",
  keywords: ["AI agents", "productivity", "minimalist workspace", "automation"],
  authors: [{ name: "Mono Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mono.vinayweb.in",
    siteName: "Mono",
    title: "Mono | Focused AI Agents",
    description: "Build a bench of AI agents that remember the work.",
    images: [{ url: "/logo.svg" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mono | Focused AI Agents",
    description: "Build a bench of AI agents that remember the work.",
    images: ["/logo.svg"]
  }
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
