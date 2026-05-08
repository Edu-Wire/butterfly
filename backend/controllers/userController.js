import { verifyToken } from "../lib/jwt.js";
import connectDB from "../lib/db.js";
import User from "../models/User.js";

export class UserController {
    static async updateAddress(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ error: "Unauthorized" });

            const decoded = verifyToken(token);
            if (!decoded) return res.status(401).json({ error: "Invalid token" });

            await connectDB();
            const { street, city, state, zip, country } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                decoded.userId,
                { address: { street, city, state, zip, country } },
                { returnDocument: "after" }
            ).select("-password");

            if (!updatedUser) return res.status(404).json({ error: "User not found" });

            return res.json({ success: true, user: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
