import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { format } from "date-fns"; // Standard date formatting if available, otherwise native
import { FiEye } from "react-icons/fi";
import AdminOrderActions from "@/components/AdminOrderActions";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

async function getOrders() {
    await connectDB();
    const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate("userId", "name email") // explicit fields
        .populate("items.productId", "name")
        .lean();

    // Serialize
    return orders.map((order: any) => ({
        _id: order._id.toString(),
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod || "COD",
        customer: order.userId ? {
            name: order.userId.name,
            email: order.userId.email
        } : null,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item: any) => ({
            name: item.productId?.name || "Deleted Product",
            color: item.color,
            quantity: item.quantity,
            image: item.image
        }))
    }));
}

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customer?.name || "Guest"}</span>
                                                <span className="text-gray-500 text-xs">{order.customer?.email || "No email"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs space-y-1">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center text-xs">
                                                        <span className="font-medium text-gray-900 mr-1">{item.name}</span>
                                                        {item.color && (
                                                            <span className="inline-block w-3 h-3 rounded-full border border-gray-300 mr-1" style={{ backgroundColor: item.color }} title={item.color}></span>
                                                        )}
                                                        <span className="text-gray-500">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <AdminOrderActions orderId={order._id} currentStatus={order.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
