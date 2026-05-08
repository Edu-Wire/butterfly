import connectDB from "../lib/db.js";
import Settings from "../models/Settings.js";

export class SettingsController {
    static async getSettings(req, res) {
        try {
            await connectDB();
            let settings = await Settings.findOne();
            if (!settings) settings = await Settings.create({});
            return res.json({ success: true, data: settings });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch settings" });
        }
    }

    static async updateSettings(req, res) {
        try {
            await connectDB();
            let settings = await Settings.findOne();
            if (!settings) {
                settings = await Settings.create(req.body);
            } else {
                settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
            }
            return res.json({ success: true, data: settings, message: "Settings updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to update settings" });
        }
    }
}
