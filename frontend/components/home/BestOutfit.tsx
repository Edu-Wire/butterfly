'use client'

import Image from 'next/image';

const outfits = [
    {
        id: 1,
        name: 'Purple Gown Series',
        price: 'INR 1,200,000',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2524&auto=format&fit=crop',
        tag: 'SET',
        tagColor: 'bg-indigo-600'
    },
    {
        id: 2,
        name: 'Black Velvet Suit',
        price: 'INR 850,000',
        image: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=2670&auto=format&fit=crop',
        tag: 'HOT',
        tagColor: 'bg-red-500'
    },
    {
        id: 3,
        name: 'Red Ruffle Dress',
        price: 'INR 950,000',
        image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=2524&auto=format&fit=crop',
        tag: 'NEW',
        tagColor: 'bg-green-600'
    },
    {
        id: 4,
        name: 'Floral Mens Shirt',
        price: 'INR 350,000',
        image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?q=80&w=2668&auto=format&fit=crop',
        tag: 'SALE',
        tagColor: 'bg-orange-500'
    }
];

export function BestOutfit() {
    return (
        <section className="py-20 px-6 max-w-[1400px] mx-auto bg-background">
            <div className="mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#4A4A4A] uppercase tracking-wide leading-tight">
                    BEST OUTFIT FOR <br className="hidden md:block" /> YOUR HAPPINESS
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {outfits.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className={`absolute top-4 right-4 ${item.tagColor} text-white text-xs font-bold px-2 py-1 rounded-sm`}>
                                {item.tag}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-serif text-xl text-gray-900">{item.name}</h3>
                            <p className="text-gray-500">{item.price}</p>
                        </div>
                    </div>
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
