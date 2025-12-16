import { getColorHex } from "@/lib/colors";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
    images: { color: string; image: string }[];
    productName: string;
    selectedColor?: string;
    onColorSelect?: (color: string) => void;
}

export default function ProductImageGallery({ images, productName, selectedColor, onColorSelect }: ProductImageGalleryProps) {
    // Determine the image to show based on selectedColor, or default to first
    const selectedImageIndex = images?.findIndex(img => img.color === selectedColor);
    const activeIndex = selectedImageIndex >= 0 ? selectedImageIndex : 0;

    // In case selectedColor is undefined, we might defaults to first image's color on mount?
    // But parent handles state. We just display.

    const currentImage = images && images.length > 0 ? images[activeIndex].image : null;

    if (!currentImage) {
        return (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-medium text-lg">No Image Available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative shadow-sm">
                <Image
                    src={currentImage}
                    alt={productName}
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div>

            {/* Color Swatches */}
            {images.length > 1 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Available Colors</h3>
                    <div className="flex items-center space-x-3">
                        {images.map((img, idx) => {
                            const isSelected = selectedColor ? img.color === selectedColor : idx === 0;
                            return (
                                <button
                                    key={`${img.color}-${idx}`}
                                    onClick={() => onColorSelect?.(img.color)}
                                    className={`group relative h-8 w-8 rounded-full border-2 focus:outline-none transition-all ${isSelected
                                        ? "border-black ring-1 ring-black ring-offset-2 scale-110"
                                        : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    aria-label={`Select ${img.color} color`}
                                >
                                    <span
                                        className="absolute inset-0.5 rounded-full bg-gray-200 shadow-sm"
                                        style={{ backgroundColor: getColorHex(img.color) }}
                                        title={img.color}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
