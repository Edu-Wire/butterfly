'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="pt-60 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-black mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading your luxury cart...</p>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <main className="pt-60 pb-20 max-w-[1400px] mx-auto px-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-gray-50 p-8 rounded-full">
            <ShoppingBag size={64} className="text-gray-200" strokeWidth={1} />
          </div>
          <h1 className="font-sans text-4xl text-gray-800">YOUR CART IS EMPTY</h1>
          <p className="text-gray-500 max-w-xs mx-auto">
            Explore our exquisite collection and find something truly unique for your wardrobe.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-10 py-4 font-bold tracking-widest hover:bg-gray-800 transition-all"
          >
            START SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 pb-20 max-w-[1400px] mx-auto px-6">
      <h1 className="font-sans text-5xl text-[#4A4A4A] mb-12 tracking-tight">CART</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1 space-y-10">
          {cart.items.map((item, idx) => (
            <div key={`${item.productId}-${idx}`} className="flex gap-8 border-b border-gray-100 pb-10 group">
              <div className="w-32 aspect-[3/4] relative bg-gray-100 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name || 'Item'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-sans text-2xl text-gray-800 tracking-wide uppercase">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {item.size !== 'N/A' && <span>Size: {item.size}</span>}
                  {item.color !== 'N/A' && <span>Color: {item.color}</span>}
                </div>

                <div className="mt-auto flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Price</p>
                    <p className="text-xl font-medium text-gray-900">INR {typeof item.price === 'string' ? parseFloat(item.price).toLocaleString() : item.price?.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center border border-gray-200 bg-white rounded-sm overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 font-bold text-sm min-w-[3rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-6 text-gray-500 border border-gray-200 rounded-sm italic text-sm">
            <p>Notes: Please specify any special delivery instructions here.</p>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-white p-10 border border-gray-100 shadow-sm sticky top-32">
            <h3 className="font-sans text-2xl mb-8 text-gray-800 uppercase tracking-wider">SHOPPING INFO</h3>

            <div className="space-y-6 mb-10 text-sm">
              <div className="flex justify-between text-gray-500">
                <span className="uppercase tracking-widest font-bold text-xs">Subtotal</span>
                <span className="font-medium">INR {cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="uppercase tracking-widest font-bold text-xs">Shipping</span>
                <span className="font-medium">INR {cart.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="uppercase tracking-widest font-bold text-xs">Tax</span>
                <span className="font-medium">INR {cart.tax.toLocaleString()}</span>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                <span className="font-sans text-3xl text-gray-900">TOTAL</span>
                <span className="font-bold text-xl">INR {cart.total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full bg-black text-white py-5 text-center font-bold tracking-[0.2em] hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-100 shadow-lg shadow-black/10">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
