'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Package, Heart, MapPin, Settings, LogOut, X, Menu, Truck, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccountDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    activePage?: 'dashboard' | 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings' | 'track-order';
}

export function AccountDrawer({ isOpen, onOpenChange, activePage }: AccountDrawerProps) {
    const { user, logout } = useAuth();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Body Scroll Lock
    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (isOpen) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            htmlElement.style.overflow = 'hidden';
            bodyElement.style.position = 'fixed';
            bodyElement.style.top = `-${scrollY}px`;
            bodyElement.style.width = `calc(100vw - ${scrollbarWidth}px)`;
            bodyElement.style.overflow = 'hidden';
            bodyElement.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            const scrollY = bodyElement.style.top;
            htmlElement.style.overflow = '';
            bodyElement.style.position = '';
            bodyElement.style.top = '';
            bodyElement.style.width = '';
            bodyElement.style.overflow = '';
            bodyElement.style.paddingRight = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const navigationItems = [
        { href: '/account', icon: LayoutDashboard, label: 'Dashboard', section: 'account' },
        { href: '/profile', icon: User, label: 'Profile', section: 'account' },
        { href: '/orders', icon: Package, label: 'Orders', section: 'shopping' },
        { href: '/track-order', icon: Truck, label: 'Track Order', section: 'shopping' },
        { href: '/wishlist', icon: Heart, label: 'Wishlist', section: 'shopping' },
        { href: '/addresses', icon: MapPin, label: 'Addresses', section: 'settings' },
        { href: '/settings', icon: Settings, label: 'Settings', section: 'settings' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-[101] flex flex-col lg:hidden"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent uppercase tracking-widest">Account</h2>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Profile Summary in Drawer */}
                            <div className="text-center mb-10 mt-4">
                                <div className="relative h-24 w-24 mx-auto mb-4 group">
                                    <Image
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff`}
                                        alt={user?.name || 'User'}
                                        width={96}
                                        height={96}
                                        className="rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{user?.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{user?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {navigationItems.map((link) => {
                                    const isActive = (activePage === 'dashboard' && link.href === '/account') || link.href === `/${activePage}`;
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => onOpenChange(false)}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isActive
                                                    ? 'bg-black text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <link.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all duration-300"
                            >
                                <LogOut size={16} strokeWidth={2.5} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
