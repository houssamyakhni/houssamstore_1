import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        image: {
            type: String,
            default: "",
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        address: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            street: { type: String, required: true },
            details: { type: String },
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
