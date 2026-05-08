// Mock product database - in production, this would come from an actual database
// Mock product database - mutable for admin functionality
export let products: Product[] = [
  {
    id: '1',
    name: 'Silk Butterfly Gown',
    price: 1250,
    category: 'Evening Wear',
    color: 'Black',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 124,
    image: 'bg-gradient-to-br from-purple-100 to-pink-100',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf049841a8f?w=600&q=80',
    inStock: true,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
  {
    id: '2',
    name: 'Crystal Embellished Dress',
    price: 980,
    category: 'Cocktail',
    color: 'Cream',
    size: ['XS', 'S', 'M', 'L'],
    rating: 4.6,
    reviews: 89,
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    imageUrl: 'https://images.unsplash.com/photo-1595777707802-c8b99eef7b10?w=600&q=80',
    inStock: true,
    onSale: true,
    salePrice: 750,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
  {
    id: '3',
    name: 'Ethereal Drape Jacket',
    price: 750,
    category: 'Jacket',
    color: 'Navy',
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 156,
    image: 'bg-gradient-to-br from-amber-50 to-orange-100',
    imageUrl: 'https://images.unsplash.com/photo-1520572163474-6864f9cf17ab?w=600&q=80',
    inStock: true,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
  {
    id: '4',
    name: 'Luxe Structured Blazer',
    price: 890,
    category: 'Blazer',
    color: 'Black',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviews: 103,
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80',
    inStock: true,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
  {
    id: '5',
    name: 'Silk Charmeuse Blouse',
    price: 520,
    category: 'Blouse',
    color: 'Gold',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 67,
    image: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695c952952?w=600&q=80',
    inStock: true,
    onSale: true,
    salePrice: 350,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
  {
    id: '6',
    name: 'Premium Wool Coat',
    price: 1450,
    category: 'Coat',
    color: 'Camel',
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 142,
    image: 'bg-gradient-to-br from-orange-50 to-yellow-100',
    imageUrl: 'https://images.unsplash.com/photo-1539533057440-7814a62d53d1?w=600&q=80',
    inStock: true,
    gender: 'Female',
    brand: 'Butterfly Couture',
  },
]

export interface Product {
  id: string // MongoDB ObjectId as string
  name: string
  price: number
  category: string
  collectionName?: string
  subCategory?: string
  brand?: string
  color: string
  colors?: string[]
  gender?: 'Male' | 'Female' | 'Unisex'
  size: string[]
  sizes?: string[]
  rating: number
  reviews: number
  reviewsCount?: number
  image: string
  imageGradient?: string
  imageUrl?: string
  images?: string[]
  videoUrl?: string
  inStock: boolean
  stock?: number
  onSale?: boolean
  salePrice?: number
  isNew?: boolean
  description?: string
  fabricComposition?: string
  fit?: string
  closure?: string
  sleeveType?: string
  washCare?: string
  countryOfManufacture?: string
  modelSize?: string
  modelHeight?: string
  shippingTime?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FilterOptions {
  categories?: string[]
  subCategories?: string[]
  collectionNames?: string[]
  sizes?: string[]
  colors?: string[]
  genders?: string[]
  priceRange?: [number, number]
  search?: string
  sortBy?: 'name' | 'price-low' | 'price-high' | 'rating'
}

export function filterAndSortProducts(
  allProducts: Product[],
  filters: FilterOptions
): Product[] {
  let filtered = [...allProducts]

  // Search filter
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((p) =>
      p.category && filters.categories!.some(cat =>
        p.category.toLowerCase() === cat.toLowerCase()
      )
    )
  }

  // Sub-Category filter
  if (filters.subCategories && filters.subCategories.length > 0) {
    filtered = filtered.filter((p) =>
      p.subCategory && filters.subCategories!.some(sub =>
        p.subCategory!.toLowerCase() === sub.toLowerCase()
      )
    )
  }

  // Collection filter
  if (filters.collectionNames && filters.collectionNames.length > 0) {
    filtered = filtered.filter((p) =>
      p.collectionName && filters.collectionNames!.some(col =>
        p.collectionName!.toLowerCase() === col.toLowerCase()
      )
    )
  }

  // Gender filter
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter((p) =>
      p.gender && filters.genders!.some(g => g.toLowerCase() === p.gender?.toLowerCase())
    )
  }

  // Color filter
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((p) => filters.colors!.includes(p.color))
  }

  // Size filter
  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter((p) =>
      filters.sizes!.some((s) => p.size.includes(s))
    )
  }

  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    filtered = filtered.filter((p) => p.price >= min && p.price <= max)
  }

  // Sorting - Always apply a default if none specified
  const sortKey = filters.sortBy || 'name'

  switch (sortKey) {
    case 'price-low':
      filtered.sort((a, b) => {
        const priceA = a.onSale && a.salePrice ? a.salePrice : a.price
        const priceB = b.onSale && b.salePrice ? b.salePrice : b.price
        return priceA - priceB
      })
      break
    case 'price-high':
      filtered.sort((a, b) => {
        const priceA = a.onSale && a.salePrice ? a.salePrice : a.price
        const priceB = b.onSale && b.salePrice ? b.salePrice : b.price
        return priceB - priceA
      })
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return filtered
}

export function getProductById(id: number | string): Product | undefined {
  const stringId = typeof id === 'string' ? id : id.toString()
  return products.find((p) => p.id === stringId)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(productId: number | string, limit = 3): Product[] {
  const product = getProductById(productId)
  if (!product) return []

  return products
    .filter(
      (p) =>
        p.id !== productId.toString() &&
        (p.category === product.category || p.color === product.color)
    )
    .slice(0, limit)
}

export function getAllProducts(): Product[] {
  return products
}

export function searchProducts(query: string): Product[] {
  return filterAndSortProducts(products, { search: query })
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.onSale)
}

// Admin CRUD Operations
export function addProduct(product: Omit<Product, 'id' | 'rating' | 'reviews'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(), // Use timestamp as string ID
    rating: 0,
    reviews: 0,
    brand: product.brand || 'Butterfly Couture', // Default brand
  }
  products.push(newProduct)
  return newProduct
}

export function updateProduct(id: number | string, updates: Partial<Product>): Product | undefined {
  const stringId = typeof id === 'string' ? id : id.toString()
  const index = products.findIndex(p => p.id === stringId)
  if (index === -1) return undefined

  products[index] = { ...products[index], ...updates }
  return products[index]
}

export function deleteProduct(id: number | string): boolean {
  const stringId = typeof id === 'string' ? id : id.toString()
  const index = products.findIndex(p => p.id === stringId)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}
