import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?tls=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

/**
 * Global cache to prevent multiple connections in Next.js dev mode
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            heartbeatFrequencyMS: 10000,
            socketTimeoutMS: 45000,
            // Removed family: 4 to let the driver/OS decide the best protocol (IPv4/IPv6)
            // Added explicit tls options for better handshake compatibility
            tls: true,
            retryWrites: true,
            writeConcern: {
                w: 'majority'
            }
        };

        console.log("⏳ Connecting to MongoDB Atlas...");
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log("MongoDB connected ✅ (Database: butterfly)");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("MongoDB connection error ❌:", e.message);
        if (e.message.includes('SSL routines') || e.message.includes('MongooseServerSelectionError')) {
            console.error("💡 TIP: This error (SSL Alert 80 / ServerSelectionError) is almost always due to the server IP not being whitelisted in MongoDB Atlas.");
            console.error("👉 Please ensure 0.0.0.0/0 is whitelisted in your Atlas Network Access settings for Amplify/Live servers.");
        }
        throw e;
    }

    return cached.conn;
}

// Models
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";

// In-Memory Cart Storage
const carts = new Map();

// Dummy export for CartItem to satisfy TS imports
export const CartItem = {};

export function getCart(sessionId) {
    if (!carts.has(sessionId)) {
        carts.set(sessionId, []);
    }
    return carts.get(sessionId) || [];
}

export function addToCart(sessionId, item) {
    const cart = getCart(sessionId);
    const existingItemIndex = cart.findIndex(
        (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += item.quantity || 1;
    } else {
        cart.push({ ...item, quantity: item.quantity || 1 });
    }
    return cart;
}

export function removeFromCart(sessionId, productId, size, color) {
    const cart = getCart(sessionId);
    const newCart = cart.filter(
        (i) =>
            !(i.productId === productId && i.size === size && i.color === color)
    );
    carts.set(sessionId, newCart);
    return newCart;
}

export function updateCartItem(sessionId, productId, size, color, quantity) {
    const cart = getCart(sessionId);
    const itemIndex = cart.findIndex(
        (i) =>
            i.productId === productId &&
            i.size === size &&
            i.color === color
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            return removeFromCart(sessionId, productId, size, color);
        }
        cart[itemIndex].quantity = quantity;
    }
    return cart;
}

export function clearCart(sessionId) {
    carts.set(sessionId, []);
}

// Calculations
export function calculateCartTotal(items) {
    return (items || []).reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
        return total + (Number(price) * (item.quantity || 1));
    }, 0);
}

export function getShippingCost(subtotal) {
    if (subtotal === 0) return 0;
    if (subtotal > 500) return 0;
    if (subtotal > 200) return 10;
    return 20;
}

export function calculateTax(subtotal, state = 'CA') {
    const taxRate = state === 'CA' ? 0.0825 : 0.07;
    return subtotal * taxRate;
}

// Database Operations
export async function createContactSubmission(data) {
    await connectDB();
    return await Contact.create(data);
}

export async function getContactSubmissions() {
    await connectDB();
    return await Contact.find({}).sort({ createdAt: -1 });
}

export async function createOrder(data) {
    await connectDB();
    return await Order.create(data);
}

export async function getAllOrders() {
    await connectDB();
    return await Order.find({}).sort({ createdAt: -1 });
}

export default connectDB;
