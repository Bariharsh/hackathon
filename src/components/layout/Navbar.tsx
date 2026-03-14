"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Operations", href: "/receipts" },
  { name: "Stock", href: "/products" },
  { name: "Move History", href: "/move-history" },
  { name: "Settings", href: "/warehouses" },
];

export default function Navbar() {

  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        <nav className="flex gap-6 text-sm font-medium">

          {navItems.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              className={`pb-1 transition ${
                pathname === item.href
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              {item.name}

            </Link>

          ))}

        </nav>

        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
          A
        </div>

      </div>

    </header>
  );
}