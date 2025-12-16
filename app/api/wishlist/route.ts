import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product"; // Ensure Product model is registered
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email }).populate("wishlist");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already in wishlist
        const isAlreadyInWishlist = user.wishlist.includes(productId);

        if (isAlreadyInWishlist) {
            return NextResponse.json({ message: "Product already in wishlist", wishlist: user.wishlist }, { status: 200 });
        }

        user.wishlist.push(productId);
        await user.save();

        return NextResponse.json({ message: "Product added to wishlist", wishlist: user.wishlist }, { status: 200 });

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
        await user.save();

        return NextResponse.json({ message: "Product removed from wishlist", wishlist: user.wishlist }, { status: 200 });

    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
