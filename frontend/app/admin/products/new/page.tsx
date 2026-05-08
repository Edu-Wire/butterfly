'use client'

import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
    return (
        <div className="min-h-full bg-background">
            <div className="bg-secondary border-b border-border sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Link
                            href="/admin/products"
                            className="p-2 hover:bg-primary/10 rounded-sm transition-colors"
                            title="Back to Products"
                        >
                            <ArrowLeft size={20} className="text-foreground/60" />
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-primary">
                                Add New Product
                            </h1>
                            <p className="text-foreground/60 text-sm mt-1">
                                Create a new item in your inventory
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProductForm />
            </div>
        </div>
    )
}
