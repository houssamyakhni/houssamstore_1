"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface WishlistItem {
    _id: string; // Product ID (when just IDs) or Product object (when populated)
    name?: string;
    price?: number;
    images?: any[];
    [key: string]: any;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (product: WishlistItem) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    // Load wishlist on session change
    useEffect(() => {
        if (!session) {
            setWishlist([]); // Optional: LocalStorage for guest
            return;
        }

        fetch("/api/wishlist")
            .then((res) => {
                if (res.ok) return res.json();
                return [];
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setWishlist(data);
                }
            })
            .catch((err) => console.error("Failed to fetch wishlist", err));
    }, [session]);

    const addToWishlist = async (product: WishlistItem) => {
        if (!session) {
            toast.error("Please login to add to wishlist");
            return;
        }

        // Optimistic update
        setWishlist((prev) => [...prev, product]);

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id }),
            });

            if (!res.ok) throw new Error("Failed to add");

            toast.success("Added to wishlist");
        } catch (error) {
            setWishlist((prev) => prev.filter((item) => item._id !== product._id));
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!session) return;

        // Optimistic
        const prevWishlist = [...wishlist];
        setWishlist((prev) => prev.filter((item) => item._id !== productId));

        try {
            const res = await fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Removed from wishlist");
        } catch (error) {
            setWishlist(prevWishlist);
            toast.error("Failed to remove from wishlist");
        }
    };

    const toggleWishlist = async (product: WishlistItem) => {
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product);
        }
    };

    const isInWishlist = (productId: string) => {
        // Check if any item in wishlist has _id equal to productId
        return wishlist.some((item) => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
