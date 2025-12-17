import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                console.log("Authorize called with:", credentials?.email);

                await connectDB();

                // 1. Admin Check (HARDCODED STRICT RULE)
                if (credentials.email === "HoussamStore@gmail.com") {
                    if (credentials.password === "Amal1234") {
                        console.log("Admin credentials match");
                        // Return admin user object. Using a dummy ID or finding/creating admin in DB.
                        // Ideally we upsert the admin to ensure they exist in DB for consistency.
                        let adminUser = await User.findOne({ email: "HoussamStore@gmail.com" });
                        if (!adminUser) {
                            console.log("Creating admin user in DB...");
                            const hashedPassword = await bcrypt.hash("Amal1234", 10);
                            adminUser = await User.create({
                                name: "Houssam Admin",
                                email: "HoussamStore@gmail.com",
                                password: hashedPassword,
                                role: "admin",
                                address: { country: "Admin", city: "HQ", street: "Main" }
                            });
                        }
                        return { id: adminUser._id.toString(), name: adminUser.name, email: adminUser.email, role: "admin" };
                    } else {
                        console.log("Invalid admin password");
                        throw new Error("Invalid admin password");
                    }
                }

                // 2. Normal User Check
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    console.log("User not found");
                    throw new Error("User not found");
                }

                // Prevent admin impersonation if someone tries to sign up as admin email (though signup checks should prevent this too)
                if (user.role === 'admin' && user.email !== "HoussamStore@gmail.com") {
                    // This case shouldn't theoretically happen due to strict signup rules, but safety first.
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordCorrect) {
                    console.log("Invalid password");
                    throw new Error("Invalid password");
                }

                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
