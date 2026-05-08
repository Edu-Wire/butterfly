"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Inter } from "next/font/google";
import {
  Loader2, Package, User, Heart, MapPin, Settings, LogOut, Star, ChevronLeft, Menu, Home, Truck
} from "lucide-react";
import { BackToHomeButton } from "@/components/ui/BackToHomeButton";
import { AccountDrawer } from "@/components/account/AccountDrawer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { useToast } from "@/hooks/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function OrdersPage() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<{ [key: string]: string }>({});
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Return Modal State
  const [returnOpen, setReturnOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<any>(null);
  const [returnItem, setReturnItem] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const openReturnModal = (order: any, item: any) => {
    setSelectedOrderForReturn(order);
    setReturnItem(item);
    setReturnReason("");
    setReturnOpen(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedOrderForReturn || !returnItem) return;

    setIsSubmittingReturn(true);
    try {
      const userId = user?.id || (user as any)?._id;
      if (!userId) return;

      const response = await fetch("/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedOrderForReturn.orderId,
          orderObjectId: selectedOrderForReturn._id,
          userId: userId,
          items: [{
            productId: typeof returnItem.productId === 'object' ? returnItem.productId._id : returnItem.productId,
            name: returnItem.name,
            quantity: returnItem.quantity,
            price: returnItem.price,
            size: returnItem.size,
            color: returnItem.color,
            reason: returnReason
          }],
          customerReason: returnReason
        })
      });

      if (response.ok) {
        setReturnOpen(false);
        toast({
          title: "Return Request Submitted",
          description: "We will review your request and get back to you shortly.",
        });
      } else {
        const errData = await response.json();
        toast({
          title: "Return Request Failed",
          description: errData.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your return.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const openReviewModal = (item: any) => {
    const pId = typeof item.productId === 'object' ? (item.productId as any)._id : item.productId;
    setSelectedItem({ ...item, productId: pId });
    setRating(5);
    setReviewText("");
    setReviewOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedItem || !selectedItem.productId) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedItem.productId,
          rating,
          reviewText
        })
      });

      if (response.ok) {
        setReviewOpen(false);
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        const errData = await response.json();
        toast({
          title: "Review Failed",
          description: errData.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userId = user.id || (user as any)._id;
          const queryParams = new URLSearchParams();
          if (userId) queryParams.append('userId', userId);
          if (user.email) queryParams.append('email', user.email);

          const response = await fetch(`/api/orders?${queryParams.toString()}`);
          const data = await response.json();
          if (data.success) {
            setOrders(data.data);

            // After orders are loaded, fetch product images
            const allProductIds = new Set<string>();
            data.data.forEach((order: any) => {
              order.items.forEach((item: any) => {
                if (item.productId) {
                  allProductIds.add(item.productId);
                }
              });
            });

            const fetchProductImages = async () => {
              const imageMap: { [key: string]: string } = {};

              for (const productId of allProductIds) {
                try {
                  const response = await fetch(`/api/products/${productId}`);
                  if (response.ok) {
                    const product = await response.json();
                    // Use imageUrl field from API response (line 175 in productController.js)
                    const imageUrl = product.data?.imageUrl || product.data?.image || product.imageUrl || product.image;
                    if (imageUrl) {
                      imageMap[productId] = imageUrl;
                    }
                  }
                } catch (error) {
                  console.error(`Failed to fetch product ${productId}:`, error);
                }
              }

              setProductImages(imageMap);
            };

            fetchProductImages();
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

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

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-white flex ${inter.className}`}>

      {/* --- Sidebar (Left Navigation) --- */}
      <AccountSidebar activePage="orders" />

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 lg:px-10 lg:py-8 overflow-y-auto">

        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsAccountDrawerOpen(true)}>
              <Menu className="h-6 w-6 text-gray-900" />
            </Button>
            <span className="font-bold text-lg">My Orders</span>
          </div>
          <Link href="/">
            <Home className="h-5 w-5 text-gray-900" />
          </Link>
        </div>

        <div className="max-w-6xl px-4 sm:px-6">

          {/* Desktop Header Title */}
          <div className="hidden lg:flex items-baseline justify-between mb-10 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">Orders</h1>
              <p className="text-gray-500 mt-1 text-sm">({orders.length} items)</p>
            </div>
          </div>

          {/* Orders List - Only Cards */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No orders yet</h3>
              <p className="text-gray-500 mb-8 font-medium text-sm px-4">Start shopping to see your order history here.</p>
              <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95 px-8 py-3">
                <Link href="/" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative">
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {order.status}
                    </span>
                    {order.deliveryStatus && (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.deliveryStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {order.deliveryStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-4 pr-32">
                    <div className="flex items-start gap-4">
                      {(() => {
                        const firstItem = order.items[0];
                        const productId = typeof firstItem.productId === 'object' ? (firstItem.productId as any)._id : firstItem.productId;
                        const imageUrl = productImages[productId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstItem?.name || 'Product')}&background=000&color=fff&size=64`;

                        return (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={firstItem?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{order.items[0]?.name || 'Product'}</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-200" />
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                            {(item.size || item.color) && (
                              <span className="text-xs text-gray-400">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' | '}
                                {item.color && `Color: ${item.color}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <span className="block text-sm font-semibold text-gray-900">₹{item.price.toLocaleString()}</span>
                          {(order.status !== 'cancelled') && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-xs h-auto p-0 text-black mt-1 font-semibold hover:text-gray-700 transition-colors"
                              onClick={() => openReviewModal(item)}
                            >
                              Rate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500 font-medium text-center py-2">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 flex flex-col sm:flex-row gap-3">
                    {order.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReturnModal(order, order.items[0])}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium w-full sm:w-auto"
                      >
                        Return Order
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium w-full sm:w-auto">
                      <Link href={`/orders/${order._id}`}>
                        View Details
                      </Link>
                    </Button>
                    {order.status !== 'cancelled' && (
                      <Button variant="outline" size="sm" asChild className="bg-black text-white hover:bg-gray-800 border-black transition-all duration-300 font-medium w-full sm:w-auto">
                        <Link href={`/track-order?orderId=${order.orderId}`}>
                          Track
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile FAB Menu */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
          <Link href="/profile"><User className="h-5 w-5" /></Link>
        </Button>
        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
          <Link href="/track-order"><Truck className="h-5 w-5" /></Link>
        </Button>
        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200" asChild>
          <Link href="/wishlist"><Heart className="h-5 w-5" /></Link>
        </Button>
      </div>

      {/* Review Modal - Needs to be outside main/sidebar structure but inside the wrapper */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Rate & Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="rating" className="text-sm font-semibold text-gray-700">Rating</Label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="review" className="text-sm font-semibold text-gray-700">Review</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e: any) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-100 transition-all duration-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
              className="bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg shadow-gray-500/20 font-medium transition-all transform active:scale-95"
            >
              {isSubmittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Return Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-900">{returnItem?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {returnItem?.size && `Size: ${returnItem.size}`}
                {returnItem?.size && returnItem?.color && ' | '}
                {returnItem?.color && `Color: ${returnItem.color}`}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="return-reason" className="text-sm font-semibold text-gray-700">Reason for Return</Label>
              <Textarea
                id="return-reason"
                value={returnReason}
                onChange={(e: any) => setReturnReason(e.target.value)}
                placeholder="Please tell us why you want to return this item..."
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-100 transition-all duration-300 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReturnSubmit}
              disabled={isSubmittingReturn || !returnReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-500/20 font-medium transition-all transform active:scale-95"
            >
              {isSubmittingReturn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Return Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AccountDrawer isOpen={isAccountDrawerOpen} onOpenChange={setIsAccountDrawerOpen} activePage="orders" />
    </div>
  );
}