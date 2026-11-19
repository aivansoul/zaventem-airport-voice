import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { VoiceProvider } from "@/components/voice-provider";

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : undefined,
  title: {
    default: "Zaventem Airport Voice | Banana Navy",
    template: "%s | Zaventem Airport Voice",
  },
  description:
    "Banana Navy prototype of a human, trilingual and source-grounded voice assistant for Brussels Airport travellers.",
  alternates: publicSiteUrl ? { canonical: `${publicSiteUrl}/` } : undefined,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <VoiceProvider>{children}</VoiceProvider>
      </body>
    </html>
  );
}
