'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackToHomeButtonProps {
  className?: string
  variant?: 'default' | 'minimal' | 'elegant'
}

export function BackToHomeButton({ className = "", variant = 'default' }: BackToHomeButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg transition-all duration-200 font-medium text-sm md:text-base text-gray-900"

  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900 hover:text-black border border-gray-300",
    minimal: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    elegant: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
  }

  return (
    <Link
      href="/"
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
      {variant !== 'elegant' && (
        <span className="hidden sm:inline">Back to Home</span>
      )}
    </Link>
  )
}
