import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
        },
        subject: String,
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["unread", "read", "replied"],
            default: "unread",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
