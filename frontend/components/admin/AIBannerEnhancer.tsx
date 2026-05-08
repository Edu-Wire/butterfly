'use client'

import { useState } from 'react'
import { Sparkles, Image as ImageIcon, Check, Loader2, Wand2, Lightbulb, Palette } from 'lucide-react'
import Image from 'next/image'
import { AIVariant, BannerEnhancement, ENHANCEMENT_TYPES } from '@/lib/ai-enhancement'
import { showToast } from '@/lib/toast-utils'

interface AIBannerEnhancerProps {
    originalImage: string
    collectionName?: string
    onVariantSelect: (variant: AIVariant) => void
    onEnhancementComplete: (enhancement: BannerEnhancement) => void
}

export function AIBannerEnhancer({ originalImage, collectionName, onVariantSelect, onEnhancementComplete }: AIBannerEnhancerProps) {
    const [selectedType, setSelectedType] = useState('contrast')
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [variants, setVariants] = useState<AIVariant[]>([])
    const [activeVariantId, setActiveVariantId] = useState<string | null>(null)

    const handleEnhance = async () => {
        setIsEnhancing(true)
        setVariants([]) // Clear existing
        try {
            const res = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: originalImage,
                    type: selectedType
                })
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'API failed')

            const newVariant = data.variant
            setVariants([newVariant])
            onEnhancementComplete({
                originalUrl: originalImage,
                variants: [newVariant]
            })
        } catch (error: any) {
            console.error('Enhancement failed:', error)
            showToast.error(`AI Enhancement failed: ${error.message}. Please try again.`)
        } finally {
            setIsEnhancing(false)
        }
    }

    const selectVariant = (variant: AIVariant) => {
        setActiveVariantId(variant.id)
        onVariantSelect(variant)
    }

    const getTypeIcon = (id: string) => {
        switch (id) {
            case 'contrast': return <Palette size={20} />
            case 'lighting': return <Lightbulb size={20} />
            case 'sharpen': return <Wand2 size={20} />
            default: return <Sparkles size={20} />
        }
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Preview & Controls */}
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group">
                        <Image
                            src={originalImage}
                            alt="Original"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                            Original Asset
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[#003300] uppercase tracking-wider">Select Enhancement Mode</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {ENHANCEMENT_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${selectedType === type.id
                                        ? 'bg-[#003300] text-white border-[#003300] shadow-lg scale-[1.02]'
                                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#D7C69D] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`mb-3 p-2 rounded-xl ${selectedType === type.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        {getTypeIcon(type.id)}
                                    </div>
                                    <span className="font-bold text-sm mb-1">{type.name}</span>
                                    <span className={`text-[10px] leading-tight ${selectedType === type.id ? 'text-white/70' : 'text-gray-400'}`}>
                                        {type.description}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleEnhance}
                        disabled={isEnhancing}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-600/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 overflow-hidden relative group"
                    >
                        {isEnhancing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>AI is reimagining your banner...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                <span>Generate AI Variants</span>
                            </>
                        )}
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-[#003300] uppercase tracking-wider">AI Generated Variants</h3>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                            {variants.length} RESULTS
                        </span>
                    </div>

                    {variants.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {variants.map((variant) => (
                                <div
                                    key={variant.id}
                                    onClick={() => selectVariant(variant)}
                                    className={`group relative aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all border-4 ${activeVariantId === variant.id ? 'border-purple-600' : 'border-transparent hover:border-purple-200'
                                        }`}
                                >
                                    <Image
                                        src={variant.url}
                                        alt="AI Variant"
                                        fill
                                        className="object-cover transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                        {activeVariantId === variant.id ? (
                                            <div className="bg-purple-600 text-white p-3 rounded-full shadow-xl animate-in zoom-in">
                                                <Check size={24} />
                                            </div>
                                        ) : (
                                            <div className="bg-white/90 text-[#003300] px-4 py-2 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                                                Select this variant
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-purple-600 uppercase shadow-sm">
                                            {variant.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isEnhancing ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" size={24} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[#003300] font-bold text-lg animate-pulse">Professional Studio Retouching...</p>
                                <p className="text-gray-400 text-[10px] max-w-[200px] mx-auto">
                                    Our AI is performing high-fidelity adjustments to lighting, contrast, and color balance while preserving 100% of your original image.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 shadow-sm border border-gray-50">
                                <ImageIcon size={40} />
                            </div>
                            <div>
                                <p className="text-[#003300] font-bold">No variants yet</p>
                                <p className="text-gray-400 text-xs max-w-[200px] mx-auto mt-1">
                                    Select a mode and click generate to see AI magic happen.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
      `}</style>
        </div>
    )
}
