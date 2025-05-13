import { DPEValidator } from "@/components/dpe-validator";
import { PageHeader } from "@/components/page-header";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Validateur DPE - Analyse automatique des diagnostics énergétiques",
  description:
    "Analysez et validez instantanément vos diagnostics de performance énergétique (DPE) avec notre outil intelligent basé sur l'IA",
  keywords:
    "DPE, diagnostic performance énergétique, validation DPE, analyse DPE, immobilier, économie d'énergie, étiquette énergétique",
  authors: [{ name: "Votre Nom ou Entreprise" }],
  robots: "noindex, nofollow", // Pour empêcher l'indexation
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://dpe-extractor.vercel.app",
    title: "Validateur DPE - Analyse automatique des diagnostics énergétiques",
    description:
      "Analysez et validez instantanément vos diagnostics de performance énergétique (DPE) avec notre outil intelligent basé sur l'IA",
    siteName: "Validateur DPE",
    images: [
      {
        url: "/og-image.png", // L'image qu'on va créer
        width: 1200,
        height: 630,
        alt: "Validateur DPE - Analyse automatique des DPE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Validateur DPE - Analyse automatique des diagnostics énergétiques",
    description:
      "Analysez et validez instantanément vos diagnostics de performance énergétique (DPE) avec notre outil intelligent basé sur l'IA",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <PageHeader
          title="Validation DPE"
          description="Vérifiez la conformité réglementaire de vos diagnostics de performance énergétique."
        />
        <DPEValidator />
      </div>
    </main>
  );
}
