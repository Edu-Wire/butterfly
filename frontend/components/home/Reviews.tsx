import Image from 'next/image';
import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Alena Alex',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Alena Alex',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Alena Alex',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
    },
];

export function Reviews() {
    return (
        <section className="py-20 px-6 max-w-[1400px] mx-auto bg-background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400 my-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mt-2">
                                {review.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
