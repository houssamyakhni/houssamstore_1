"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                        <FiCheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-500 mb-6">
                        Thank you for your purchase. Your order ID is <span className="font-mono text-gray-900">{orderId}</span>.
                    </p>
                    <div className="space-y-4">
                        <Link href="/products" className="block w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700">
                            Continue Shopping
                        </Link>
                        <Link href="/" className="block w-full text-emerald-600 bg-emerald-50 rounded-md py-2 font-medium hover:bg-emerald-100">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
