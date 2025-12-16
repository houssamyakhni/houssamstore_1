"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiX, FiTruck, FiCheckCircle } from "react-icons/fi";

interface AdminOrderActionsProps {
    orderId: string;
    currentStatus: string;
}

export default function AdminOrderActions({ orderId, currentStatus }: AdminOrderActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <span className="text-gray-400 text-xs">Processing...</span>;

    return (
        <div className="flex items-center space-x-2">
            {currentStatus === "pending" && (
                <>
                    <button
                        onClick={() => updateStatus("processing")}
                        className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50"
                        title="Accept Order"
                    >
                        <FiCheck size={18} />
                    </button>
                    <button
                        onClick={() => updateStatus("cancelled")}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Reject Order"
                    >
                        <FiX size={18} />
                    </button>
                </>
            )}
            {currentStatus === "processing" && (
                <button
                    onClick={() => updateStatus("shipped")}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Mark as Shipped"
                >
                    <FiTruck size={18} />
                </button>
            )}
            {currentStatus === "shipped" && (
                <button
                    onClick={() => updateStatus("delivered")}
                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                    title="Mark as Delivered"
                >
                    <FiCheckCircle size={18} />
                </button>
            )}
        </div>
    );
}
