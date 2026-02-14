'use client'

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme =
    | 'abstracao' | 'geometria' | 'cyberpunk' | 'darkness'
    | 'retro' | 'renascimento' | 'ux-precision' | 'noir'
    | 'antique' | 'quantum-sync' | 'blueprint' | 'terminal'
    | 'light' | 'dark' | 'system'

const THEME_CLASSES = [
    'theme-abstracao', 'theme-geometria', 'theme-cyberpunk', 'theme-darkness',
    'theme-retro', 'theme-renascimento', 'theme-ux-precision', 'theme-noir',
    'theme-antique', 'theme-quantum-sync', 'theme-blueprint', 'theme-terminal'
]

const LIGHT_THEMES: Theme[] = ['renascimento', 'ux-precision', 'antique', 'light']

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeProviderState>({
    theme: "dark",
    setTheme: () => null,
})

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "nero27-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        // 1. Remove all specific theme classes
        root.classList.remove(...THEME_CLASSES)

        // 2. Clear base classes
        root.classList.remove('light', 'dark')

        // 3. Determine base mode (Light or Dark)
        let baseMode: 'light' | 'dark' = 'dark' // Default to dark for most Nero designs

        if (theme === 'system') {
            baseMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else if (LIGHT_THEMES.includes(theme)) {
            baseMode = 'light'
        }

        root.classList.add(baseMode)

        // 4. Apply specific theme identity
        if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
            root.classList.add(`theme-${theme}`)
        }

        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        },
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
