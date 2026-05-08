'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export function ThemeTest() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Current theme: <span className="font-mono font-bold">{theme}</span>
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setTheme('light')}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
        >
          System
        </button>
      </div>
    </div>
  )
}
