import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import FloatingWhatsapp from "@/components/common/FloatingWhatsapp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Shop the latest collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <Providers>
          {children}
          <FloatingWhatsapp />
        </Providers>
      </body>
    </html>
  );
}
