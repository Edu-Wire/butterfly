'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Button } from './button'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface HeroBannerProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
  overlayColor?: string
  textColor?: string
  showScrollIndicator?: boolean
  isFirst?: boolean // Add prop to identify if it's the first hero
}

export function HeroBanner({
  title = "BUTTERFLY",
  subtitle = "Discover the latest trends in fashion",
  buttonText = "Shop Now",
  buttonLink = "/catalog",
  backgroundImage = "/hero.JPG",
  overlayColor = "", // Remove overlay by default
  textColor = "text-white",
  showScrollIndicator = true,
  isFirst = false // Default to false
}: HeroBannerProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Premium floating parallax effect - Text moves from absolute top to bottom through the container
      gsap.fromTo(
        textRef.current,
        { y: -350 }, // Start shifted high up
        {
          y: 350, // End shifted far down
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 // Slightly more lag for a dreamier luxury feel
          }
        }
      )

      // Entrance animation for Opacity/Scale - Smoothly fade in as section enters
      if (imageRef.current && textRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "bottom top",
            toggleActions: "play none none reverse"
          }
        });

        // Initial states (Y is now strictly managed by parallax above)
        gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });
        gsap.set(textRef.current, { opacity: 0 });

        // Fade/Scale sequence
        tl.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        })
          .to(textRef.current, {
            opacity: 1,
            duration: 1.2,
            ease: "power1.out"
          }, 0.2);
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden h-screen`}
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 z-0 bg-gray-50">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt="Fashion Background"
              fill
              priority
              unoptimized
              className="object-cover object-top w-full h-full"
              style={{ objectPosition: 'top center' }}
            />
          </>
        )}
        <div className={`absolute inset-0 ${overlayColor}`} />
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 flex h-full flex-col items-center justify-center p-4">
        <h1 className={`mb-4 text-center font-birds text-5xl font-normal tracking-wide md:text-6xl lg:text-7xl ${backgroundImage ? 'text-white' : 'text-[#003300]'} capitalize`}>
          {title.toLowerCase()}
        </h1>
        <p className={`mb-2 text-center text-base md:text-lg ${backgroundImage ? 'text-white' : 'text-red-800'}`}>
          {subtitle}
        </p>
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className={`group/btn relative mt-0 py-2 ${backgroundImage ? 'text-white' : 'text-black'}`}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] transition-colors">
              {buttonText}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current transform scale-x-0 transition-transform duration-500 ease-out origin-left group-hover/btn:scale-x-100" />
          </Link>
        )}
      </div>
    </section>
  )
}
