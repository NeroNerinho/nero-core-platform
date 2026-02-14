import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond, VT323, Public_Sans, Space_Grotesk, JetBrains_Mono, Newsreader } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-cormorant' })
const vt323 = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323' })
const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-public' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const newsreader = Newsreader({ subsets: ['latin'], style: 'italic', variable: '--font-newsreader' })

export const metadata: Metadata = {
  title: 'NERO27 - Centro de Comando de Mídia',
  description: 'Plataforma SaaS para agências de publicidade gerenciarem campanhas de mídia e checking.',
}

import QueryProvider from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { TenantProvider } from '@/components/providers/TenantProvider'

import { AnimatedBackground } from '@/components/ui/animated-background'
import { Shell } from '@/components/layout/Shell'
import { ThemeEffects } from '@/components/layout/ThemeEffects'
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        playfair.variable,
        cormorant.variable,
        vt323.variable,
        publicSans.variable,
        spaceGrotesk.variable,
        jetbrainsMono.variable,
        newsreader.variable,
        "bg-background text-foreground antialiased min-h-screen relative overflow-x-hidden transition-colors duration-300"
      )}>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="nero27-theme">
            <ThemeEffects />
            <AnimatedBackground />
            <AuthProvider>
              <TenantProvider>
                <Shell>
                  {children}
                </Shell>
              </TenantProvider>
            </AuthProvider>
            <ThemeSwitcher />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
