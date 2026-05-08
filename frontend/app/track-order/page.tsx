"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountDrawer } from "@/components/account/AccountDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, Menu, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const STAGES = [
    { title: "Order Placed", description: "Your order has been received", icon: Clock },
    { title: "Processing", description: "We are preparing your package", icon: Package },
    { title: "Shipped", description: "Your package is on the way", icon: Truck },
    { title: "Out for Delivery", description: "Package is arriving today", icon: MapPin },
    { title: "Delivered", description: "Successfully delivered", icon: CheckCircle },
];

function TrackOrderContent() {
    const { user, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");
    const [trackingData, setTrackingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleTrack = async (e?: React.FormEvent, idToTrack?: string) => {
        if (e) e.preventDefault();
        const targetId = idToTrack || orderId;
        if (!targetId) return;

        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/orders/${targetId}`);
            const data = await response.json();
            if (data.success) {
                setTrackingData(data.data);
            } else {
                setError("Order not found. Please check your Order ID.");
                setTrackingData(null);
            }
        } catch (err) {
            setError("Failed to fetch order details.");
            setTrackingData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-track if ID is in URL
    useEffect(() => {
        const id = searchParams.get("orderId");
        if (id) {
            setOrderId(id);
            handleTrack(undefined, id);
        }
    }, [searchParams]);

    const getCurrentStage = (status: string) => {
        switch (status?.toLowerCase()) {
            case "placed":
            case "pending":
                return 0;
            case "processing":
                return 1;
            case "shipped":
                return 2;
            case "out for delivery":
                return 3;
            case "delivered":
                return 4;
            default:
                return 0;
        }
    };

    const currentStage = trackingData ? getCurrentStage(trackingData.status) : -1;

    return (
        <div className={`min-h-screen bg-white flex ${inter.className}`}>
            <AccountSidebar activePage="track-order" />

            <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
                            <Menu className="h-6 w-6 text-gray-900" />
                        </Button>
                        <span className="font-bold text-lg">Track Order</span>
                    </div>
                    <Link href="/">
                        <Home className="h-5 w-5 text-gray-900" />
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                        <p className="text-gray-500">Enter your Order ID to see the current status of your shipment.</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
                        <form onSubmit={(e) => handleTrack(e)} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Enter Order ID (e.g. ORD-12345)"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="pl-12 h-14 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !orderId}
                                className="h-14 px-8 bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg shadow-black/10 transition-all"
                            >
                                {isLoading ? "Searching..." : "Track Now"}
                            </Button>
                        </form>
                        {error && <p className="mt-3 text-red-500 text-sm font-medium ml-1">{error}</p>}
                    </div>

                    {trackingData && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Order Info Card */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-wrap justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order ID</p>
                                        <h3 className="text-lg font-bold text-gray-900">#{trackingData.orderId}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Estimated Delivery</p>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {new Date(new Date(trackingData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status</p>
                                        <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-tighter">
                                            {trackingData.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full mb-8" />

                                {/* Tracking Timeline (5 Stages) */}
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 lg:left-0 lg:right-0 lg:top-6 lg:bottom-auto lg:h-0.5 lg:w-full">
                                        <div
                                            className="absolute left-0 top-0 w-full bg-black transition-all duration-1000 lg:h-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                            style={{
                                                height: typeof window !== 'undefined' && window.innerWidth < 1024 ? `${(currentStage / (STAGES.length - 1)) * 100}%` : '100%',
                                                width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${(currentStage / (STAGES.length - 1)) * 100}%` : '100%'
                                            }}
                                        />
                                    </div>

                                    <div className="relative flex flex-col lg:flex-row justify-between gap-8">
                                        {STAGES.map((stage, index) => {
                                            const Icon = stage.icon;
                                            const isCompleted = index <= currentStage;
                                            const isCurrent = index === currentStage;

                                            return (
                                                <div key={index} className="flex lg:flex-col items-start lg:items-center text-left lg:text-center group flex-1">
                                                    <div className={`
                                                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500
                                                        ${isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}
                                                        ${isCurrent ? 'ring-4 ring-black/10 scale-110' : ''}
                                                    `}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="ml-4 lg:ml-0 lg:mt-4">
                                                        <h4 className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {stage.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                                                            {stage.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Item Details */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Package Contents</h3>
                                <div className="space-y-4">
                                    {trackingData.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                                            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-300">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.size || 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">Rp {item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {!trackingData && !isLoading && !error && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-bold mb-2">No Tracking Info Shown</h3>
                            <p className="text-gray-500 text-sm">Enter your order ID above to see the journey of your package.</p>
                        </div>
                    )}
                </div>
            </main>

            <AccountDrawer isOpen={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen} activePage="track-order" />
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
