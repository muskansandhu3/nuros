import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContactWidget from "@/components/ContactWidget";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nuros – Voice of Health AI",
  description: "An elegant, secure platform where a patient can answer guided health questions by voice and generate a structured clinical summary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
