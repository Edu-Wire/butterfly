import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Clock, User, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'The Evolution of Luxury Fashion',
    excerpt: 'Discover how luxury fashion has transformed over the decades and what defines elegance today.',
    image: 'bg-gradient-to-br from-purple-100 to-pink-100',
    author: 'Isabelle Laurent',
    date: 'January 15, 2026',
    readTime: '8 min',
    category: 'Fashion',
    featured: true,
  },
  {
    id: 2,
    title: 'Sustainable Luxury: A New Standard',
    excerpt: 'How we balance environmental responsibility with timeless luxury craftsmanship.',
    image: 'bg-gradient-to-br from-green-100 to-blue-100',
    author: 'Marcus Chen',
    date: 'January 12, 2026',
    readTime: '6 min',
    category: 'Sustainability',
    featured: false,
  },
  {
    id: 3,
    title: 'The Art of Minimalist Dressing',
    excerpt: 'Master the philosophy of less is more with our guide to minimalist luxury fashion.',
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    author: 'Sophie Beaumont',
    date: 'January 10, 2026',
    readTime: '7 min',
    category: 'Style Guide',
    featured: false,
  },
  {
    id: 4,
    title: 'Investment Pieces That Last',
    excerpt: 'Build your wardrobe with timeless pieces designed to transcend trends.',
    image: 'bg-gradient-to-br from-amber-50 to-orange-100',
    author: 'Isabelle Laurent',
    date: 'January 8, 2026',
    readTime: '5 min',
    category: 'Fashion',
    featured: false,
  },
  {
    id: 5,
    title: 'The Butterfly Motif: Symbolism & Style',
    excerpt: 'Explore the cultural significance and styling inspiration behind our signature butterfly collection.',
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    author: 'Sophie Beaumont',
    date: 'January 5, 2026',
    readTime: '9 min',
    category: 'Design',
    featured: false,
  },
  {
    id: 6,
    title: 'Seasonal Wardrobe Refresh Guide',
    excerpt: 'Tips and tricks for transitioning your wardrobe between seasons while maintaining style.',
    image: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    author: 'Marcus Chen',
    date: 'January 1, 2026',
    readTime: '6 min',
    category: 'Style Guide',
    featured: false,
  },
]

const categories = ['All', 'Fashion', 'Sustainability', 'Style Guide', 'Design']

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
              Magazine
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Stories, insights, and inspiration from the world of luxury fashion.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Featured Article */}
          {featuredPost && (
            <div className="mb-20 border border-border rounded-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div
                  className={`${featuredPost.image} aspect-square lg:aspect-auto flex items-center justify-center`}
                >
                  <span className="text-foreground/20">Featured Article Image</span>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-accent uppercase tracking-widest">
                      Featured
                    </span>
                    <h2 className="font-serif text-4xl font-bold text-primary">
                      {featuredPost.title}
                    </h2>
                  </div>

                  <p className="text-foreground/70 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-foreground/60 border-t border-border pt-6">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {featuredPost.readTime} read
                    </div>
                    <span>{featuredPost.date}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Read Article
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="group space-y-4">
                <div className="relative overflow-hidden rounded-sm aspect-video">
                  <div
                    className={`w-full h-full ${post.image} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                  >
                    <span className="text-foreground/20">Article Image</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-foreground/60 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-foreground/50">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-16">
            <button className="px-8 py-3 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors">
              Load More Articles
            </button>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-primary text-primary-foreground py-16 mt-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold">
              Stay Updated
            </h2>
            <p className="text-primary-foreground/80">
              Subscribe to our newsletter for the latest articles, style tips, and exclusive insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground text-primary rounded-sm placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-background"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-background text-primary font-semibold rounded-sm hover:bg-foreground transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
