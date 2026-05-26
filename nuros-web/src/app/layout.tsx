import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContactWidget from "@/components/ContactWidget";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nuros | Clinical AI Vocal Biomarkers for Healthcare Providers",
  description: "Non-invasive screening via HL7 FHIR integrated Medical-grade AI. Nuros provides advanced acoustic phenotyping for clinical decision support and triage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://nuroshealth.ca/#organization",
                  "name": "Nuros AI",
                  "url": "https://nuroshealth.ca",
                  "logo": "https://nuroshealth.ca/logo.png",
                  "description": "Clinical AI Vocal Biomarkers for Healthcare Providers.",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-800-000-0000",
                    "contactType": "Customer Service",
                    "areaServed": "CA",
                    "availableLanguage": "en"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://nuroshealth.ca/#software",
                  "name": "Nuros Vocal Biomarker Triage Platform",
                  "applicationCategory": "HealthApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "CAD"
                  },
                  "publisher": {
                    "@id": "https://nuroshealth.ca/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-midnight-900 text-slate-50 relative overflow-x-hidden`}>
        {/* Decorative background blur elements for the medical AI luxury feel */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#08f7ce]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00d4ff]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {children}
        <ContactWidget />
      </body>
    </html>
  );
}
