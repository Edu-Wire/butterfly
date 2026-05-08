'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingBag, X, Heart, Loader2, Menu, Home
} from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";

import { AccountDrawer } from "@/components/account/AccountDrawer";
import { AccountSidebar } from "@/components/account/AccountSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function WishlistPage() {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { user, isLoading: authLoading } = useAuth();
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

    const removeFromWishlistHandler = async (wishlistItemId: string) => {
        try {
            await removeFromWishlist(wishlistItemId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-300" strokeWidth={2} />
            </div>
        );
    }

    if (!user) {
        return (
            <main className={`h-screen bg-white flex items-center justify-center ${inter.className}`}>
                <div className="max-w-sm mx-auto px-6 text-center">
                    <Heart className="w-6 h-6 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Please Login</h2>
                    <p className="text-sm text-gray-500 mb-8">You need to be logged into your account to view your wishlist.</p>
                    <Button asChild className="w-full h-10 bg-black hover:bg-gray-800 text-white rounded-none text-xs tracking-widest uppercase transition-all">
                        <Link href="/login">
                            Login
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <div className={`h-screen overflow-hidden bg-white flex ${inter.className}`}>

            {/* --- Desktop Sidebar --- */}
            <div className="hidden lg:block h-full flex-shrink-0 border-r border-gray-100">
                <AccountSidebar activePage="wishlist" />
            </div>

            {/* --- Main Content Area --- */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth">
                <div className="p-4 sm:p-8 lg:px-12 lg:py-10 max-w-7xl mx-auto">
                    
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setIsAccountDrawerOpen(true)} className="-ml-2">
                                <Menu className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
                            </Button>
                            <span className="font-medium text-base text-gray-900 tracking-wide">Wishlist</span>
                        </div>
                        <Link href="/" className="p-2">
                            <Home className="h-4 w-4 text-gray-600" strokeWidth={1.5} />
                        </Link>
                    </div>

                    {/* Desktop Header Title */}
                    <div className="hidden lg:flex items-baseline justify-between mb-10 border-b border-gray-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-900 tracking-tight">Wishlist</h1>
                            <p className="text-gray-500 mt-1 text-sm">({wishlistItems.length} items)</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="text-center py-32 px-4">
                            <Heart className="h-8 w-8 text-gray-200 mx-auto mb-4" strokeWidth={1} />
                            <h3 className="text-base font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                                Save your favorite items here to review them later.
                            </p>
                            <Button asChild variant="outline" className="h-10 px-8 text-xs font-medium tracking-widest uppercase rounded-none border-gray-200 hover:bg-gray-50">
                                <Link href="/">
                                    Explore Store
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 pb-20 lg:pb-0">
                            {wishlistItems.filter(item => item.product).map((item) => (
                                <div key={item._id} className="group relative flex flex-col">
                                    
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromWishlistHandler(item._id)}
                                        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 hover:bg-white text-gray-400 hover:text-red-500 rounded-full transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>

                                    {/* Product Image */}
                                    <Link href={`/product/${item.product._id}`} className="relative aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
                                        {item.product.images?.[0] ? (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover object-top transition-opacity duration-500 group-hover:opacity-90"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex flex-col px-1">
                                        <div className="mb-1">
                                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400">
                                                {item.product.category || 'Collection'}
                                            </span>
                                        </div>
                                        <Link href={`/product/${item.product._id}`}>
                                            <h3 className="text-xs sm:text-sm text-gray-800 font-normal line-clamp-1 pr-4">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="mt-1">
                                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                ₹{item.product.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <AccountDrawer 
                isOpen={isAccountDrawerOpen} 
                onOpenChange={setIsAccountDrawerOpen} 
                activePage="wishlist" 
            />
        </div>
    );
}