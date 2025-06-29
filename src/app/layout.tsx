// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Home, BrainCircuit, BarChart3 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toastmasters Bot",
  description: "Role assignment assistant for Toastmasters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-zinc-900 text-zinc-100 min-h-screen flex flex-col mx-auto`}
      >
        {/* Desktop Navbar */}
        <NavBar />

        {/* Page Content */}
        <main className="w-full max-w-screen-lg mx-auto px-1 pt-3 pb-20 min-h-[calc(100vh-56px)]">
          {children}
          <Toaster position="top-right" />
        </main>

        {/* Mobile Bottom Nav */}
        <NavBar />
      </body>
    </html>
  );
}
