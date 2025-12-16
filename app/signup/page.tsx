"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Construct address object
        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            address: {
                country: data.country,
                city: data.city,
                street: data.street,
                details: data.details,
            },
        };

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Something went wrong");
            }

            router.push("/login?signup=success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">Sign in</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <input name="name" type="text" required placeholder="Full Name" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                            <input name="email" type="email" required placeholder="Email Address" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                            <input name="password" type="password" required placeholder="Password (min 6 chars)" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" minLength={6} />
                        </div>

                        {/* Address Info */}
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address (Required)</p>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="country" type="text" required placeholder="Country" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                                <input name="city" type="text" required placeholder="City" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                            </div>
                            <div className="mt-4">
                                <input name="street" type="text" required placeholder="Street Address" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                            </div>
                            <div className="mt-4">
                                <input name="details" type="text" placeholder="Building, Apt, etc. (Optional)" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
