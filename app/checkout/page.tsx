"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [hydratedItems, setHydratedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [shippingAddress, setShippingAddress] = useState({
        country: "",
        city: "",
        street: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (items.length === 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const itemsToFetch = items.filter(item => typeof item.productId === 'string');
            const alreadyPopulated = items.filter(item => typeof item.productId === 'object');

            let fetchedProducts = [];
            if (itemsToFetch.length > 0) {
                const ids = Array.from(new Set(itemsToFetch.map(item => item.productId)));
                try {
                    const res = await fetch('/api/products/batch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids })
                    });
                    const data = await res.json();
                    if (data.products) {
                        fetchedProducts = data.products;
                    }
                } catch (e) { console.error(e); }
            }

            const productMap = new Map(fetchedProducts.map((p: any) => [p._id, p]));

            const merged = items.map(item => {
                if (typeof item.productId === 'object') {
                    return { ...item, product: item.productId };
                }
                return {
                    ...item,
                    product: productMap.get(item.productId)
                };
            }).filter(item => item.product);

            setHydratedItems(merged);
            setLoading(false);
        };

        fetchProductDetails();
    }, [items]);

    const total = hydratedItems.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderItems = hydratedItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            color: item.color,
            image: item.image
        }));

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress,
                    totalAmount: total,
                    userId: (session?.user as any)?.id,
                    paymentMethod
                })
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                router.push(`/orders/success?orderId=${data.orderId}`);
            } else {
                alert("Order failed: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => router.push('/products')} className="text-emerald-600 hover:underline">Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                <section className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        value={shippingAddress.street}
                                        onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        value={shippingAddress.city}
                                        onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        value={shippingAddress.country}
                                        onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="cod"
                                        name="payment"
                                        type="radio"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                    />
                                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                        Cash on Delivery
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="whish"
                                            name="payment"
                                            type="radio"
                                            checked={paymentMethod === "Whish Money"}
                                            onChange={() => setPaymentMethod("Whish Money")}
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="whish" className="font-medium text-gray-700">
                                            Whish Money
                                        </label>
                                        {paymentMethod === "Whish Money" && (
                                            <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100">
                                                <p className="font-semibold">Transfer Total to: 0096181849624</p>
                                                <p className="mt-1">Please include your Order ID (which you will get after clicking Place Order) in the transfer description.</p>
                                                <p className="mt-1">Your order will be processed once the transfer is verified.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Processing..." : `Place Order ($${total.toFixed(2)})`}
                        </button>
                    </form>
                </section>

                <section className="lg:col-span-5 mt-8 lg:mt-0">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <ul className="divide-y divide-gray-200">
                            {hydratedItems.map((item, index) => (
                                <li key={`${item.product._id}-${index}`} className="py-4 flex">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image
                                            src={item.image || (item.product.images?.[0]?.image) || item.product.imageUrl || "/placeholder.png"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>{item.product.name}</h3>
                                            <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            <p>Qty {item.quantity}</p>
                                            {item.color && <p className="text-xs">Color: {item.color}</p>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Total</p>
                                <p>${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
