"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Loader2, User, Mail, LogOut, Camera, Settings, MapPin,
    Heart, ChevronRight, Package, Edit3, Shield, Bell, LogIn, ChevronLeft, Menu, Home, Truck
} from "lucide-react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

import { BackToHomeButton } from "@/components/ui/BackToHomeButton";
import { AccountDrawer } from "@/components/account/AccountDrawer";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const { user, logout, updateUser, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!user && !authLoading) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Load user data
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(null);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            await updateUser({ name, email, avatar: avatarPreview || undefined });
            setMessage("Profile updated successfully!");
            setIsEditing(false);
            setAvatarPreview(null);
        } catch (error) {
            setMessage("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`min-h-screen bg-white flex ${inter.className}`}>

            {/* --- Sidebar (Left Navigation) --- */}
            <AccountSidebar activePage="profile" />

            {/* --- Main Content Area --- */}
            <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">

                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
                            <Menu className="h-6 w-6 text-gray-900" />
                        </Button>
                        <span className="font-bold text-lg">My Profile</span>
                    </div>
                    <Link href="/">
                        <Home className="h-5 w-5 text-gray-900" />
                    </Link>
                </div>

                <div className="max-w-6xl">

                    {/* Header / Avatar Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-gray-100 bg-black flex items-center justify-center">
                            <span className="text-white text-2xl font-bold uppercase">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>

                        <div className="text-center md:text-left pt-2 flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{user.role === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="mt-4 md:mt-0 border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 rounded-xl"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Messages */}
                    {message && (
                        <Alert className="mb-8 bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-10">

                        {/* Personal Information Group */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-xs text-gray-400 font-medium ml-1">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-xs text-gray-400 font-medium ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-400 font-medium ml-1">Phone Number</Label>
                                    <Input
                                        value={user.phoneNumber || ''}
                                        placeholder="Not provided"
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs text-gray-400 font-medium ml-1">Location</Label>
                                    <Input
                                        placeholder="e.g. New York, USA"
                                        disabled={!isEditing || isSubmitting}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-700 disabled:opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences Group (Visual Only for this demo) */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Notifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-black shadow-sm">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Email Updates</span>
                                    </div>
                                    <div className="h-5 w-9 bg-black rounded-full relative cursor-pointer">
                                        <div className="h-3 w-3 bg-white rounded-full absolute top-1 right-1" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-black shadow-sm">
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                    </div>
                                    <div className="h-5 w-9 bg-gray-300 rounded-full relative cursor-pointer">
                                        <div className="h-3 w-3 bg-white rounded-full absolute top-1 left-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-12 px-10 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Mobile FAB Menu (Mimicking Navigation) */}
                <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
                        <Link href="/orders"><Package className="h-5 w-5" /></Link>
                    </Button>
                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
                        <Link href="/track-order"><Truck className="h-5 w-5" /></Link>
                    </Button>
                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
                        <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
                    </Button>
                </div>

            </main>

            <AccountDrawer isOpen={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen} activePage="profile" />
        </div>
    );
}