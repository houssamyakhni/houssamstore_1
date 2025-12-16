"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartCount } = useCart();
    const [hydratedItems, setHydratedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            const itemsToFetch = items.filter(item => typeof item.productId === 'string');
            const alreadyPopulated = items.filter(item => typeof item.productId === 'object');

            if (itemsToFetch.length === 0) {
                setHydratedItems(alreadyPopulated.map(item => ({
                    ...item,
                    product: item.productId
                })));
                setLoading(false);
                return;
            }

            const ids = Array.from(new Set(itemsToFetch.map(item => item.productId)));

            try {
                const res = await fetch('/api/products/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids })
                });
                const data = await res.json();

                if (data.products) {
                    const productMap = new Map(data.products.map((p: any) => [p._id, p]));

                    const merged = items.map(item => {
                        if (typeof item.productId === 'object') {
                            return { ...item, product: item.productId };
                        }
                        return {
                            ...item,
                            product: productMap.get(item.productId)
                        };
                    });
                    setHydratedItems(merged);
                }
            } catch (error) {
                console.error("Failed to fetch cart details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [items]);

    const total = hydratedItems.reduce((acc, item) => {
        const price = item.product?.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (loading && items.length > 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-500">Loading cart...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cartCount})</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <section className="lg:col-span-7">
                    <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                        {hydratedItems.map((item, index) => {
                            const product = item.product;
                            if (!product) return null;

                            const id = product._id;
                            const name = product.name;
                            const price = product.price;
                            const category = product.category;

                            // Prefer variant image, fallback to product default, then placeholder
                            const imageUrl = item.image || (product.images?.[0]?.image) || product.imageUrl || "/placeholder.png";

                            // Unique key for rendering list - compose ID + color + index fallback
                            const uniqueKey = `${id}-${item.color || 'default'}-${index}`;

                            return (
                                <li key={uniqueKey} className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden relative">
                                        <Image
                                            src={imageUrl}
                                            alt={name}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link href={`/products/${id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                                            {name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex flex-col text-sm text-gray-500">
                                                    <p className="capitalize">{category}</p>
                                                    {item.color && (
                                                        <p className="flex items-center mt-1">
                                                            Color:
                                                            <span
                                                                className="ml-2 w-4 h-4 rounded-full border border-gray-300 inline-block"
                                                                style={{ backgroundColor: item.color }}
                                                                title={item.color}
                                                            />
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">${price.toFixed(2)}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={() => updateQuantity(id, item.quantity - 1, item.color)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                                                        <FiMinus size={16} />
                                                    </button>
                                                    <span className="text-gray-900 font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(id, item.quantity + 1, item.color)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                                                        <FiPlus size={16} />
                                                    </button>
                                                </div>

                                                <div className="absolute top-0 right-0">
                                                    <button onClick={() => removeItem(id, item.color)} className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500">
                                                        <FiTrash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                    <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">${total.toFixed(2)}</dd>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                            <dt className="text-base font-medium text-gray-900">Order total</dt>
                            <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="w-full bg-gray-900 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
