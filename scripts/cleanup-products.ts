
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Product from "../models/Product";

// Load environment variables
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

async function cleanupProducts() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined.");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find products where images array is empty AND imageUrl is missing or empty
        // logic:
        // images: { $size: 0 } OR images field missing
        // AND
        // imageUrl: { $exists: false } or null or ""

        // Actually, we moved to `images` array schema.
        // Let's delete if:
        // 1. images array is empty or non-existent
        // AND
        // 2. imageUrl is also empty/null (for backward compatibility safety)

        // More aggressive approach since user said "delete all product without image":
        // We will consider a product "without image" if it has no valid image in `images` array AND no `imageUrl`.

        const result = await Product.deleteMany({
            $and: [
                {
                    $or: [
                        { images: { $exists: false } },
                        { images: { $size: 0 } },
                        // Could also check if images has elements but `image` string is empty, but that's deeper.
                    ]
                },
                {
                    $or: [
                        { imageUrl: { $exists: false } },
                        { imageUrl: null },
                        { imageUrl: "" }
                    ]
                }
            ]
        });

        console.log(`Deleted ${result.deletedCount} products without images.`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error cleaning up products:", error);
        process.exit(1);
    }
}

cleanupProducts();
