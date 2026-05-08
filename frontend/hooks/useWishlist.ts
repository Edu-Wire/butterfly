'use client';
import { useState, useEffect } from 'react';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    category: string;
    subCategory?: string;
    images?: string[];
    image?: string;
    imageUrl?: string;
  };
  addedAt: string;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchWishlist(); // Refresh wishlist
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistItemId));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product?._id === productId);
  };

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    wishlistItems,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
