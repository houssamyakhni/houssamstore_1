"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    images: { color: string; image: string }[];
    imageUrl?: string; // fallback
}

export default function FeaturedCarousel({ products }: { products: Product[] }) {
    // We want to show 4 products at a time (on desktop)
    const [startIndex, setStartIndex] = useState(0);

    // Auto slide every 10 seconds
    useEffect(() => {
        if (products.length <= 4) return; // No need to slide if few products

        const interval = setInterval(() => {
            setStartIndex((prev) => (prev + 1) % products.length);
        }, 10000); // 10 seconds as requested

        return () => clearInterval(interval);
    }, [products.length]);

    // Determine which products to show
    // We'll create a circular list effect by concatenating products if needed or just simple index logic
    // Simple logic: Slice from startIndex, wrap around.

    const getVisibleProducts = () => {
        if (products.length === 0) return [];

        // Desktop: show 4 items. Mobile: show 1 or 2.
        // We will render all and use CSS grid/flex with overflow, but user wants "sliding".
        // Let's implement a simple visible window logic.
        // For simplicity, let's just rotate the array for rendering.

        const visibleCount = 4; // Max visible
        let visible = [];
        for (let i = 0; i < visibleCount; i++) {
            visible.push(products[(startIndex + i) % products.length]);
        }
        return visible;
    };

    const visibleProducts = products.length > 0 ? getVisibleProducts() : [];

    if (products.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">No products available yet.</h3>
                <p className="text-gray-500 mt-2">Check back soon for our latest arrivals.</p>
            </div>
        );
    }

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setStartIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    return (
        <div className="relative group/carousel">
            {/* Navigation Arrows - Always Visible */}
            {products.length > 4 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 p-3 rounded-full shadow-lg text-gray-800 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 p-3 rounded-full shadow-lg text-gray-800 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        aria-label="Next slide"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
                {visibleProducts.map((product, idx) => (
                    <div key={`${product._id}-${idx}`}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Progress / Status Indicators could go here if needed */}
        </div>
    );
}
