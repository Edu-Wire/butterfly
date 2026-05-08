// Categories management - in production, this would come from an actual database
export interface Category {
  id: number
  name: string
  description?: string
  createdAt: Date
  subCategories?: string[]
  updatedAt: Date
}

export let categories: Category[] = [
  {
    id: 1,
    name: 'Evening Wear',
    description: 'Elegant evening dresses and gowns',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Cocktail',
    description: 'Cocktail dresses for special occasions',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Jacket',
    description: 'Stylish jackets and outerwear',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Blazer',
    description: 'Professional and casual blazers',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: 'Blouse',
    description: 'Elegant blouses and tops',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: 'Coat',
    description: 'Premium coats and outerwear',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function getAllCategories(): Category[] {
  return categories
}

export function getCategoryById(id: number): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find((c) => c.name.toLowerCase() === name.toLowerCase())
}

export function addCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
  const newCategory: Category = {
    ...category,
    id: Math.max(...categories.map((c) => c.id), 0) + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  categories.push(newCategory)
  return newCategory
}

export function updateCategory(id: number, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | undefined {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date(),
  }
  return categories[index]
}

export function deleteCategory(id: number): boolean {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return false

  categories.splice(index, 1)
  return true
}

