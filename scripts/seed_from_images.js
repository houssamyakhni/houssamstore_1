const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Manually load .env
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach(line => {
        if (line.startsWith("MONGODB_URI=")) {
            process.env.MONGODB_URI = line.split("=").slice(1).join("=").trim();
        }
    });
}

// Inline Product Schema to avoid TS compilation issues
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{
        color: String,
        image: String
    }],
    imageUrl: { type: String }, // fallback
    colors: [String],
    stock: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/houssam-store";

const sourceDir = "C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\ff401b42-4cae-4175-9e9d-d41743092d8a";
const targetDir = path.join(process.cwd(), "public", "products");

// Ensure target dir exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const productsToSeed = [
    {
        name: "Pro Gaming Mouse",
        description: "High-precision optical gaming mouse with adjustable DPI and ergonomic design.",
        price: 49.99,
        category: "Electronics",
        baseImage: "gaming_mouse_black",
        variants: [
            { color: "Black", filePattern: "gaming_mouse_black" },
            { color: "RGB", filePattern: "gaming_mouse_rgb" },
            { color: "White", filePattern: "gaming_mouse_white" }
        ]
    },
    {
        name: "Noise Cancelling Headphones",
        description: "Immersive wireless headphones with active noise cancellation and long battery life.",
        price: 129.99,
        category: "Electronics",
        baseImage: "headphones_midnight_black",
        variants: [
            { color: "Midnight Black", filePattern: "headphones_midnight_black" },
            { color: "Navy Blue", filePattern: "headphones_navy_blue" },
            { color: "Pearl White", filePattern: "headphones_pearl_white" }
        ]
    },
    {
        name: "Winter Bomber Jacket",
        description: "Warm and stylish bomber jacket perfect for chilly weather. Water-resistant outer layer.",
        price: 89.99,
        category: "Fashion",
        baseImage: "jacket_charcoal_black",
        variants: [
            { color: "Charcoal Black", filePattern: "jacket_charcoal_black" },
            { color: "Crimson Red", filePattern: "jacket_crimson_red" },
            { color: "Midnight Blue", filePattern: "jacket_midnight_blue" }
        ]
    },
    {
        name: "Slim Fit Jeans",
        description: "Classic slim fit jeans made from durable denim with a comfortable stretch.",
        price: 59.99,
        category: "Fashion",
        baseImage: "jeans_blue",
        variants: [
            { color: "Black", filePattern: "jeans_black" },
            { color: "Blue", filePattern: "jeans_blue" },
            { color: "Grey", filePattern: "jeans_grey" }
        ]
    },
    {
        name: "Mechanical Keyboard",
        description: "Tactile mechanical keyboard with customizable RGB backlighting and premium switches.",
        price: 149.99,
        category: "Electronics",
        baseImage: "keyboard_dark_grey",
        variants: [
            { color: "Dark Grey", filePattern: "keyboard_dark_grey" },
            { color: "Retro Beige", filePattern: "keyboard_retro_beige" },
            { color: "White Mint", filePattern: "keyboard_white_mint" }
        ]
    },
    {
        name: "Speed Runner Sneakers",
        description: "Lightweight running shoes designed for performance and comfort on any terrain.",
        price: 119.99,
        category: "Sports",
        baseImage: "running_shoe_electric_blue",
        variants: [
            { color: "Bright Orange", filePattern: "running_shoe_bright_orange" },
            { color: "Electric Blue", filePattern: "running_shoe_electric_blue" },
            { color: "Neon Green", filePattern: "running_shoe_neon_green" }
        ]
    },
    {
        name: "Ultra Smartphone X",
        description: "Flagship smartphone with pro-grade camera system and all-day battery life.",
        price: 999.99,
        category: "Electronics",
        baseImage: "smartphone_phantom_black",
        variants: [
            { color: "Icy White", filePattern: "smartphone_icy_white" },
            { color: "Lavender", filePattern: "smartphone_lavender" },
            { color: "Phantom Black", filePattern: "smartphone_phantom_black" }
        ]
    },
    {
        name: "Portable Bluetooth Speaker",
        description: "Compact wireless speaker with powerful 360-degree sound and waterproof design.",
        price: 79.99,
        category: "Electronics",
        baseImage: "speaker_matte_black",
        variants: [
            { color: "Matte Black", filePattern: "speaker_matte_black" },
            { color: "Red", filePattern: "speaker_red" },
            { color: "Teal Blue", filePattern: "speaker_teal_blue" }
        ]
    },
    {
        name: "Series 9 Smart Watch",
        description: "Advanced health monitoring, fitness tracking, and seamless connectivity on your wrist.",
        price: 299.99,
        category: "Electronics",
        baseImage: "smart_watch_graphite_grey",
        variants: [
            { color: "Graphite Grey", filePattern: "smart_watch_graphite_grey" },
            { color: "Rose Gold", filePattern: "smart_watch_rose_gold" },
            { color: "Silver", filePattern: "smart_watch_silver" }
        ]
    },
    {
        name: "Pro Tablet Air",
        description: "Versatile tablet for work and play, featuring a stunning liquid retina display.",
        price: 599.99,
        category: "Electronics",
        baseImage: "tablet_space_grey",
        variants: [
            { color: "Silver", filePattern: "tablet_silver" },
            { color: "Sky Blue", filePattern: "tablet_sky_blue" },
            { color: "Space Grey", filePattern: "tablet_space_grey" }
        ]
    },
    {
        name: "Classic Cotton T-Shirt",
        description: "Essential everyday tee made from 100% organic cotton for ultimate softness.",
        price: 24.99,
        category: "Fashion",
        baseImage: "tshirt_white",
        variants: [
            { color: "Blue", filePattern: "tshirt_blue" },
            { color: "Red", filePattern: "tshirt_red" },
            { color: "White", filePattern: "tshirt_white" }
        ]
    },
    {
        name: "Radiant Face Cream",
        description: "Hydrating daily moisturizer for glowing, healthy-looking skin.",
        price: 15.00,
        category: "Beauty",
        baseImage: "cream wajh",
        variants: [
            { color: "Standard", filePattern: "cream wajh" }
        ]
    },
    {
        name: "Matte Lipstick",
        description: "Long-lasting matte lipstick in a bold, vibrant shade.",
        price: 20.00,
        category: "Beauty",
        baseImage: "hmra",
        variants: [
            { color: "Red", filePattern: "hmra" }
        ]
    },
    {
        name: "Luxury Perfume",
        description: "Elegant fragrance with notes of jasmine, rose, and vanilla.",
        price: 85.00,
        category: "Beauty",
        baseImage: "perfium",
        variants: [
            { color: "Standard", filePattern: "perfium" }
        ]
    },
    {
        name: "Herbal Shampoo",
        description: "Nourishing shampoo enriched with natural herbal extracts.",
        price: 12.00,
        category: "Beauty",
        baseImage: "shampo",
        variants: [
            { color: "Standard", filePattern: "shampo" }
        ]
    },
    {
        name: "Action 4K Camera",
        description: "Rugged waterproof 4K action camera with image stabilization and front screen.",
        price: 249.99,
        category: "Electronics",
        baseImage: "action_camera_black",
        variants: [
            { color: "Black", filePattern: "action_camera_black" }
        ]
    },
    {
        name: "Premium Yoga Mat",
        description: "Extra thick non-slip yoga mat for comfortable workouts at home or studio.",
        price: 35.00,
        category: "Sports",
        baseImage: "yoga_mat_purple",
        variants: [
            { color: "Purple", filePattern: "yoga_mat_purple" }
        ]
    }
];

