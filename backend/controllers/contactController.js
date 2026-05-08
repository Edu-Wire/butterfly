import { connectDB } from "../lib/db.js";
import Contact from "../models/Contact.js";
import { sendEmail } from "../lib/mail.js";

export class ContactController {
    static async create(req, res) {
        try {
            await connectDB();
            const { name, email, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ success: false, error: "Invalid email address" });
            }

            const submission = await Contact.create({ name, email, subject, message });

            await sendEmail({
                to: "aishubamoriya@gmail.com",
                subject: `New Contact Form Submission: ${subject}`,
                html: `<h3>New Inquiry from ${name}</h3><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
                text: `New Inquiry from ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
            });

            await sendEmail({
                to: email,
                subject: `We've received your message - Butterfly Couture`,
                html: `<h3>Hello ${name},</h3><p>Thank you for reaching out to Butterfly Couture.</p><p>We've received your inquiry regarding "<strong>${subject}</strong>" and our team will get back to you within 24 hours.</p><br/><p>Best Regards,</p><p>Team Butterfly</p>`,
                text: `Hello ${name},\n\nThank you for reaching out to Butterfly Couture. We've received your inquiry regarding "${subject}" and our team will get back to you within 24 hours.\n\nBest Regards,\nTeam Butterfly`,
            });

            return res.json({
                success: true,
                data: submission,
                message: "Your message has been received. We will get back to you soon.",
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to submit contact form" });
        }
    }

    static async getAll(req, res) {
        try {
            await connectDB();
            const submissions = await Contact.find().sort({ createdAt: -1 });
            return res.json({ success: true, data: submissions, count: submissions.length });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch submissions" });
        }
    }
}
