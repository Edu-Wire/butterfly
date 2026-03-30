'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Inter } from 'next/font/google';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

const pressItems = [
  {
    id: '01',
    publication: 'Vogue',
    title: 'The Return of Structure',
    excerpt: 'Butterfly Couture challenges the fluidity of modern fashion with rigid architectural forms.',
    date: 'OCT 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG"
  },
  {
    id: '02',
    publication: 'Numéro',
    title: 'Monochrome Studies',
    excerpt: 'A conversation with Isabelle Laurent on why color is a distraction from the silhouette.',
    date: 'SEP 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg"
  },
  {
    id: '03',
    publication: 'Hypebeast',
    title: 'Avant-Garde Tailoring',
    excerpt: 'How the brand is bridging the gap between streetwear sensibilities and couture techniques.',
    date: 'AUG 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG"
  },
  {
    id: '04',
    publication: 'Elle Decor',
    title: 'Fabric as Architecture',
    excerpt: 'The sourcing journey behind the raw silk and structured wools of the Winter collection.',
    date: 'JUL 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg"
  },
  {
    id: '05',
    publication: 'Wallpaper*',
    title: 'Quiet Loudness',
    excerpt: 'Reviewing the runway show that had the industry whispering.',
    date: 'JUN 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Aug+25+2025%2C+7+04+46+AM.jpg"
  },
  {
    id: '06',
    publication: 'The Gentlewoman',
    title: 'Portrait of a Designer',
    excerpt: 'An intimate look into the studio life of our Creative Director.',
    date: 'MAY 24',
    image: "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg"
  }
];

export default function PressPage() {
  return (
    <div className={`min-h-screen bg-white text-black selection:bg-gray-100 selection:text-black ${inter.className}`}>
      
      {/* Header Section: Reduced padding & gap */}
      <header className="pt-24 pb-8 px-6 md:px-10 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-1">
              Press Index
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">
              Archive 2024—2025
            </p>
          </div>
          
          <div className="flex gap-6 text-[10px] font-bold tracking-widest uppercase">
            <span className="opacity-100 border-b-2 border-black pb-1 cursor-pointer">All</span>
            <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Interviews</span>
            <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Reviews</span>
            <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Editorials</span>
          </div>
        </div>
      </header>

      {/* The Grid: Tighter spacing */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-[#E5E5E5]">
            
            {pressItems.map((item) => (
              <Link 
                href="#" 
                key={item.id}
                className="group block border-r border-b border-[#E5E5E5] relative bg-transparent transition-colors hover:bg-white h-full"
              >
                {/* Reduced padding from p-12 to p-8, and gap from gap-12 to gap-8 */}
                <div className="p-6 md:p-8 flex flex-col h-full justify-between gap-8">
                  
                  {/* Top: Meta & Icon */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-hover:text-black transition-colors">
                      {item.id} — {item.publication}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors duration-300" />
                  </div>

                  {/* Middle: Content */}
                  <div>
                    {/* Reduced bottom margin */}
                    <div className="mb-6 overflow-hidden aspect-[4/3] bg-gray-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                      />
                    </div>
                    
                    <h2 className="text-2xl font-medium tracking-tight leading-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-snug max-w-sm group-hover:text-gray-800 transition-colors">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Bottom: Date */}
                  <div className="pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                    <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                      Published / {item.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* Footer: Reduced padding */}
      <footer className="text-center py-16 border-t border-[#E5E5E5]">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-gray-400">
          Inquiries
        </p>
        <a href="mailto:press@butterfly.com" className="text-2xl md:text-3xl font-medium tracking-tight hover:text-gray-500 transition-colors duration-300">
          press@butterfly.com
        </a>
      </footer>

    </div>
  );
}