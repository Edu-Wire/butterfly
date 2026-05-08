import connectDB from "../lib/db.js";
import User from "../models/User.js";
import { generateToken } from "../lib/jwt.js";
import { z } from "zod";
import { authHooks } from "../hooks/authHooks.js";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in ms (Express uses ms)
    path: "/",
};

export class AuthController {
    static async signup(req, res) {
        try {
            await connectDB();
            await authHooks.beforeSignup(req);

            const validatedData = signupSchema.parse(req.body);

            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                return res.status(400).json({ error: "User with this email already exists" });
            }

            const user = new User(validatedData);
            await user.save();

            const token = generateToken(user);

            const userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                address: user.address,
                createdAt: user.createdAt,
            };

            await authHooks.afterSignup(user, token);

            res.cookie("token", token, COOKIE_OPTS);
            return res.status(201).json({
                message: "User created successfully",
                user: userResponse,
                token,
            });
        } catch (error) {
            console.error("Signup error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error.errors });
            }
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            await connectDB();
            await authHooks.beforeLogin(req);

            const validatedData = loginSchema.parse(req.body);

            const user = await User.findOne({ email: validatedData.email }).select("+password");
            if (!user) {
                return res.status(401).json({ error: "Wrong credentials" });
            }

            const isPasswordValid = await user.comparePassword(validatedData.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Wrong credentials" });
            }

            const token = generateToken(user);

            const userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                address: user.address,
                createdAt: user.createdAt,
            };

            await authHooks.afterLogin(user, token);

            res.cookie("token", token, COOKIE_OPTS);
            return res.status(200).json({
                message: "Login successful",
                user: userResponse,
                token,
            });
        } catch (error) {
            console.error("Login error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error.errors });
            }
            return res.status(500).json({
                error: "Internal server error during login",
                message: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            });
        }
    }

    static async logout(req, res) {
        try {
            await authHooks.onLogout(req);
            res.cookie("token", "", { ...COOKIE_OPTS, maxAge: 0 });
            return res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
