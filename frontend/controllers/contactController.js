import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/mail";

export class ContactController {

    // POST create contact submission
    static async create(request) {
        try {
            await connectDB();
            const body = await request.json();
            const { name, email, subject, message } = body;

            // Validate required fields
            if (!name || !email || !subject || !message) {
                return NextResponse.json(
                    { success: false, error: 'Missing required fields' },
                    { status: 400 }
                );
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { success: false, error: 'Invalid email address' },
                    { status: 400 }
                );
            }

            const submission = await Contact.create({
                name,
                email,
                subject,
                message,
            });

            // Send notification email to admin
            await sendEmail({
                to: "aishubamoriya@gmail.com",
                subject: `New Contact Form Submission: ${subject}`,
                html: `
                    <h3>New Inquiry from ${name}</h3>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `,
                text: `New Inquiry from ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
            });

            // Send confirmation email to user
            await sendEmail({
                to: email,
                subject: `We've received your message - Butterfly Couture`,
                html: `
                    <h3>Hello ${name},</h3>
                    <p>Thank you for reaching out to Butterfly Couture.</p>
                    <p>We've received your inquiry regarding "<strong>${subject}</strong>" and our team will get back to you within 24 hours.</p>
                    <br/>
                    <p>Best Regards,</p>
                    <p>Team Butterfly</p>
                `,
                text: `Hello ${name},\n\nThank you for reaching out to Butterfly Couture. We've received your inquiry regarding "${subject}" and our team will get back to you within 24 hours.\n\nBest Regards,\nTeam Butterfly`,
            });

            return NextResponse.json({
                success: true,
                data: submission,
                message: 'Your message has been received. We will get back to you soon.',
            });
        } catch (error) {
            console.error('[API] Contact POST error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to submit contact form' },
                { status: 500 }
            );
        }
    }

    // GET all contact submissions
    static async getAll(request) {
        try {
            await connectDB();
            // In a real app, this would require authentication
            // For demo purposes, we'll return all submissions
            const submissions = await Contact.find().sort({ createdAt: -1 });

            return NextResponse.json({
                success: true,
                data: submissions,
                count: submissions.length,
            });
        } catch (error) {
            console.error('[API] Contact GET error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch submissions' },
                { status: 500 }
            );
        }
    }
}
