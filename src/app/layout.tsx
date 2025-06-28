// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Home, BrainCircuit, BarChart3 } from "lucide-react";
import { Toaster } from "react-hot-toast";

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
        <nav className="hidden md:block bg-zinc-800 border-b border-zinc-700 shadow">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-around items-center text-xs">
              <NavItem
                href="/"
                icon={<Home className="w-5 h-5" />}
                label="Home"
              />
              <NavItem
                href="/suggest"
                icon={<BrainCircuit className="w-5 h-5" />}
                label="Roles"
              />
              <NavItem
                href="/members"
                icon={<BarChart3 className="w-5 h-5" />}
                label="Progress"
              />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="w-full max-w-screen-lg mx-auto px-0 pt-3 pb-20 min-h-[calc(100vh-56px)]">
          {children}
          <Toaster position="top-right" />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 border-t border-zinc-700 rounded-t-xl shadow-[0_-1px_6px_rgba(0,0,0,0.3)] md:hidden mb-0">
          <div className="flex justify-around text-xs">
            <NavItem
              href="/"
              icon={<Home className="w-5 h-5" />}
              label="Home"
              mobile
            />
            <NavItem
              href="/suggest"
              icon={<BrainCircuit className="w-5 h-5" />}
              label="Roles"
              mobile
            />
            <NavItem
              href="/members"
              icon={<BarChart3 className="w-5 h-5" />}
              label="Progress"
              mobile
            />
          </div>
        </nav>
      </body>
    </html>
  );
}

function NavItem({
  href,
  icon,
  label,
  mobile = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex ${
        mobile ? "flex-col py-2" : "items-center gap-2 py-3"
      } text-zinc-300 hover:text-rose-500`}
    >
      {icon}
      <span className={mobile ? "mt-1" : ""}>{label}</span>
    </Link>
  );
}
