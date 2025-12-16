import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        price: {
            type: Number,
            required: [true, "Please provide a price"],
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
        },
        stock: {
            type: Number,
            required: [true, "Please provide stock quantity"],
            default: 0,
        },
        colors: {
            type: [String],
            default: [],
        },
        images: {
            type: [
                {
                    color: { type: String, required: true },
                    image: { type: String, required: true },
                },
            ],
            default: [],
        }
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
