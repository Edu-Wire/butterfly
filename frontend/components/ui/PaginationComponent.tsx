'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null

    const renderPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Complex pagination with ellipses
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
            }
        }

        return pages.map((page, index) => {
            if (page === 'ellipsis') {
                return (
                    <span
                        key={`ellipsis-${index}`}
                        className="w-10 h-10 flex items-center justify-center text-stone-400"
                    >
                        <MoreHorizontal size={16} />
                    </span>
                )
            }

            const isCurrent = page === currentPage
            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page as number)}
                    className={cn(
                        "w-10 h-10 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full",
                        isCurrent
                            ? "bg-black text-white shadow-lg shadow-black/10"
                            : "text-stone-400 hover:text-black hover:bg-stone-50"
                    )}
                >
                    {page}
                </button>
            )
        })
    }

    return (
        <nav className={cn("flex items-center justify-center gap-2 py-12", className)}>
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center text-stone-900 disabled:text-stone-200 transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-1">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center text-stone-900 disabled:text-stone-200 transition-colors"
                aria-label="Next page"
            >
                <ChevronRight size={20} strokeWidth={1.5} />
            </button>
        </nav>
    )
}
