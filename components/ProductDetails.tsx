"use client";

import { useState } from "react";
import ProductImageGallery from "@/components/ProductImageGallery";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import { getColorHex } from "@/lib/colors";

interface ProductDetailsProps {
    product: any; // Using any for simplicity with complex Mongoose serialized object, better to use strict type in real app
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const [selectedColor, setSelectedColor] = useState<string | undefined>(
        product.colors?.[0] || undefined
    );

    // Find the image associated with the selected color, or default to first image
    const selectedImageObj = product.images?.find((img: any) => img.color === selectedColor) || product.images?.[0];
    const selectedImageUrl = selectedImageObj?.image;

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
            {/* Image Gallery - We can pass the selected image to it if we want it to auto-scroll, or just let it handle itself.
                For now, let's keep gallery as is but maybe we can control it later. 
                Actually, ProductImageGallery likely manages its own state. Ideally it should be controlled.
                Let's simplify: We pass all images to Gallery.
            */}
            <div className="flex flex-col-reverse">
                <ProductImageGallery
                    images={product.images || []}
                    productName={product.name}
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                />
            </div>

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                <div className="mt-3">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-3xl text-gray-900">${product.price}</p>
                </div>

                <div className="mt-6">
                    <h3 className="sr-only">Description</h3>
                    <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="text-sm font-medium text-gray-900">Details</h3>
                    <div className="mt-4 prose prose-sm text-gray-500">
                        <ul role="list">
                            <li>Category: <span className="capitalize">{product.category}</span></li>
                            <li>Stock: {product.stock > 0 ? `${product.stock} available` : <span className="text-red-600">Out of Stock</span>}</li>
                        </ul>
                    </div>
                </div>



                <div className="mt-8 flex w-full">
                    <AddToCartButton
                        productId={product._id}
                        stock={product.stock}
                        selectedColor={selectedColor}
                        selectedImage={selectedImageUrl}
                    />
                    <div className="ml-4">
                        <WishlistButton
                            product={{
                                _id: product._id,
                                name: product.name,
                                price: product.price,
                                images: product.images
                            }}
                            className="h-12 w-12 flex items-center justify-center border border-gray-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
