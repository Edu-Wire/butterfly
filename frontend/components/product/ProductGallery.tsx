'use client'

import React from "react"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
  productName: string
  images?: string[]
}

export function ProductGallery({ productName, images = [] }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  // Mock images - in production these would be actual product images
  const galleryImages = images.length > 0 
    ? images 
    : [
        'bg-gradient-to-br from-purple-100 to-pink-100',
        'bg-gradient-to-br from-pink-100 to-rose-100',
        'bg-gradient-to-br from-blue-100 to-purple-100',
        'bg-gradient-to-br from-amber-50 to-orange-100',
      ]

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    setIsZoomed(false)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden bg-secondary rounded-sm aspect-square">
        <div
          className={`w-full h-full ${galleryImages[selectedIndex]} flex items-center justify-center transition-transform duration-300 cursor-zoom-in relative group`}
          onMouseMove={handleZoom}
          onMouseLeave={handleZoomOut}
        >
          {/* Image Placeholder */}
          <span className="text-foreground/20 text-sm select-none pointer-events-none">
            Product Image {selectedIndex + 1}
          </span>

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium">
            <ZoomIn size={14} />
            Zoom
          </div>

          {/* Zoom Overlay Effect */}
          {isZoomed && (
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          )}
        </div>

        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 left-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
          {selectedIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-sm overflow-hidden transition-all duration-300 border-2 ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-primary/50'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <div className={`w-full h-full ${image} flex items-center justify-center`}>
                <span className="text-foreground/20 text-xs">Image {index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      <div className="bg-secondary border border-border rounded-sm p-4 text-sm space-y-2">
        <p className="font-medium text-foreground">High-Resolution Images</p>
        <p className="text-foreground/70 text-xs">
          All product images are optimized in AVIF and WebP formats for fast loading. 
          Zoom to see detailed craftsmanship and materials.
        </p>
      </div>
    </div>
  )
}
