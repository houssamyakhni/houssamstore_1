import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import Image from "next/image";
import { FiFilter, FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";

// Define search params type
interface SearchParams {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
}

async function getProducts(params: SearchParams) {
    await connectDB();
    const query: any = {};
    const page = Number(params.page) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;

    if (params.q) {
        query.name = { $regex: params.q, $options: "i" };
    }
    if (params.category && params.category !== "all") {
        query.category = params.category;
    }
    if (params.minPrice || params.maxPrice) {
        query.price = {};
        if (params.minPrice) query.price.$gte = Number(params.minPrice);
        if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
    }

    let sortQuery: any = { createdAt: -1 }; // Default Newest
    if (params.sort === "price_asc") sortQuery = { price: 1 };
    if (params.sort === "price_desc") sortQuery = { price: -1 };

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Use lean() for better performance and to return plain JS objects (needed for Client Components props of WishlistButton)
    const products = await Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean();

    // Serialize _id to string
    const serializedProducts = products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        // ensure images array exists if it's undefined and serialize nested _id
        images: (product.images || []).map((img: any) => ({
            ...img,
            _id: img._id ? img._id.toString() : undefined
        }))
    }));

    return {
        products: serializedProducts,
        totalPages,
        currentPage: page,
        totalProducts
    };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams; // Next.js 15+ await searchParams
    const { products, totalPages, currentPage, totalProducts } = await getProducts(params);

    // Helper to generate pagination links keeping existing filters
    const getPageLink = (pageNumber: number) => {
        return {
            query: { ...params, page: pageNumber }
        };
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
                    <p className="text-gray-500 mt-2">
                        {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
                        {params.q ? ` for "${params.q}"` : ""}
                    </p>
                </div>

                {/* Sort Dropdown (Simple implementation) */}
                <div className="flex items-center space-x-4">
                    {/* Filters could be a sidebar or dropdown, keeping simple for now */}
                    <div className="relative inline-block text-left">
                        <Link href={{ query: { ...params, sort: 'newest' } }} className={`text-sm font-medium mr-4 ${!params.sort || params.sort === 'newest' ? 'text-emerald-600' : 'text-gray-500'}`}>Newest</Link>
                        <Link href={{ query: { ...params, sort: 'price_asc' } }} className={`text-sm font-medium mr-4 ${params.sort === 'price_asc' ? 'text-emerald-600' : 'text-gray-500'}`}>Price: Low to High</Link>
                        <Link href={{ query: { ...params, sort: 'price_desc' } }} className={`text-sm font-medium ${params.sort === 'price_desc' ? 'text-emerald-600' : 'text-gray-500'}`}>Price: High to Low</Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                    <Link
                        href={currentPage > 1 ? getPageLink(currentPage - 1) : '#'}
                        className={`p-2 rounded-full border border-gray-300 transition-colors ${currentPage > 1 ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                        aria-disabled={currentPage <= 1}
                    >
                        <FiChevronLeft size={20} />
                    </Link>

                    <span className="text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Link
                        href={currentPage < totalPages ? getPageLink(currentPage + 1) : '#'}
                        className={`p-2 rounded-full border border-gray-300 transition-colors ${currentPage < totalPages ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                        aria-disabled={currentPage >= totalPages}
                    >
                        <FiChevronRight size={20} />
                    </Link>
                </div>
            )}

            {products.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
