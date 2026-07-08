import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { BottomNav } from "../components/layout/BottomNav";
import { Footer } from "../components/layout/Footer";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelloFi — Buy. Sell. Exchange.",
  description:
    "India's Most Trusted Platform for Buying & Selling Pre-Owned Electronics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-poppins)] bg-white text-[#1a1a2e] antialiased">
        <Navbar />
        <main className="pt-20">
          <Providers>{children}</Providers>
        </main>
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
