'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
        <div className="flex-1 h-8"></div>
        <div className="flex-1 h-8"></div>
      </div>
    )
  }

  const isDarkMode = theme === 'dark'

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
      <button
        onClick={() => setTheme('light')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
          !isDarkMode
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <Sun size={16} />
        <span className="text-sm font-medium">Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
          isDarkMode
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <Moon size={16} />
        <span className="text-sm font-medium">Night</span>
      </button>
    </div>
  )
}
