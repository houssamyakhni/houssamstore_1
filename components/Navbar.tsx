"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiHeart } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { data: session } = useSession();
    const { cartCount } = useCart(); // Hooked up
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState("all");
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        if (category && category !== "all") {
            params.set("category", category);
        }
        replace(`/products?${params.toString()}`);
    }, 300);

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        const params = new URLSearchParams(searchParams);
        const term = params.get("q");
        if (cat !== "all") params.set("category", cat);
        else params.delete("category");

        replace(`/products?${params.toString()}`);
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Products", href: "/products" },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className="relative w-10 h-10 overflow-hidden rounded-md flex-shrink-0">
                            <Image
                                src="/HoussamStoreLogo.png"
                                alt="Houssam Store"
                                fill
                                className="object-contain" // Removed priority to avoid LCP warnings if lazily loaded, or keep priority if above fold. Kept priority.
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Houssam Store</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-sm text-gray-600 focus:outline-none"
                                aria-label="Filter by category"
                            >
                                <option value="all">All</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="accessories">Accessories</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                                defaultValue={searchParams.get("q")?.toString()}
                                onChange={(e) => handleSearch(e.target.value)}
                                aria-label="Search products"
                            />
                            <button className="px-4 text-gray-500 hover:text-emerald-600" aria-label="Search">
                                <FiSearch size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-emerald-600",
                                    pathname === link.href ? "text-emerald-600" : "text-gray-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}


                        <Link href="/wishlist" className="text-gray-600 hover:text-emerald-600 relative">
                            <FiHeart size={22} />
                        </Link>

                        <Link href="/cart" className="text-gray-600 hover:text-emerald-600 relative">
                            <FiShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>

                        {session ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-emerald-600">
                                    <FiUser size={20} />
                                    <span>{session.user.name?.split(' ')[0]}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="py-1">
                                        {session.user.role === 'admin' && (
                                            <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                                        )}
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                                        <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600">Login</Link>
                                <Link href="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/cart" className="text-gray-600 hover:text-emerald-600 relative">
                            <FiShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 pt-4 pb-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <>
                                {session.user.role === 'admin' && (
                                    <Link href="/admin" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md">Admin Dashboard</Link>
                                )}
                                <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Sign Out</button>
                            </>
                        ) : (
                            <div className="mt-4 flex flex-col space-y-2 px-3">
                                <Link href="/login" className="block text-center py-2 text-gray-600 border border-gray-200 rounded-lg">Login</Link>
                                <Link href="/signup" className="block text-center py-2 bg-gray-900 text-white rounded-lg">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
