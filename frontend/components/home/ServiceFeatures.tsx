import { ThumbsUp, Headset, Truck, CreditCard } from 'lucide-react';

export function ServiceFeatures() {
    const features = [
        {
            icon: <ThumbsUp className="w-8 h-8 text-white" />,
            title: "100% Satisfaction Guaranteed",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            icon: <Headset className="w-8 h-8 text-white" />,
            title: "24/7 Online Service",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            icon: <Truck className="w-8 h-8 text-white" />,
            title: "Fast Delivery",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            icon: <CreditCard className="w-8 h-8 text-white" />,
            title: "Payment With Secure System",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        }
    ];

    return (
        <section className="py-16 px-6 max-w-[1400px] mx-auto bg-[#E5D3B3]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-white/80 p-8 flex flex-col items-center text-center shadow-sm border border-[#E5D3B3]/30">
                        <div className="w-16 h-16 bg-[#8B5E34] rounded-full flex items-center justify-center mb-6">
                            {feature.icon}
                        </div>
                        <h3 className="font-serif text-lg font-medium text-[#4A4A4A] mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-light">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
