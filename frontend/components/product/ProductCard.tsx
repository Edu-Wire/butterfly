'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/products';

interface ProductCardProps {
    product: Product & { _id?: string };
    layout?: '1' | '2' | '3' | '4';
}

export function ProductCard({ product, layout = '4' }: ProductCardProps) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const productId = product._id || product.id;
    const imageUrl = product.images?.[0] || product.image || product.imageUrl;
    const price = product.salePrice || product.price;

    useEffect(() => {
        if (videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovered]);

    return (
        <Link
            href={`/product/${productId}`}
            key={productId}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative overflow-hidden bg-[#F9F9F9] mb-4 aspect-[3/4] rounded-lg shadow-sm transition-shadow duration-300 ${isHovered ? 'shadow-md' : ''}`}>
                {/* Product Image */}
                <div className="absolute inset-0 z-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className={`w-full h-full object-cover object-center transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'
                                } ${isHovered && videoLoaded ? 'opacity-0' : 'opacity-100'}`}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                    )}
                </div>

                {/* Product Video (Portrait) */}
                {product.videoUrl && (
                    <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isHovered && videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <video
                            ref={videoRef}
                            src={product.videoUrl}
                            muted
                            loop
                            playsInline
                            preload="auto"
                            onCanPlay={() => setVideoLoaded(true)}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                    {product.isNew && (
                        <div className="bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
                            NEW
                        </div>
                    )}
                    {product.onSale && (
                        <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
                            SALE
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="space-y-1.5 px-1">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors truncate flex-1">
                        {product.name}
                    </h3>
                    <span className="text-[11px] font-bold text-black whitespace-nowrap">
                        INR {price.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium">
                        {product.category}
                    </p>
                    {product.salePrice && product.price > product.salePrice && (
                        <span className="text-[9px] font-bold text-red-600">
                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
