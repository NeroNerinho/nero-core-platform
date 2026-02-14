'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from './AppSidebar'
import { cn } from '@/lib/utils'

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Hide sidebar on public routes and portal
    const isPublic = pathname === '/login' || pathname === '/signup' || pathname === '/' || pathname.startsWith('/portal')

    if (isPublic) {
        return <main className="flex-1 h-screen overflow-y-auto relative">{children}</main>
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-transparent">
            <div className="flex-none h-full z-20">
                <AppSidebar />
            </div>
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <main className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    )
}
