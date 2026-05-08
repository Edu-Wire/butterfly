import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export class SettingsController {
    static async getSettings() {
        try {
            await connectDB();
            let settings = await Settings.findOne();
            if (!settings) {
                // Return default settings if none exist
                settings = await Settings.create({});
            }
            return NextResponse.json({ success: true, data: settings });
        } catch (error) {
            console.error('[API] Settings GET error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }
    }

    static async updateSettings(request) {
        try {
            await connectDB();
            const body = await request.json();

            let settings = await Settings.findOne();
            if (!settings) {
                settings = await Settings.create(body);
            } else {
                settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
            }

            return NextResponse.json({
                success: true,
                data: settings,
                message: 'Settings updated successfully'
            });
        } catch (error) {
            console.error('[API] Settings PUT error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to update settings' },
                { status: 500 }
            );
        }
    }
}
