"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import { memo } from 'react'

const Footer = memo(function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isAuthPage) {
    return null
  }

  // Collection of stable SVG logos
  const paymentMethods = [
    { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg' },
    { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' },
    { name: 'Amex', src: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
    { name: 'PayPal', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { name: 'Apple Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' },
    { name: 'Google Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg' },
  ]

  const linkSections = [
    { title: 'About', links: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Press', href: '/press' },
      { name: 'Lookbook', href: '/lookbook' },
      { name: 'Our Story', href: '/our-story' }
    ]},
    { title: 'Get in Touch', links: [
      { name: 'Contact', href: '/contact-us' },
      { name: 'Returns', href: '/returns' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Terms', href: '/terms-and-conditions' }
    ]}
  ]

  return (
    <footer className="bg-black text-white pt-4 md:pt-8 pb-4 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* =========================================
            MOBILE VIEW (Unchanged as requested)
        ========================================= */}
        <div className="block md:hidden mb-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 mb-8">
              <Image 
                src="/Logo 2.png" 
                alt="Butterfly Couture Logo" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm font-light leading-relaxed text-gray-200">
              is a premier contemporary label that aims at <span className="italic font-serif">reinterpreting</span> global heritage.
            </p>
            {/* Social Icons - Mobile */}
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/butterfly1official?igsh=MWxjeGo3ZGwxeHZuOA==" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              {/* <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Link> */}
              {/* <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </Link> */}
            </div>
          </div>

          <div className="border-t border-white/10">
            {linkSections.map((section) => (
              <details key={section.title} className="group border-b border-white/10">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-3 text-sm uppercase tracking-widest text-white">
                  {section.title}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 mt-2 mb-4 group-open:animate-fadeIn">
                  <ul className="space-y-2 pl-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="block text-xs uppercase tracking-wide hover:text-white">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* =========================================
            DESKTOP VIEW: Structured Minimalist Grid
        ========================================= */}
        <div className="hidden md:flex justify-between items-start mb-12">
          
          {/* Left Side: Brand Statement & Socials */}
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <Image 
                src="/Logo 2.png" 
                alt="Butterfly Couture Logo" 
                width={150} 
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-10">
              is a premier contemporary label that aims at <span className="italic font-serif text-gray-300">reinterpreting</span> global heritage and artisanship through a lens of strict minimalist architecture.
            </p>
            <div className="flex gap-8">
              <Link href="https://www.instagram.com/butterfly1official?igsh=MWxjeGo3ZGwxeHZuOA==" className="text-gray-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              {/* <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link> */}
              {/* <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link> */}
            </div>
          </div>

          {/* Right Side: Navigation Links */}
          <div className="flex gap-24 lg:gap-32">
            {linkSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] font-bold mb-8 uppercase tracking-[0.2em] text-gray-500">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-sm font-medium text-white hover:text-gray-400 transition-colors uppercase tracking-wide"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* =========================================
            BOTTOM BAR: Copyright & Payments
        ========================================= */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end gap-4 pt-4 border-t border-white/20">
          
          {/* Copyright */}
          <div className="text-[10px] md:text-xs text-center md:text-left text-gray-500 uppercase tracking-widest font-semibold">
            <p>
              © 2026 Butterfly. All rights reserved. 
              <span className="hidden md:inline mx-4">|</span>
              <br className="md:hidden" />
              <Link href="/privacy-policy" className="hover:text-white transition-colors mt-2 md:mt-0 inline-block">Privacy</Link>
              <span className="mx-3">•</span>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors mt-2 md:mt-0 inline-block">Terms</Link>
            </p>
          </div>

          {/* Payment Methods (Full Color) */}
          <div className="flex flex-wrap gap-2 justify-center">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white px-2 py-1 rounded w-10 h-6 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={method.src}
                  alt={method.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
})

export default Footer