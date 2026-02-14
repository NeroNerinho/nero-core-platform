'use client'

import { Bell, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobalSearch } from './GlobalSearch'
import { useTheme } from '@/components/providers/ThemeProvider'

export function Header() {
    const { theme, setTheme } = useTheme()

    return (
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 relative z-50">
            <div className="flex-1 max-w-2xl">
                <GlobalSearch />
            </div>
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-gray-400 hover:text-white"
                >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </Button>
                <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">N27</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
