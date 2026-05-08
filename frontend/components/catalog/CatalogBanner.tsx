'use client';

interface CatalogBannerProps {
    topTitle?: string;
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
}

export function CatalogBanner({ topTitle, title, subtitle, backgroundImage }: CatalogBannerProps = {}) {
    return (
        <div
            className="w-full flex items-end px-6 md:px-8 relative border-b border-gray-200 min-h-[400px] md:h-[600px] z-[150]"
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="relative z-[150] max-w-[1400px] mx-auto w-full pb-12 md:pb-16 text-left">
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-6xl font-birds text-red-600 font-normal tracking-wide">
                        {topTitle || 'Discover'}
                    </h2>
                    <h3 className="text-2xl md:text-4xl font-sans font-semibold uppercase tracking-wider text-white">
                        {title || 'CATALOG'}
                    </h3>
                    {subtitle && (
                        <p className="text-lg text-white mt-2 opacity-90 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
