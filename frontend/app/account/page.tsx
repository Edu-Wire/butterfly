"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, Package, Heart, MapPin, Settings, 
    ChevronRight, ShoppingBag, Truck, User, ArrowRight,
    Clock, Star, CreditCard, Menu, Home
} from "lucide-react";
import { Inter } from "next/font/google";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountDrawer } from "@/components/account/AccountDrawer";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export default function AccountDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        orders: 0,
        wishlist: 0,
        savedAddresses: 0
    });

    // Set page title for SEO
    useEffect(() => {
        document.title = "Account Dashboard | Butterfly Couture";
    }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!user && !authLoading) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // In a real app, we'd fetch these from APIs
    useEffect(() => {
        if (user) {
            // Mock data for now, ideally fetch from /api/user/stats
            setStats({
                orders: 12,
                wishlist: 8,
                savedAddresses: 2
            });
        }
    }, [user]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className={`min-h-screen bg-white flex ${inter.className}`}>
            {/* --- Sidebar (Left Navigation) --- */}
            <AccountSidebar activePage="dashboard" />

            {/* --- Main Content Area --- */}
            <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">
                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
                            <Menu className="h-6 w-6 text-gray-900" />
                        </Button>
                        <span className="font-bold text-lg tracking-tight uppercase">Dashboard</span>
                    </div>
                    <Link href="/">
                        <Home className="h-5 w-5 text-gray-900" />
                    </Link>
                </div>

                <motion.div 
                    className="max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Section */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">{user.name.split(' ')[0]}!</span>
                        </h1>
                        <p className="text-gray-500">Manage your orders, addresses, and account settings from your dashboard.</p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Link href="/orders" className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <Package className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.orders}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</div>
                        </Link>

                        <Link href="/wishlist" className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.wishlist}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Wishlist</div>
                        </Link>

                        <Link href="/addresses" className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.savedAddresses}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Addresses</div>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Recent Orders Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Recent Orders</h3>
                                <Link href="/orders" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest flex items-center gap-1 group">
                                    View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {/* Mock Order 1 */}
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Order #BF-29384</div>
                                            <div className="text-xs text-gray-500 mt-1">Placed on Oct 24, 2023 • 2 Items</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-900">₹4,999.00</div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-tighter mt-1">
                                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                                Processing
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 text-xs font-bold uppercase tracking-widest py-5 px-6">
                                            Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Mock Order 2 */}
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Order #BF-29102</div>
                                            <div className="text-xs text-gray-500 mt-1">Placed on Oct 12, 2023 • 1 Item</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-900">₹2,450.00</div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-tighter mt-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                Delivered
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 text-xs font-bold uppercase tracking-widest py-5 px-6">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Empty State Illustration would go here if no orders */}
                        </motion.div>

                        {/* Side Actions / Quick Links */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/track-order" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <Truck className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Track an Order</span>
                                    </Link>
                                    <Link href="/profile" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <User className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Update Profile</span>
                                    </Link>
                                    <Link href="/settings" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <CreditCard className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Payment Methods</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-stone-900 rounded-2xl text-white">
                                <div className="flex items-center gap-2 text-amber-400 mb-2">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Member Gold</span>
                                </div>
                                <h4 className="text-lg font-bold mb-2">Exclusive Access</h4>
                                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                                    You have 1,240 Butterfly Points. Shop more to reach Platinum status!
                                </p>
                                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest py-6">
                                    Redeem Now
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <AccountDrawer isOpen={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen} activePage="dashboard" />
        </div>
    );
}
