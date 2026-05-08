import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ReturnRequest from "@/models/ReturnRequest";
import Order from "@/models/Order";
import Contact from "@/models/Contact";
import User from "@/models/User";
import { Types } from "mongoose";

export class ReturnRequestController {
    // CREATE RETURN REQUEST
    static async create(req) {
        try {
            await connectDB();
            const body = await req.json();
            const {
                orderId,
                orderObjectId,
                userId,
                items,
                customerReason,
                images
            } = body;

            // Validate required fields
            if (!orderId || !orderObjectId || !userId || !items?.length) {
                return NextResponse.json(
                    { success: false, error: 'Missing required fields' },
                    { status: 400 }
                );
            }

            // Check if order exists and is delivered
            const order = await Order.findById(orderObjectId);
            if (!order) {
                return NextResponse.json(
                    { success: false, error: 'Order not found' },
                    { status: 404 }
                );
            }

            // Optional: check order status
            // if (order.status !== 'delivered') {
            //     return NextResponse.json(
            //         { success: false, error: 'Only delivered orders can be returned' },
            //         { status: 400 }
            //     );
            // }

            // Create return request
            const returnRequest = await ReturnRequest.create({
                orderId,
                orderObjectId,
                userId,
                items,
                customerReason,
                images,
                status: 'pending'
            });

            // Create notification (simulating email)
            try {
                const user = await User.findById(userId);
                if (user) {
                    await Contact.create({
                        name: user.name,
                        email: user.email,
                        subject: `Return Request Received: ${orderId}`,
                        message: `We have received your return request for Order ${orderId}. We will review it and get back to you within 2-3 business days.`,
                    });
                }
            } catch (notifErr) {
                console.error('Error creating return notification:', notifErr);
            }

            return NextResponse.json({
                success: true,
                data: returnRequest,
                message: 'Return request submitted successfully. We will review it and get back to you.',
            });
        } catch (error) {
            console.error('[API] Returns POST error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to submit return request' },
                { status: 500 }
            );
        }
    }

    // GET ALL RETURN REQUESTS (Filter by userId for customers)
    static async getAll(req) {
        try {
            await connectDB();
            const url = new URL(req.url);
            const userId = url.searchParams.get('userId');
            let query = {};
            if (userId && Types.ObjectId.isValid(userId)) {
                query = { userId: userId };
            }
            
            const returns = await ReturnRequest.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
            
            return NextResponse.json({
                success: true,
                data: returns,
                count: returns.length,
            });
        } catch (error) {
            console.error('[API] Returns GET error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to fetch return requests' },
                { status: 500 }
            );
        }
    }

    // UPDATE RETURN REQUEST STATUS (Admin)
    static async updateStatus(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const body = await req.json();
            const { status, adminNotes, refundAmount } = body;

            const returnRequest = await ReturnRequest.findById(id);
            if (!returnRequest) {
                return NextResponse.json({ success: false, error: "Return request not found" }, { status: 404 });
            }

            returnRequest.status = status || returnRequest.status;
            returnRequest.adminNotes = adminNotes || returnRequest.adminNotes;
            if (refundAmount !== undefined) {
                returnRequest.refundAmount = refundAmount;
            }

            await returnRequest.save();

            // Create notification for status update
            try {
                const user = await User.findById(returnRequest.userId);
                if (user) {
                    await Contact.create({
                        name: user.name,
                        email: user.email,
                        subject: `Return Request ${status.toUpperCase()}: ${returnRequest.orderId}`,
                        message: `The status of your return request for Order ${returnRequest.orderId} has been updated to: ${status.toUpperCase()}. ${adminNotes ? `Admin Notes: ${adminNotes}` : ''}`,
                    });
                }
            } catch (notifErr) {
                console.error('Error creating return status update notification:', notifErr);
            }

            // If status is 'refunded', we might want to update the order status as well
            if (status === 'refunded') {
                const order = await Order.findById(returnRequest.orderObjectId);
                if (order) {
                    order.paymentStatus = 'refunded';
                    await order.save();
                }
            }

            return NextResponse.json({ success: true, data: returnRequest });
        } catch (error) {
            console.error('[API] Returns PATCH error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    // GET BY ID
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const returnRequest = await ReturnRequest.findById(id);

            if (!returnRequest) {
                return NextResponse.json({ success: false, error: "Return request not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: returnRequest });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}
