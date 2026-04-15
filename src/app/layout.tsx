import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { VisitTracker } from "@/components/visit-tracker";
import { WhatsAppFloat } from "@/components/whatsapp-float";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taşir Oto Kiralama",
  description: "Güvenilir ve hızlı araç kiralama"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${manrope.className} flex min-h-screen flex-col`}>
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <VisitTracker />
      </body>
    </html>
  );
}
