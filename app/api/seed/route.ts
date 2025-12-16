import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ImageKit from "imagekit";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const SOURCE_DIR = "C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\ff401b42-4cae-4175-9e9d-d41743092d8a";

const PRODUCT_PREFIXES: Record<string, string> = {
    "gaming_mouse": "Pro Gaming Mouse",
    "headphones": "Studio Headphones",
    "jacket": "All-Weather Jacket",
    "jeans": "Classic Denim Jeans",
    "keyboard": "Mechanical Keyboard",
    "running_shoe": "Performance Running Shoes",
    "smart_watch": "Smart Watch Series 5",
    "smartphone": "Smartphone X",
    "speaker": "Portable Speaker",
    "tablet": "Pro Tablet",
    "tshirt": "Cotton T-Shirt"
};

export async function GET() {
    try {
        await connectDB();
        await Product.deleteMany({}); // Clear existing products

        if (!fs.existsSync(SOURCE_DIR)) {
            return NextResponse.json({ error: "Source directory not found" }, { status: 404 });
        }

        const files = fs.readdirSync(SOURCE_DIR).filter(f => f.match(/\.(png|jpg|jpeg)$/i));
        const results = [];

        // Group files by product
        const productGroups: Record<string, { color: string, file: string }[]> = {};

        for (const file of files) {
            let productName = "Generic Product";
            let color = "Standard";

            // Identify product and color from filename
            // Format assumptions: prefix_color_timestamp.ext or similar
            // We use known prefixes to identify product
            let prefixFound = false;
            for (const [prefix, name] of Object.entries(PRODUCT_PREFIXES)) {
                if (file.startsWith(prefix)) {
                    productName = name;
                    prefixFound = true;

                    // Extract color: remove prefix, remove timestamp/ext
                    // file: gaming_mouse_black_123.png
                    // remain: _black_123.png
                    const remain = file.substring(prefix.length);
                    // split by _
                    const parts = remain.split("_").filter(Boolean);
                    // parts: ["black", "123.png"]
                    // Process parts to find color. usually all parts except last (timestamp.ext)
                    if (parts.length > 1) {
                        parts.pop(); // remove timestamp part
                        color = parts.join(" ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                    }
                    break;
                }
            }

            if (!prefixFound) continue; // Skip files that don't match our products

            if (!productGroups[productName]) {
                productGroups[productName] = [];
            }
            productGroups[productName].push({ color, file });
        }

        // Process groups
        for (const [name, variants] of Object.entries(productGroups)) {
            const productImages = [];

            for (const variant of variants) {
                const filePath = path.join(SOURCE_DIR, variant.file);
                const fileBuffer = fs.readFileSync(filePath);

                console.log(`Uploading ${variant.file}...`);

                try {
                    const uploadResponse = await imagekit.upload({
                        file: fileBuffer,
                        fileName: variant.file,
                        folder: "/products"
                    });

                    productImages.push({
                        color: variant.color,
                        image: uploadResponse.url
                    });
                } catch (uploadError) {
                    console.error(`Failed to upload ${variant.file}`, uploadError);
                }
            }

            if (productImages.length > 0) {
                // Create or Update Product
                const existingProduct = await Product.findOne({ name });
                if (existingProduct) {
                    existingProduct.images = productImages;
                    // Update colors list as well
                    existingProduct.colors = productImages.map((i: any) => i.color);
                    await existingProduct.save();
                    results.push({ name, status: "updated", count: productImages.length });
                } else {
                    await Product.create({
                        name,
                        description: `High quality ${name} with premium features.`,
                        price: 99.99, // Default price
                        category: "electronics", // Default, should refine if possible
                        stock: 50,
                        colors: productImages.map(i => i.color),
                        images: productImages
                    });
                    results.push({ name, status: "created", count: productImages.length });
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Seeding failed", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
