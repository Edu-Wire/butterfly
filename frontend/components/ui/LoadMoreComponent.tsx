'use client'

import React from 'react'
import { Loader2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface LoadMoreProps {
    onLoadMore: () => void
    isLoading: boolean
    hasMore: boolean
    className?: string
}

export function LoadMore({
    onLoadMore,
    isLoading,
    hasMore,
    className
}: LoadMoreProps) {
    if (!hasMore) return null

    return (
        <div className={cn("flex justify-center py-12", className)}>
            <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
                className="group relative overflow-hidden border-black text-black hover:bg-black hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        LOADING...
                    </>
                ) : (
                    <>
                        LOAD MORE
                        <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
                    </>
                )}
            </Button>
        </div>
    )
}
