import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ChatBot } from '@/components/chat/ChatBot'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from 'next-themes'
import SmoothScroll from '@/components/SmoothScroll'

import './globals.css'
import { ConditionalHeader } from "@/components/layout/ConditionalHeader"
import { ConditionalFooter } from "@/components/layout/ConditionalFooter"
import { LoadingProvider } from "@/components/LoadingProvider"
import { Toaster } from "@/components/ui/toaster"

import localFont from 'next/font/local'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const birds = localFont({
  src: './fonts/BirdsofParadise-PersonaluseOnly.woff2',
  variable: '--font-birds',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
}

export const metadata: Metadata = {
  title: 'Butterfly Couture | Luxury Fashion',
  description: 'Discover exquisite butterfly-inspired luxury fashion collection. Premium couture pieces crafted with elegance and sophistication.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${birds.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hasSeen = localStorage.getItem('hasSeenLoader');
                  if (!hasSeen) {
                    document.documentElement.classList.add('is-loading');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <LoadingProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <SmoothScroll>
                <ConditionalHeader />
                {children}
                <ConditionalFooter />
                <ChatBot />
                <Analytics />
              </SmoothScroll>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
