import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // const session = await getServerSession(authOptions);
        //
        // // Simple admin check (enhance in production)
        // if (!session || (session.user as any).role !== 'admin') {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { id } = await params;
        const { status } = await req.json();

        await connectDB();
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
