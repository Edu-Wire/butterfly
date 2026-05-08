'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    User, Package, Heart, MapPin, Settings, LogOut, Home, Truck, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccountSidebarProps {
    activePage?: 'dashboard' | 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings' | 'track-order';
}

export function AccountSidebar({ activePage }: AccountSidebarProps) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const navigationItems = [
        { href: '/account', icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
        { href: '/profile', icon: User, label: 'Profile', id: 'profile' },
        { href: '/orders', icon: Package, label: 'Orders', id: 'orders' },
        { href: '/track-order', icon: Truck, label: 'Track Order', id: 'track-order' },
        { href: '/wishlist', icon: Heart, label: 'Wishlist', id: 'wishlist' },
        { href: '/addresses', icon: MapPin, label: 'Addresses', id: 'addresses' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 pt-8 pb-6 px-0 border-r border-gray-100 lg:sticky lg:top-0 h-screen bg-white">

            {/* Header */}
            <div className="px-6 mb-8 flex justify-between items-center">
                <h1 className="text-lg font-medium text-gray-900 tracking-tight">Account</h1>
                <Link href="/" className="p-2 hover:bg-gray-50 rounded-full transition-all duration-200">
                    <Home className="w-4 h-4 text-gray-500 hover:text-gray-900" strokeWidth={1.5} />
                </Link>
            </div>

            {/* Profile Summary */}
            <div className="text-center mb-8 px-6">
                <div className="relative h-16 w-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-100 bg-black flex items-center justify-center">
                    <span className="text-white text-xl font-bold uppercase">
                        {user?.name?.charAt(0) || 'U'}
                    </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 tracking-wide mb-0.5">
                    {user?.name || 'Guest User'}
                </h3>
                <p className="text-xs text-gray-500">
                    {user?.email || 'Not logged in'}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
                <div className="space-y-1">
                    {navigationItems.map((link) => {
                        const isActive = activePage === link.id;
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${isActive
                                    ? 'bg-gray-50 text-gray-900 font-medium'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <link.icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                                <span className="text-xs uppercase tracking-widest">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="px-4 mt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs tracking-widest uppercase transition-all duration-200"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}