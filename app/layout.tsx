import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from 'next/font/google';
import { Toaster } from "sonner";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "Inventaire Logevac",
  description: "Gestion, édition et impression des inventaires de Logevac",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} bg-gray-50  min-h-screen text-black antialiased max-w-screen overflow-x-hidden scroll-smooth`}
      >
        <SessionProviderWrapper>
          <Navbar />
          {children}
        </SessionProviderWrapper>
        <Toaster position="bottom-right" duration={3000} className="no-print" />
      </body>
    </html>
  );
}
