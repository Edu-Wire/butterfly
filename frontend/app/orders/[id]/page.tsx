"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, MapPin, CreditCard, Package, Star } from "lucide-react";
import { showToast } from '@/lib/toast-utils';
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const { user, token, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Rating State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!user && !authLoading) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data = await response.json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const handleSubmitReview = async () => {
        if (!selectedProduct) return;
        setIsSubmittingReview(true);
        try {
            const response = await fetch(`/api/products/${selectedProduct.productId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating,
                    reviewText,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                showToast.success("Review submitted successfully!");
                setModalOpen(false);
                setReviewText("");
                setRating(5);
            } else {
                showToast.error(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            showToast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Order Not Found</h1>
                <Button asChild>
                    <Link href="/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <AccountSidebar activePage="orders" />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="mb-6">
                            <Link href="/orders" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Orders
                            </Link>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderId}</h1>
                                    <p className="text-gray-500 mt-1">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <Badge className={`text-sm px-3 py-1 capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                        'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                    }`}>
                                    {order.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {/* Order Items */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Items</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-semibold text-lg">{item.name}</p>
                                                    <div className="text-sm text-gray-500 space-x-2">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>•</span>
                                                        <span>Price: ₹{item.price.toLocaleString()}</span>
                                                    </div>
                                                    {(item.size || item.color || item.customSize) && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {item.size && `Size: ${item.size}`}
                                                            {item.size && (item.color || item.customSize) && ' | '}
                                                            {item.color && `Color: ${item.color}`}
                                                            {item.color && item.customSize && ' | '}
                                                            {item.customSize && (
                                                                <div className="text-black font-medium mt-1">
                                                                    <strong>Custom Size ({item.customSize.unit}):</strong><br />
                                                                    Chest: {item.customSize.chest}, Waist: {item.customSize.waist}, Shoulder: {item.customSize.shoulder},
                                                                    Sleeve: {item.customSize.sleeveLength}, Length: {item.customSize.length}, Fit: {item.customSize.fit}
                                                                    {item.customSize.notes && <><br /><strong>Notes:</strong> {item.customSize.notes}</>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>

                                                    {/* Review Button - Only if Delivered */}
                                                    {order.status === 'delivered' && (
                                                        <Dialog open={modalOpen && selectedProduct?.productId === item.productId} onOpenChange={(open) => {
                                                            setModalOpen(open);
                                                            if (!open) setSelectedProduct(null);
                                                        }}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedProduct(item);
                                                                        setModalOpen(true);
                                                                    }}
                                                                >
                                                                    <Star className="h-4 w-4 mr-2" />
                                                                    Review
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Rate & Review</DialogTitle>
                                                                    <DialogDescription>
                                                                        Share your experience with {item.name}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div>
                                                                        <Label>Rating</Label>
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                <button
                                                                                    key={star}
                                                                                    type="button"
                                                                                    onClick={() => setRating(star)}
                                                                                    className={`p-1 focus:outline-none transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                >
                                                                                    <Star className="h-8 w-8 fill-current" />
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="review">Review</Label>
                                                                        <Textarea
                                                                            id="review"
                                                                            placeholder="Write your review here..."
                                                                            value={reviewText}
                                                                            onChange={(e) => setReviewText(e.target.value)}
                                                                            className="mt-2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button onClick={handleSubmitReview} disabled={isSubmittingReview}>
                                                                        {isSubmittingReview ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Submitting...
                                                                            </>
                                                                        ) : (
                                                                            'Submit Review'
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary & Address */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span>₹{order.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Shipping</span>
                                            <span>₹0</span> {/* Assuming free shipping or included */}
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{order.total.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
                                        <p>{order.shipping.address}</p>
                                        <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
                                        <p>{order.shipping.country}</p>
                                        <p className="text-gray-500 mt-2">{order.shipping.phone}</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Payment Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Method</span>
                                            <span className="font-medium uppercase">{order.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status</span>
                                            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
