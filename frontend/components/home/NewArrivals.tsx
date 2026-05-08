'use client'

import { ProductCard } from '@/components/product/ProductCard';

const products = [
    {
        id: '1',
        name: 'Floral Summer Dress',
        price: 300000,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2574&auto=format&fit=crop',
        category: 'Summer',
        isNew: true,
        size: ['S', 'M', 'L'],
        rating: 4.5,
        reviews: 45,
        inStock: true
    },
    {
        id: '2',
        name: 'Abstract Print Shirt',
        price: 250000,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2576&auto=format&fit=crop',
        category: 'Shirts',
        isNew: true,
        size: ['M', 'L', 'XL'],
        rating: 4.7,
        reviews: 32,
        inStock: true
    },
    {
        id: '3',
        name: 'Classic Yellow Dress',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2583&auto=format&fit=crop',
        category: 'Dresses',
        onSale: true,
        size: ['S', 'M'],
        rating: 4.9,
        reviews: 18,
        inStock: true
    },
    {
        id: '4',
        name: 'Navy Casual Shirt',
        price: 280000,
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2292&auto=format&fit=crop',
        category: 'Shirts',
        isNew: true,
        size: ['S', 'M', 'L', 'XL'],
        rating: 4.6,
        reviews: 24,
        inStock: true
    }
];

export function NewArrivals() {
    return (
        <section className="py-12 px-4 max-w-[1400px] mx-auto bg-[#E5D3B3]/20"> {/* Light beige bg matching design */}
            <div className="mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#4A4A4A] uppercase tracking-wide">
                    NEW ARRIVALS
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>

            <div className="mt-12">
                <button className="bg-[#8B5E34] text-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-[#7A5229] transition-colors">
                    SEE MORE
                </button>
            </div>
        </section>
    );
}
