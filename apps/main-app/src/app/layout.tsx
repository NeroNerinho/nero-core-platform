import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-black text-gray-100 antialiased min-h-screen relative overflow-x-hidden")}>
        <AnimatedBackground />
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="nero27-theme">
            <AuthProvider>
              <TenantProvider>
                <Shell>
                  {children}
                </Shell>
              </TenantProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
