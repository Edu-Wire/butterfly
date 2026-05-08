"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from '@/lib/toast-utils';
import { Label } from "@/components/ui/label";
import {
  Loader2, MapPin, Pencil, Plus, User, Package,
  Heart, Settings, LogOut, Menu, ChevronLeft, Home
} from "lucide-react";
import { Inter } from "next/font/google";

import { BackToHomeButton } from "@/components/ui/BackToHomeButton";
import { AccountDrawer } from "@/components/account/AccountDrawer";
import { AccountSidebar } from "@/components/account/AccountSidebar";

const inter = Inter({ subsets: ["latin"] });

type AddressForm = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function AddressesPage() {
  const { user, updateUser, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  // Initialize form
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Populate form data
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.name || "",
        phone: user.phoneNumber || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || "",
        country: user.address?.country || "India",
      });
    }
  }, [user, dialogOpen]);

  // Auth redirect
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        }),
      });

      if (response.ok) {
        // Update local context
        updateUser({
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country
          }
        });
        setDialogOpen(false);
      } else {
        showToast.error("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast.error("An error occurred while saving the address.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const hasAddress = user.address && (user.address.street || user.address.city);

  return (
    <div className={`min-h-screen bg-white flex ${inter.className}`}>

      {/* --- Desktop Sidebar --- */}
      <AccountSidebar activePage="addresses" />

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">

        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsAccountDrawerOpen(true)}>
              <Menu className="h-6 w-6 text-gray-900" />
            </Button>
            <span className="font-bold text-lg">My Addresses</span>
          </div>
          <Link href="/">
            <Home className="h-5 w-5 text-gray-900" />
          </Link>
        </div>

        <div className="max-w-6xl">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-6">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Saved Addresses</CardTitle>
                <CardDescription className="mt-2 text-gray-500">Manage where you receive your orders</CardDescription>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {hasAddress ? "Edit Address" : "Add New Address"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">{hasAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">

                    {/* Full Name & Phone Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input
                          id="fullName"
                          value={form.fullName}
                          disabled
                          className="h-12 bg-gray-50 border-gray-200 font-medium text-gray-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          disabled
                          className="h-12 bg-gray-50 border-gray-200 font-medium text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-3">
                      <Label htmlFor="street" className="text-sm font-semibold text-gray-700">Street Address</Label>
                      <Input
                        id="street"
                        value={form.street}
                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                        required
                        placeholder="House No, Street Name"
                        className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                      />
                    </div>

                    {/* City & State Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Zip & Country Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="zip" className="text-sm font-semibold text-gray-700">Postal Code</Label>
                        <Input
                          id="zip"
                          value={form.zip}
                          onChange={(e) => setForm({ ...form, zip: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country</Label>
                        <Input
                          id="country"
                          value={form.country}
                          onChange={(e) => setForm({ ...form, country: e.target.value })}
                          required
                          className="h-12 border-gray-200 focus:border-black focus:ring-black bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-6 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        className="h-12 px-6 border-gray-200 text-gray-600 hover:text-black hover:border-black hover:bg-white transition-all duration-300 font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-12 px-6 bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              {hasAddress ? (
                <div className="rounded-xl border border-gray-200 p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl text-gray-900">{user.name}</h3>
                        <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-3 py-1.5 rounded-full font-bold">Default</span>
                      </div>
                      <p className="text-gray-500 font-medium">{user.phoneNumber}</p>
                      <div className="text-sm text-gray-500 mt-4 space-y-1">
                        <p className="font-medium">{user.address?.street}</p>
                        <p className="font-medium">{user.address?.city}, {user.address?.state} {user.address?.zip}</p>
                        <p className="font-medium">{user.address?.country}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-white transition-all duration-300 font-medium"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No address added</h3>
                  <p className="text-gray-500 mb-8 font-medium">Add a shipping address to speed up checkout.</p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AccountDrawer isOpen={isAccountDrawerOpen} onOpenChange={setIsAccountDrawerOpen} activePage="addresses" />
    </div>
  );
}