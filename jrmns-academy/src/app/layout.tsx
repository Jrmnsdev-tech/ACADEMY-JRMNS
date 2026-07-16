import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "JRMN'S Academy IA — Aprende Inteligencia Artificial",
  description:
    "Academia digital especializada en Inteligencia Artificial. Biblioteca de libros gratuitos y premium creados por JRMN'S.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "JRMN'S Academy IA",
    description: "Aprende Inteligencia Artificial con nuestra biblioteca digital.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
