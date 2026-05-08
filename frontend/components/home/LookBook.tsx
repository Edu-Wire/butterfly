import Image from 'next/image';
import Link from 'next/link';

export function LookBook() {
    return (
        <section className="py-12 px-4 max-w-[1400px] mx-auto bg-background">
            <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#8B5E34] uppercase tracking-wide">
                    LOOK BOOK HIGHLIGHTS
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[800px]">
                {/* Left Column - Stacked */}
                <div className="flex flex-col gap-6 h-full">
                    {/* Formal Woman */}
                    <div className="relative h-1/2 w-full group overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=2574&auto=format&fit=crop"
                            alt="Formal Woman"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="font-serif text-3xl text-white tracking-widest uppercase">
                                FORMAL WOMAN
                            </h3>
                        </div>
                    </div>

                    {/* Formal Men */}
                    <div className="relative h-1/2 w-full group overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
                            alt="Formal Men"
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="font-serif text-3xl text-white tracking-widest uppercase">
                                FORMAL MEN
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Right Column - Tall */}
                <div className="relative h-full w-full group overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop"
                        alt="Casual Style"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-10 left-10">
                        <h3 className="font-serif text-4xl text-white tracking-widest uppercase">
                            CASUAL STYLE
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
