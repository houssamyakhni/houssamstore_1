import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminSessionUser = {
    id: string;
    email: string;
    role: "admin" | "user";
};

async function getDashboardStats() {
    await connectDB();

    const [
        productsCount,
        usersCount,
        ordersCount,
        revenueAgg
    ] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ])
    ]);

    return {
        productsCount,
        usersCount,
        ordersCount,
        totalRevenue: revenueAgg[0]?.total ?? 0
    };
}

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const user = session?.user as AdminSessionUser | undefined;

    if (!user || user.role !== "admin") {
        redirect("/login");
    }

    const stats = await getDashboardStats();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Sales", value: `$${stats.totalRevenue.toFixed(2)}`, color: "bg-blue-500" },
                    { label: "Total Orders", value: stats.ordersCount, color: "bg-emerald-500" },
                    { label: "Products", value: stats.productsCount, color: "bg-purple-500" },
                    { label: "Customers", value: stats.usersCount, color: "bg-orange-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
