"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";

export default function AddToCartButton({ productId, stock, selectedColor, selectedImage }: { productId: string, stock: number, selectedColor?: string, selectedImage?: string }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(productId, 1, selectedColor, selectedImage);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Reset after 2s
    };

    return (
        <button
            type="button"
            onClick={handleAdd}
            disabled={stock === 0 || added}
            className={`flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${added ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
            {stock === 0 ? "Out of Stock" : added ? <><FiCheck className="mr-2" /> Added</> : <><FiShoppingCart className="mr-2" /> Add to Cart</>}
        </button>
    );
}
