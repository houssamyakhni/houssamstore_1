"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WishlistProvider>
                <CartProvider>
                    {children}
                    <Toaster position="bottom-right" />
                </CartProvider>
            </WishlistProvider>
        </SessionProvider>
    );
}
