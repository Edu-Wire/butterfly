'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Inter } from 'next/font/google'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Simplified data structure
const collections = [
  {
    id: '01',
    title: 'The Chrysalis',
    season: 'AW/26',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG",
  },
  {
    id: '02',
    title: 'Midnight Monarch',
    season: 'Evening',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg",
  },
  {
    id: '03',
    title: 'Silk & Stone',
    season: 'RS/26',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG",
  },
  {
    id: '04',
    title: 'Ethereal Armor',
    season: 'SS/26',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg",
  },
]

export default function LookbookPage() {
  return (
    <main className={`min-h-screen bg-white text-black selection:bg-black selection:text-white ${inter.className}`}>
      

      {/* Stark Typographic Hero */}
      <header className="px-6 md:px-12 pt-32 pb-24 max-w-[1600px] mx-auto">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
          Campaigns
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium tracking-tighter uppercase leading-none">
          Visual Index
        </h1>
      </header>

      {/* Rigid 2-Column Grid */}
      <section className="px-6 md:px-12 pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {collections.map((item) => (
            <Link 
              href={`/lookbook/${item.id}`}
              key={item.id} 
              className="group block cursor-pointer"
            >
              {/* Image Container: Uniform Aspect Ratio */}
              <div className="relative aspect-[3/4] w-full overflow-hidden mb-6 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  // Removed 'grayscale' class here
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              
              {/* Data Row: Cleanly separated by a border */}
              <div className="flex justify-between items-end pt-4 border-t border-black">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {item.id} — {item.season}
                  </span>
                  <h2 className="text-2xl font-medium tracking-tight uppercase group-hover:text-gray-500 transition-colors">
                    {item.title}
                  </h2>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-black group-hover:text-gray-500 transition-colors">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-black py-24 px-6 md:px-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
          The Atelier
        </p>
        <Link 
          href="/contact-us"
          className="text-2xl md:text-4xl font-medium uppercase tracking-tight hover:text-gray-500 transition-colors"
        >
          Request Private Viewing
        </Link>
      </footer>

    </main>
  )
}