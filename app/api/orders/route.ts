import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        const { items, shippingAddress, totalAmount, userId, paymentMethod } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
            return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
        }

        await connectDB();

        const order = await Order.create({
            userId: userId || null, // Optional for guest
            items,
            totalAmount,
            shippingAddress,
            status: "pending",
            paymentMethod: paymentMethod || "COD"
        });

        return NextResponse.json({ success: true, orderId: order._id });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create order" }, { status: 500 });
    }
}
