"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BrainCircuit, BarChart3 } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-zinc-800 border-b border-zinc-700 shadow">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around items-center text-xs">
            <NavItem
              href="/"
              icon={<Home className="w-5 h-5" />}
              label="Home"
              pathname={pathname}
            />
            <NavItem
              href="/suggest"
              icon={<BrainCircuit className="w-5 h-5" />}
              label="Roles"
              pathname={pathname}
            />
            <NavItem
              href="/members"
              icon={<BarChart3 className="w-5 h-5" />}
              label="Progress"
              pathname={pathname}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 border-t border-zinc-700 rounded-t-xl shadow-[0_-1px_6px_rgba(0,0,0,0.3)] md:hidden mb-0">
        <div className="flex justify-around text-xs">
          <NavItem
            href="/"
            icon={<Home className="w-5 h-5" />}
            label="Home"
            mobile
            pathname={pathname}
          />
          <NavItem
            href="/suggest"
            icon={<BrainCircuit className="w-5 h-5" />}
            label="Roles"
            mobile
            pathname={pathname}
          />
          <NavItem
            href="/members"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Progress"
            mobile
            pathname={pathname}
          />
        </div>
      </nav>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  mobile = false,
  pathname,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  mobile?: boolean;
  pathname: string;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex ${
        mobile
          ? "flex-col items-center justify-center py-2"
          : "items-center gap-2 py-3"
      } ${
        isActive
          ? "text-rose-500 font-semibold"
          : "text-zinc-300 hover:text-rose-500"
      }`}
    >
      {icon}
      <span className={mobile ? "mt-1" : ""}>{label}</span>
    </Link>
  );
}
