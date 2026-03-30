import React from 'react';
import Link from 'next/link';

const catalogBanners = [
    "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG",
    "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+43+00+PM+(8).jpg",
    "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00461.JPG",
    "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Oct+04+2025%2C+12+42+31+PM+(1).jpg",
    "https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/Photo+Aug+25+2025%2C+7+04+46+AM.jpg"
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      
      {/* 1. Hero Section: Minimalist & Typographic */}
      <section className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-20">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
            Est. 2022
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] mb-12">
            BUTTERFLY <br />
            <span className="italic font-light">COUTURE</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between max-w-4xl">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              We exist to redefine luxury through the lens of metamorphosis. 
              Artistry, innovation, and timeless elegance in strict monochrome.
            </p>
            {/* Scroll Indicator (Visual Element) */}
            <div className="hidden md:block h-px w-32 bg-black"></div>
          </div>
        </div>
      </section>

      {/* 2. Our Story: Split Layout with Sharp Edges */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-gray-200">
        <div className="bg-gray-50 min-h-[600px] lg:h-auto flex items-center justify-center relative overflow-hidden group">
          <img 
            src={catalogBanners[0]} 
            alt="Campaign Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="flex flex-col justify-center px-6 py-20 md:px-20 lg:py-32">
          <h2 className="text-4xl md:text-5xl mb-8">The Metamorphosis</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Founded in 2018, Butterfly Couture emerged from a singular obsession: 
              creating fashion that transcends the ephemeral nature of trends. 
              We believe that true luxury is quiet, consisting of details that whisper rather than shout.
            </p>
            
            <div className="border-l-4 border-black pl-6 space-y-4">
              <h4 className="font-semibold text-black text-xl">Signature Style</h4>
              <p>
                The brand specializes in <strong>Indo-Western wear</strong>, blending contemporary global silhouettes with traditional influences unique to the Northeast. Each piece represents a harmonious fusion of modern design sensibilities with rich cultural heritage.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-6 space-y-4">
              <h4 className="font-semibold text-black text-xl">Premium Focus</h4>
              <p>
                <strong>Butterfly Collection Couture</strong> is positioned as a luxury brand, known for its intricate craftsmanship and "timeless elegance." We curate the finest raw materials and employ master artisans to create pieces that celebrate the journey toward one's truest self.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-6 space-y-4">
              <h4 className="font-semibold text-black text-xl">Impact and Recognition</h4>
              <p>
                Mr. Marwein has become a prominent figure in the Northeast Indian fashion circuit, frequently invited as an esteemed judge and mentor for major beauty pageants. Under his leadership, the brand has grown into a "beacon of style" that promotes the region's artistic heritage through high-fashion garments.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
            <div>
              <span className="block text-4xl mb-1">20+</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Collections</span>
            </div>
            <div>
              <span className="block text-4xl mb-1">Global</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Sourcing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values: Architectural Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Our Code</h2>
          <div className="h-px w-full bg-gray-200 mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {[
            {
              num: '01',
              title: 'Exacting Craft',
              desc: 'We reject mass production. Every seam, stitch, and hem is a deliberate act of design executed by master artisans.',
            },
            {
              num: '02',
              title: 'Ethical Structure',
              desc: 'Luxury cannot exist without responsibility. We are committed to transparent sourcing and sustainable fabrication.',
            },
            {
              num: '03',
              title: 'Modern Timelessness',
              desc: 'We blend classic silhouettes with avant-garde cuts to create pieces that remain relevant for decades, not seasons.',
            },
          ].map((item) => (
            <div key={item.num} className="group">
              <span className="block text-xs font-bold text-gray-400 mb-4 tracking-widest">
                {item.num}
              </span>
              <h3 className="text-2xl mb-4 group-hover:underline decoration-1 underline-offset-4">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Leadership: High-Fashion Portraits */}
      <section className="bg-gray-50 py-24 md:py-32 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl">The Architects</h2>
            <p className="hidden md:block text-gray-500 text-sm uppercase tracking-widest">
              Meet the board
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Founder Section - Full Width */}
            <div className="md:col-span-3 group cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Founder Image */}
                <div className="aspect-[4/5] lg:aspect-[3/4] bg-gray-100 relative overflow-hidden order-2 lg:order-1">
                  <img 
                    src="/founderbutterfly.jpeg" 
                    alt="Mr. Strennousland Marwein - Founder of Butterfly Couture"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                
                {/* Founder Story */}
                <div className="order-1 lg:order-2 space-y-6">
                  <div>
                    <h3 className="text-3xl lg:text-4xl mb-2">Mr. Strennousland Marwein</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
                      Founder & Visionary
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-lg">
                      Mr. Strennousland Marwein is the visionary founder behind <strong>Butterfly Clothing and Accessories</strong>, also known as <strong>Butterfly Collection Couture</strong>, a premium fashion label rooted in the cultural heart of Northeast India.
                    </p>
                    
                    <div className="border-l-4 border-black pl-6 space-y-4">
                      <h4 className="font-semibold text-black text-xl">Journey from Hobby to Haute Couture</h4>
                      <p>
                        What began as a personal hobby for Mr. Marwein transformed into a professional venture after he identified a distinct gap in the luxury fashion market. His deep involvement in both regional and national pageantry served as a catalyst, providing him with firsthand insight into the demand for high-end, stage-worthy attire.
                      </p>
                      <p>
                        While participating in and judging prestigious events, Mr. Marwein recognized a need for premium, specialized garments that could represent the region on a national stage. This revelation sparked the metamorphosis of his passion into Butterfly Couture—a brand that would bridge traditional Northeast Indian craftsmanship with contemporary luxury fashion.
                      </p>
                    </div>
                    
                    <p>
                      Under his creative direction, Butterfly Couture has become synonymous with elegance, innovation, and cultural pride, creating pieces that not only adorn but also tell stories of heritage and artistic excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Press / Footer CTA: Inverted Contrast */}
      <section className="bg-black text-white py-24 px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl">
            "A triumph of monochrome minimalism."
          </h2>
          <p className="text-gray-400 italic">
            — Vogue International
          </p>
          
          <div className="pt-8 flex justify-center">
            <Link 
              href="/press"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden border border-white bg-transparent px-8 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 z-10"
            >
              <span className="mr-2 uppercase tracking-widest text-sm">View Press Kit</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}