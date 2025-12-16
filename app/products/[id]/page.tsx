import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetails from "@/components/ProductDetails";

async function getProduct(id: string) {
    try {
        await connectDB();
        const product = await Product.findById(id).lean();
        if (!product) return null;

        // Convert _id to string to avoid serialization issues
        product._id = product._id.toString();

        // Sanitize images array
        if (product.images) {
            product.images = product.images.map((img: any) => ({
                color: img.color,
                image: img.image,
                _id: img._id ? img._id.toString() : undefined
            }));
        }

        return product;
    } catch (e) {
        return null;
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductDetails product={product} />
        </div>
    );
}
