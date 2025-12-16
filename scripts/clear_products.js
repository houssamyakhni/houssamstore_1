
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

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

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function clear() {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected. Clearing products...");
    await Product.deleteMany({});
    console.log("All products deleted.");
    process.exit(0);
}

clear().catch(console.error);
