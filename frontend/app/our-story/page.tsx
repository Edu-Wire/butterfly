'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Inter } from 'next/font/google'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

const timeline = [
  { year: '2018', title: 'The Foundation', desc: 'Started in a small workshop with a handful of dedicated artisans who shared a singular vision for uncompromising quality.' },
  { year: '2020', title: 'Collection I', desc: 'Launched our debut collection featuring 12 handcrafted pieces that established our architectural silhouette.' },
  { year: '2022', title: 'Global Recognition', desc: 'Featured in major fashion weeks and received our first sustainability award for zero-waste pattern drafting.' },
  { year: '2024', title: 'Expansion', desc: 'Opened flagship ateliers in New York, Paris, and Tokyo while maintaining our strict commitment to sustainable practices.' },
  { year: '2026', title: 'The Future', desc: 'Continuing our mission to redefine luxury fashion through material innovation and environmental responsibility.' },
];

const principles = [
  { title: 'Artisan Excellence', desc: 'We partner exclusively with master craftspeople. Every seam, stitch, and hem is a deliberate act of design.' },
  { title: 'Ethical Sourcing', desc: 'Every material is sourced responsibly, ensuring fair wages and safe working conditions across our entire supply chain.' },
  { title: 'Environmental Stewardship', desc: 'Committed to a reduced footprint through sustainable fabrication, localized production, and timeless, anti-trend design.' },
  { title: 'The Butterfly Effect', desc: 'The butterfly represents metamorphosis. We believe fashion has the power to transform not just the exterior, but the interior.' },
];

export default function OurStoryPage() {
  return (
    <main className={`min-h-screen bg-white text-black selection:bg-black selection:text-white ${inter.className}`}>
      

      {/* Stark Typographic Hero */}
      <header className="px-6 md:px-12 pt-32 pb-24 max-w-[1600px] mx-auto border-b border-black">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
          Est. 2018
        </p>
        <h1 className="text-2xl md:text-xl lg:text-[10rem] font-medium tracking-tighter uppercase leading-none">
          Our Story
        </h1>
      </header>

      {/* The Manifesto (Split Text Block) */}
      <section className="px-6 md:px-12 py-24 max-w-[1600px] mx-auto border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">
              The Origin
            </h2>
            <p className="text-2xl md:text-4xl font-medium tracking-tight uppercase leading-snug">
              Butterfly Couture emerged from a singular obsession: to redefine luxury through the lens of strict metamorphosis and artistry.
            </p>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg text-gray-500 leading-relaxed mb-6">
              Founded by a third-generation designer, we grew up surrounded by the rich, demanding traditions of couture craftsmanship. We reject mass production. We believe that true luxury is quiet, consisting of details that whisper rather than shout.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Just as a butterfly undergoes structural transformation to become something extraordinary, we engineer garments that celebrate the journey toward one's truest self.
            </p>
          </div>
        </div>
      </section>

      {/* Chronology (Tabular Timeline) */}
      <section className="px-6 md:px-12 py-24 max-w-[1600px] mx-auto border-b border-black">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-12">
          Chronology
        </h2>
        
        <div className="flex flex-col">
          {timeline.map((item, index) => (
            <div 
              key={item.year} 
              className={`grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-t border-black hover:bg-gray-50 transition-colors ${index === timeline.length - 1 ? 'border-b' : ''}`}
            >
              <div className="md:col-span-2">
                <span className="text-sm font-bold tracking-widest uppercase">
                  {item.year}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl font-medium tracking-tight uppercase">
                  {item.title}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles (Strict Grid) */}
      <section className="px-6 md:px-12 py-24 max-w-[1600px] mx-auto">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-12">
          Core Principles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-black">
          {principles.map((principle, index) => (
            <div 
              key={index} 
              className="p-8 md:p-12 border-r border-b border-black flex flex-col justify-between min-h-[300px] hover:bg-black hover:text-white transition-colors duration-500 group"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-hover:text-gray-400 mb-12 block">
                0{index + 1}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-tight uppercase mb-4">
                  {principle.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed text-sm max-w-sm">
                  {principle.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

 
    </main>
  )
}