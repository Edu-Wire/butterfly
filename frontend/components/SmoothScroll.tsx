'use client';
import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    return (
        <ReactLenis
            root
            options={{
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
                prevent: (node) => {
                    // Prevent Lenis from handling scroll on elements with data-lenis-prevent
                    return node?.hasAttribute?.('data-lenis-prevent') || false;
                },
            }}
        >
            {children}
        </ReactLenis>
    );
}