async function seed() {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    // Get all files in source dir
    const files = fs.readdirSync(sourceDir);

    for (const p of productsToSeed) {
        console.log(`Processing ${p.name}...`);

        const images = [];
        let mainImageUrl = "/placeholder.png";

        for (const variant of p.variants) {
            // Find file matching pattern
            const file = files.find(f => f.toLowerCase().includes(variant.filePattern.toLowerCase().replace(/_/g, " ").trim()) || f.toLowerCase().includes(variant.filePattern.toLowerCase()));

            if (file) {
                const sourcePath = path.join(sourceDir, file);
                // Clean filename
                const ext = path.extname(file);
                const cleanName = variant.filePattern.replace(/\s+/g, "_").toLowerCase() + ext;
                const destPath = path.join(targetDir, cleanName);

                fs.copyFileSync(sourcePath, destPath);

                const publicUrl = `/products/${cleanName}`;
                images.push({
                    image: publicUrl,
                    color: variant.color
                });

                if (p.baseImage && file.includes(p.baseImage)) { // loose check
                    // handled below or just take the first one
                }
            }
        }

        if (images.length > 0) {
            mainImageUrl = images[0].image;
        }

        // Check if product exists
        const existing = await Product.findOne({ name: p.name });
        if (existing) {
            console.log(`Updating ${p.name}`);
            existing.price = p.price;
            existing.description = p.description;
            existing.category = p.category;
            existing.imageUrl = mainImageUrl;
            existing.images = images;
            existing.colors = p.variants.map(v => v.color);
            existing.stock = 50; // default stock
            await existing.save();
        } else {
            console.log(`Creating ${p.name}`);
            await Product.create({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                imageUrl: mainImageUrl,
                images: images,
                colors: p.variants.map(v => v.color),
                stock: 50
            });
        }
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
