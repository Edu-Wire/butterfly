'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './button'

interface Product {
  id: string
  name: string
  price: string
  images: string[]
  videoUrl?: string
}

interface ProductCarouselProps {
  title: string
  products: Product[]
  showAddToCart?: boolean
  showQuickView?: boolean
  shopAllLink?: string
}

function CarouselItem({ product }: { product: Product }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div
      className="flex-none w-[80vw] md:w-[calc(25%-2px)] sm:w-[calc(25%-2px)] md:w-[calc(30%-2px)] lg:w-[calc(22%-2px)] snap-start group px-[2px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="cursor-pointer group mb-1 flex flex-col h-full">
        {/* Main Media Container */}
        <div className="relative aspect-[3/4] md:h-[75vh] overflow-hidden rounded-sm bg-gray-100 group/img">
          {/* Images */}
          <div className={`relative w-full h-full transition-opacity duration-300 ${isHovered && videoLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-top"
              priority
            />
            {product.images.length > 1 && !isHovered && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - Alternate`}
                fill
                className="object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              />
            )}
          </div>

          {/* Video Overlay */}
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
        </div>

        {/* Product Info */}
        <div className="mt-2 px-2 pb-4">
          <div className="flex justify-between items-start mb-1 md:mb-1.5">
            <h3 className="font-bold text-black text-[10px] md:text-xs uppercase tracking-[0.2em] line-clamp-1 pr-2">{product.name}</h3>
            <p className="font-bold text-black text-[11px] md:text-xs tracking-wide whitespace-nowrap">{product.price}</p>
          </div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Luxury Collection
          </p>
        </div>
      </Link>
    </div>
  );
}

export function ProductCarousel({ title, products, showAddToCart = true, showQuickView = true, shopAllLink }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full pt-1 pb-1 text-black bg-white">
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-0 pb-2 pt-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product: Product) => (
              <CarouselItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
