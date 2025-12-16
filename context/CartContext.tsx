"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
    productId: string | any;
    quantity: number;
    color?: string;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (productId: string, quantity?: number, color?: string, image?: string) => void;
    removeItem: (productId: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, color?: string) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            const stored = localStorage.getItem("cart");
            if (stored) setItems(JSON.parse(stored));
            setIsInitialized(true);
        } else {
            // Fetch from DB
            fetch("/api/cart")
                .then((res) => res.json())
                .then((data) => {
                    if (data.items) {
                        const mapped = data.items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            color: item.color,
                            image: item.image
                        }));
                        setItems(mapped);
                    }
                    setIsInitialized(true);
                });
        }
    }, [session, status]);

    // Sync to LocalStorage or DB
    useEffect(() => {
        if (!isInitialized) return;
        if (!session) {
            localStorage.setItem("cart", JSON.stringify(items));
        } else {
            const payload = items.map(item => ({
                productId: typeof item.productId === 'object' ? item.productId._id : item.productId,
                quantity: item.quantity,
                color: item.color,
                image: item.image
            }));

            if (items.length >= 0) {
                fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: payload })
                });
            }
        }
    }, [items, isInitialized, session]);

    const addItem = (productId: string, quantity = 1, color?: string, image?: string) => {
        setItems((prev) => {
            const existing = prev.find((item) => {
                const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
                return id === productId && item.color === color;
            });

            if (existing) {
                return prev.map((item) => {
                    const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
                    return (id === productId && item.color === color)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item;
                });
            }
            return [...prev, { productId, quantity, color, image }];
        });
    };

    const removeItem = (productId: string, color?: string) => {
        setItems((prev) => prev.filter((item) => {
            const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
            return !(id === productId && item.color === color);
        }));
    };

    const updateQuantity = (productId: string, quantity: number, color?: string) => {
        if (quantity < 1) {
            removeItem(productId, color);
            return;
        }
        setItems((prev) => prev.map((item) => {
            const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
            return (id === productId && item.color === color) ? { ...item, quantity } : item;
        }));
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
