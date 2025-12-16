"use client";

import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { getColorHex } from "@/lib/colors";

interface Product {
    _id: string;

    name?: string;
    price?: number;
    category?: string;
    images?: { color: string; image: string }[];
    imageUrl?: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    let imageUrl = "/placeholder.png";
    if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].image;
    } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
    }

    return (
        <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="aspect-[1/1] w-full overflow-hidden bg-gray-100 relative">
                {/* Heart Icon */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <WishlistButton
                        product={product}
                        className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-gray-400 hover:text-red-500"
                    />
                </div>

                <Link href={`/products/${product._id}`}>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name || "Product"}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">No Image</span>
                        </div>
                    )}
                    {/* Overlay Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="block w-full text-center bg-white text-black font-semibold py-2 rounded-full text-sm hover:bg-gray-100">
                            View Details
                        </span>
                    </div>
                </Link>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm text-gray-700 font-medium group-hover:text-emerald-600 transition-colors line-clamp-1">
                            <Link href={`/products/${product._id}`}>
                                {product.name || "Product"}
                            </Link>
                        </h3>
                        {product.category && (
                            <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
                        )}
                    </div>
                    <p className="text-sm font-bold text-emerald-600">${product.price?.toFixed(2) || "0.00"}</p>
                </div>
                {/* Color Swatches */}
                {product.images && product.images.length > 1 && (
                    <div className="mt-3 flex items-center space-x-1.5">
                        {product.images.slice(0, 4).map((img, idx) => (
                            <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                                style={{ backgroundColor: getColorHex(img.color) }}
                                title={img.color}
                            />
                        ))}
                        {product.images.length > 4 && (
                            <span className="text-xs text-gray-400 pl-1">+{product.images.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
