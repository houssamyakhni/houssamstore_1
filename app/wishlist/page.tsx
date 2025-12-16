"use client";

import { useWishlist } from "@/context/WishlistContext";


import Link from "next/link";
import Image from "next/image";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-600 mb-8">Start exploring products and save your favorites here!</p>
                <Link href="/products" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors">
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                    <div key={product._id}>
                        <ProductCard product={product} />
                        <div className="mt-2">
                            <AddToCartButton productId={product._id} stock={product.stock || 10} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
