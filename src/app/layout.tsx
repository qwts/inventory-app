import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IndexedDBProvider } from "@/providers/IndexedDbProvider"; // Adjust the import path accordingly
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Inventory",
  description:
    "Home Inventory is a simple web app to keep track of your home inventory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IndexedDBProvider>
          {children}
          <div id="modal-root"></div>
        </IndexedDBProvider>
      </body>
    </html>
  );
}
