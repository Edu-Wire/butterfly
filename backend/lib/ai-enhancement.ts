export interface AIVariant {
    id: string;
    url: string;
    type: string;
    description?: string;
    prompt?: string;
}

export interface BannerEnhancement {
    originalUrl: string;
    variants: AIVariant[];
}

export const ENHANCEMENT_TYPES = [
    {
        id: 'contrast',
        name: 'Add Contrast',
        description: 'Actually boost contrast and cinematic depth.'
    },
    {
        id: 'lighting',
        name: 'Add Light',
        description: 'Professional high-key lighting and exposure lift.'
    },
    {
        id: 'sharpen',
        name: 'Add Sharpen',
        description: 'Maximum crisp detail and ultra-sharp professional edges.'
    }
];
