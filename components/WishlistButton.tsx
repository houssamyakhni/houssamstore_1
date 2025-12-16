"use client";

import { useWishlist } from "@/context/WishlistContext";
import { FiHeart } from "react-icons/fi";
import clsx from "clsx";

interface WishlistButtonProps {
    product: {
        _id: string;
        name?: string;
        price?: number;
        images?: any[];
    };
    className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isSaved = isInWishlist(product._id);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
            }}
            className={clsx(
                "p-2 rounded-full transition-all duration-200",
                isSaved ? "bg-rose-50 text-rose-500" : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500",
                className
            )}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
            <FiHeart size={20} className={clsx("transition-transform", isSaved && "fill-current scale-110")} />
        </button>
    );
}
