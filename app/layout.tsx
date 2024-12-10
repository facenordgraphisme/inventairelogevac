import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from 'next/font/google';
import { Toaster } from "sonner";

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
        className={`${dmSans.className} bg-[#Fff]  min-h-screen text-black antialiased max-w-screen overflow-x-hidden scroll-smooth`}
      >
        {children}
        <Toaster position="bottom-right" duration={3000} />
      </body>
    </html>
  );
}
