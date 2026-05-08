'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
    images: string[];
    alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nextImageIndex, setNextImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotate images on hover
    useEffect(() => {
        if (isHovered && images.length > 1) {
            intervalRef.current = setInterval(() => {
                changeImage((prev) => (prev + 1) % images.length);
            }, 3000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovered, images.length]);

    const changeImage = (newIndex: number | ((prev: number) => number)) => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        const nextIdx = typeof newIndex === 'function' ? newIndex(currentImageIndex) : newIndex;
        setNextImageIndex(nextIdx);
        
        setTimeout(() => {
            setCurrentImageIndex(nextIdx);
            setIsTransitioning(false);
        }, 50);
    };

    const goToPrevious = () => {
        changeImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        changeImage((prev) => (prev + 1) % images.length);
    };

    if (images.length === 1) {
        return (
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                    src={images[0]}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="16"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div 
            className="relative aspect-[3/4] overflow-hidden bg-gray-100 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Current Image */}
            <div className="absolute inset-0">
                <Image
                    src={images[currentImageIndex]}
                    alt={`${alt} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105"
                    style={{ opacity: isTransitioning ? 0 : 1 }}
                />
            </div>
            
            {/* Next Image */}
            {images.length > 1 && (
                <div className="absolute inset-0">
                    <Image
                        src={images[nextImageIndex]}
                        alt={`${alt} - Image ${nextImageIndex + 1}`}
                        fill
                        className="object-cover transition-opacity duration-700 ease-in-out"
                        style={{ opacity: isTransitioning ? 1 : 0 }}
                    />
                </div>
            )}
            
            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
            >
                <ChevronLeft size={16} className="text-gray-700" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
            >
                <ChevronRight size={16} className="text-gray-700" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => changeImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>

            {/* Add to Cart Button */}
            <button className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
            </button>
        </div>
    )
}
