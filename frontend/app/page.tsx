import { HeroBanner } from '@/components/ui/HeroBanner'
import { ProductCarousel } from '@/components/ui/ProductCarousel'
import connectDB from '@/lib/db'
import Collection from '@/models/Collection'
import Product from '@/models/Product'
import Link from 'next/link'

// Sample data for multiple sections
const heroBanners = [
  {
    id: 1,
    title: "BUTTERFLY",
    subtitle: "Discover latest trends in fashion",
    buttonText: "Shop Now",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b1.JPG"
  },
  {
    id: 2,
    title: "NEW COLLECTION",
    subtitle: "Elevate your style with our premium pieces",
    buttonText: "Explore",
    buttonLink: "/new-arrival",
    backgroundImage: "/banners/b2.JPG"
  },
  {
    id: 3,
    title: "SUMMER ESSENTIALS",
    subtitle: "Light fabrics for warm days ahead",
    buttonText: "View Collection",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b3.jpg"
  },
  {
    id: 4,
    title: "LUXURY LINE",
    subtitle: "Premium materials meet timeless design",
    buttonText: "Discover",
    buttonLink: "/catalog",
    backgroundImage: "/banners/b1.JPG"
  }
]

// Fallback data in case DB is empty
const fallbackHero = {
  title: "BUTTERFLY COUTURE",
  subtitle: "Exquisite Fashion for the Modern Individual",
  buttonText: "Shop Collection",
  buttonLink: "/catalog",
  backgroundImage: "/hero.JPG"
}

export default async function Home() {
  await connectDB()

  // Ensure Product model is registered for populate
  console.log("📦 Initializing models:", Product.modelName, Collection.modelName)
  const collections = await Collection.find({ isActive: true })
    .populate('products')
    .sort({ order: 1, createdAt: -1 })
    .limit(7)

  // Fetch global highlights as fallback for empty collections
  const globalHighlights = await Product.find({ isActive: true, inStock: true })
    .sort({ rating: -1, createdAt: -1 })
    .limit(8)
    .lean()

  return (
    <main className="min-h-screen transition-[padding] duration-300 flex flex-col">
      {collections.length > 0 ? (
        collections.map((col: any, index: number) => (
          <div key={col._id.toString()}>
            {/* Hero Banner for the collection */}
            <HeroBanner
              title={col.name.toUpperCase()}
              subtitle={col.description || "Discover our latest premium collection"}
              buttonText="Explore Collection"
              buttonLink={`/collections/${col.slug}`}
              backgroundImage={col.displayImage || col.bannerImage || "/pic1.jpg"}
              showScrollIndicator={index < collections.length - 1}
              isFirst={index === 0}
            />

            {/* Product Carousel for the collection */}
            {(col.products && col.products.filter((p: any) => p !== null).length > 0) ? (
              <ProductCarousel
                title={`${col.name} Highlights`}
                products={col.products.filter((p: any) => p !== null).map((p: any) => ({
                  id: p._id.toString(),
                  name: p.name,
                  price: `₹${p.price.toLocaleString()}`,
                  images: p.images && p.images.length > 0 ? p.images : ["/uploads/product-1769084011566.jpeg"],
                  videoUrl: p.videoUrl
                }))}
                shopAllLink={`/catalog?collection=${encodeURIComponent(col.name)}`}
              />
            ) : globalHighlights.length > 0 && (
              <ProductCarousel
                title="Featured Highlights"
                products={globalHighlights.map((p: any) => ({
                  id: p._id.toString(),
                  name: p.name,
                  price: `₹${p.price.toLocaleString()}`,
                  images: p.images && p.images.length > 0 ? p.images : ["/uploads/product-1769084011566.jpeg"],
                  videoUrl: p.videoUrl
                }))}
                shopAllLink="/catalog"
              />
            )}
          </div>
        ))
      ) : (
        /* Fallback if no collections in DB */
        <div>
          <HeroBanner
            {...fallbackHero}
            showScrollIndicator={true}
            isFirst={true}
          />
          <div className="py-20 text-center text-gray-400">
            <p>No collections found. Visit the admin dashboard to create one.</p>
          </div>
        </div>
      )}

      {/* Membership / Newsletter CTA Banner */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden group mt-auto bg-stone-900">

        {/* Animated Background Image */}
        <div
          className="absolute inset-0 bg-[url('https://ecom-digiwire.s3.ap-south-1.amazonaws.com/random+/AZY00907.JPG')] bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-[15s] ease-out group-hover:scale-110"
        />

        {/* Dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-12">

          {/* Gold Geometric Crest Logo */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 mb-6 text-[#d4af37] flex items-center justify-center">
            {/* Multiple rings to create that intricate seal look */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M50 5 C 65 5, 80 15, 90 30 C 100 45, 100 65, 85 80 C 70 95, 45 100, 25 85 C 5 70, 0 45, 15 25 C 25 10, 40 5, 50 5 Z" />
              <path d="M50 5 C 35 5, 20 15, 10 30 C 0 45, 0 65, 15 80 C 30 95, 55 100, 75 85 C 95 70, 100 45, 85 25 C 75 10, 60 5, 50 5 Z" />
            </svg>
            <svg className="absolute inset-0 w-full h-full rotate-45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <rect x="20" y="20" width="60" height="60" />
            </svg>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <rect x="20" y="20" width="60" height="60" />
            </svg>
            <span className="font-serif italic text-2xl md:text-3xl font-light">B</span>
          </div>

          {/* Cursive Heading */}
          <h2 className="text-5xl md:text-7xl text-white mb-6 font-birds font-normal tracking-wide">
            Join Maison Butterfly
          </h2>

          {/* Widely tracked subtext */}
          <p className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-white uppercase max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            10% OFF NEXT ORDER. EXCLUSIVE ACCESS TO DROPS. EARN POINTS. MORE BENEFITS AS YOU SPEND.
          </p>

          {/* Simple Underlined CTA Button */}
          <Link
            href="/catalog"
            className="group relative text-sm md:text-base tracking-[0.3em] text-white uppercase transition-colors duration-300"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] transition-colors">
              EXPLORE
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current transform scale-x-0 transition-transform duration-500 ease-out origin-left group-hover:scale-x-100" />
          </Link>

        </div>
      </section>
    </main>
  )
}