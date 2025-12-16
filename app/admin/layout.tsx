"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FiHome, FiBox, FiUsers, FiShoppingBag, FiSettings } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin", icon: FiHome },
        { name: "Products", href: "/admin/products", icon: FiBox },
        { name: "Users", href: "/admin/users", icon: FiUsers },
        { name: "Orders", href: "/admin/orders", icon: FiShoppingBag },
    ];

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Admin Panel</h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
