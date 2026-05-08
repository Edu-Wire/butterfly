// Brands management - in production, this would come from an actual database
export interface Brand {
  id: number
  name: string
  description?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

export let brands: Brand[] = [
  {
    id: 1,
    name: 'Butterfly Couture',
    description: 'Luxury fashion brand specializing in elegant couture pieces',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function getAllBrands(): Brand[] {
  return brands
}

export function getBrandById(id: number): Brand | undefined {
  return brands.find((b) => b.id === id)
}

export function getBrandByName(name: string): Brand | undefined {
  return brands.find((b) => b.name.toLowerCase() === name.toLowerCase())
}

export function addBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Brand {
  const newBrand: Brand = {
    ...brand,
    id: Math.max(...brands.map((b) => b.id), 0) + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  brands.push(newBrand)
  return newBrand
}

export function updateBrand(id: number, updates: Partial<Omit<Brand, 'id' | 'createdAt'>>): Brand | undefined {
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) return undefined

  brands[index] = {
    ...brands[index],
    ...updates,
    updatedAt: new Date(),
  }
  return brands[index]
}

export function deleteBrand(id: number): boolean {
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) return false

  brands.splice(index, 1)
  return true
}

