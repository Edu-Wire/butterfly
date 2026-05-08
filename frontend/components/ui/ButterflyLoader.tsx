'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import animationData from './lottie-animation.json'

interface ButterflyLoaderProps {
    isLoading: boolean
}

export function ButterflyLoader({ isLoading }: ButterflyLoaderProps) {
    const [show, setShow] = useState(isLoading)
    const [isMounted, setIsMounted] = useState(false)
    const [isInitialMount, setIsInitialMount] = useState(true)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isLoading) {
            setShow(true)
            setIsInitialMount(false)
        } else {
            // If isLoading is false immediately on mount, don't show at all
            if (isInitialMount) {
                setShow(false)
            } else {
                const timer = setTimeout(() => setShow(false), 1000) // Stay visible briefly after load for smooth exit
                return () => clearTimeout(timer)
            }
        }
    }, [isLoading, isInitialMount])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="relative">
                        {/* Lottie Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.1, 1],
                                opacity: 1
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut"
                            }}
                            className="relative z-10 flex items-center justify-center"
                        >
                            <div className="w-48 h-48 flex items-center justify-center">
                                {isMounted && (
                                    <Lottie
                                        animationData={animationData}
                                        loop={true}
                                        autoplay={true}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
