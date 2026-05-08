import { Play } from 'lucide-react';
import Image from 'next/image';

export function VideoBanner() {
    return (
        <section className="relative w-full h-[600px] bg-black">
            <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop"
                alt="Brand Video"
                fill
                className="object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-[#8B5E34] ml-1" fill="#8B5E34" />
                </button>
            </div>
        </section>
    )
}
