import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ items: [] });
        }

        await connectDB();
        const cart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");

        // Filter out items where product might have been deleted
        const validItems = cart ? cart.items.filter((item: any) => item.productId) : [];

        return NextResponse.json({ items: validItems });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await connectDB();
        const { items } = await req.json(); // Expecting array of { productId, quantity }

        // Update or Create Cart
        const cart = await Cart.findOneAndUpdate(
            { userId: session.user.id },
            { items },
            { new: true, upsert: true }
        );

        return NextResponse.json(cart);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
