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
    "Prototype Banana Navy d'un accueil vocal humain, trilingue et sourcé pour les voyageurs de Brussels Airport.",
  alternates: publicSiteUrl ? { canonical: `${publicSiteUrl}/` } : undefined,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <VoiceProvider>{children}</VoiceProvider>
      </body>
    </html>
  );
}
