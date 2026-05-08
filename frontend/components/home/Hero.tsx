import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

// Hero images
const HERO_IMAGES = [
  { src: "/banners/b1.JPG", alt: "Fashion Model 1" },
  { src: "/banners/b2.JPG", alt: "Fashion Model 2" },
  { src: "/banners/b3.jpg", alt: "Fashion Model 3" }
]

export function Hero() {
  return (
    <>
      {HERO_IMAGES.map((image, index) => (
        <section key={image.src} className="relative h-screen w-full overflow-hidden bg-[#CDA45D]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              unoptimized
              className="object-cover object-center opacity-90"
            />
            {/* Gradient Overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
          </div>
        </section>
      ))}
    </>
  )
}
