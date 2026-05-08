import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            default: "Butterfly Couture",
        },
        contactEmail: {
            type: String,
            default: "hello@butterflycouture.com",
        },
        contactPhone: {
            type: String,
            default: "6009360597",
        },
        address: {
            line1: { type: String, default: "Opposite Mattei Building, KFC" },
            line2: { type: String, default: "Nongthymmai, Nongkhyriem" },
            city: { type: String, default: "Shillong" },
            state: { type: String, default: "Meghalaya" },
            pincode: { type: String, default: "793014" },
            country: { type: String, default: "India" },
        },
        businessHours: {
            weekday: { type: String, default: "Mon-Fri 9AM-6PM IST" },
            weekend: { type: String, default: "By appointment only" },
        },
        socialLinks: {
            instagram: String,
            facebook: String,
            twitter: String,
        },
        logo: String,
        announcement: String,
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
