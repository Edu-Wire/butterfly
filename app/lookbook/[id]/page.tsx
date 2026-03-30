'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Inter } from 'next/font/google'
import Image from 'next/image'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Mock data for individual lookbook collections
const lookbookData = {
  '01': {
    id: '01',
    title: 'The Chrysalis',
    season: 'AW/26',
    description: 'A transformative collection that explores the delicate balance between structure and fluidity. This autumn/winter collection draws inspiration from the metamorphosis of nature, featuring architectural silhouettes that evolve with movement.',
    images: [
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG"
    ],
    details: {
      photographer: 'Marcus Chen',
      stylist: 'Sophie Beaumont',
      model: 'Isabelle Laurent',
      location: 'Paris Atelier',
      date: 'October 2024'
    }
  },
  '02': {
    id: '02',
    title: 'Midnight Monarch',
    season: 'Evening',
    description: 'An exploration of nocturnal elegance and the transformative power of evening wear. This collection celebrates the monarch butterfly\'s journey through darkness into light.',
    images: [
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Aug+25+2025%2C+7+04+46+AM.jpg"
    ],
    details: {
      photographer: 'Jean-Paul Dubois',
      stylist: 'Elena Volkov',
      model: 'Alexandra Chen',
      location: 'Tokyo Studio',
      date: 'September 2024'
    }
  },
  '03': {
    id: '03',
    title: 'Silk & Stone',
    season: 'RS/26',
    description: 'A resort collection that juxtaposes the softness of silk with the strength of stone. This exploration of contrasts creates pieces that are both delicate and enduring.',
    images: [
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Aug+25+2025%2C+7+04+46+AM.jpg",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG"
    ],
    details: {
      photographer: 'Roberto Silva',
      stylist: 'Marie Laurent',
      model: 'Yuki Tanaka',
      location: 'Milan Villa',
      date: 'August 2024'
    }
  },
  '04': {
    id: '04',
    title: 'Ethereal Armor',
    season: 'SS/26',
    description: 'A spring/summer collection that reimagines protection as beauty. These pieces serve as both armor and adornment, celebrating strength in vulnerability.',
    images: [
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG",
      "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg"
    ],
    details: {
      photographer: 'David Kim',
      stylist: 'Claire Moreau',
      model: 'Sofia Rodriguez',
      location: 'New York Loft',
      date: 'July 2024'
    }
  }
}

export default function LookbookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const collection = lookbookData[id as keyof typeof lookbookData]

  if (!collection) {
    return (
      <main className={`min-h-screen bg-white text-black selection:bg-black selection:text-white ${inter.className}`}>
        <div className="px-6 md:px-12 pt-32 pb-24 max-w-[1600px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight uppercase mb-8">
            Collection Not Found
          </h1>
          <p className="text-gray-500 mb-12">
            The requested lookbook collection could not be found.
          </p>
          <Link 
            href="/lookbook"
            className="inline-flex items-center gap-3 border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lookbook
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-white text-black selection:bg-black selection:text-white ${inter.className}`}>
      
      {/* Navigation Header */}
      <header className="px-6 md:px-12 pt-32 pb-8 max-w-[1600px] mx-auto border-b border-black">
        <div className="flex justify-between items-center">
          <Link 
            href="/lookbook"
            className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Visual Index
          </Link>
          
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
              {collection.season}
            </p>
            <h1 className="text-2xl md:text-4xl font-medium tracking-tight uppercase">
              {collection.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <section className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto">
        <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto overflow-hidden mb-12">
          <Image
            src={collection.images[0]}
            alt={collection.title}
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Collection Description */}
      <section className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Concept
            </h2>
            <p className="text-lg leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
          Gallery
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collection.images.map((image, index) => (
            <div key={index} className="relative aspect-[3/4] overflow-hidden group">
              <Image
                src={image}
                alt={`${collection.title} - Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 max-w-[1200px] mx-auto text-center border-t border-black">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight uppercase mb-6">
          Request Private Viewing
        </h2>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          Experience this collection in person. Schedule a private consultation at our atelier.
        </p>
        <Link 
          href="/contact-us"
          className="inline-flex items-center gap-3 border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors"
        >
          <span className="text-sm uppercase tracking-[0.2em]">Book Appointment</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>

    </main>
  )
}
