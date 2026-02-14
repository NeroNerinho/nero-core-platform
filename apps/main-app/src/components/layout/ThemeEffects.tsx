"use client"

import * as React from "react"
import { useTheme } from "@/components/providers/ThemeProvider"

export function ThemeEffects() {
    const { theme } = useTheme()

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* 1. Scanlines for Cyberpunk, Retro, Terminal */}
            {(theme === 'cyberpunk' || theme === 'retro' || theme === 'terminal' || theme === 'darkness') && (
                <div className="scanlines absolute inset-0 opacity-[0.15]" />
            )}

            {/* 2. Blueprint Grid for Geometria and Blueprint themes */}
            {(theme === 'geometria' || theme === 'blueprint') && (
                <div className="blueprint-grid absolute inset-0 opacity-[0.2]" />
            )}

            {/* 3. Pixel Grid for UX Precision and Abstracao */}
            {(theme === 'ux-precision' || theme === 'abstracao' || theme === 'quantum-sync') && (
                <div className="pixel-grid absolute inset-0 opacity-[0.1]" />
            )}

            {/* 4. Film Grain for Noir */}
            {theme === 'noir' && (
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150" />
            )}

            {/* 5. Parchment Texture for Renascimento and Antique */}
            {(theme === 'renascimento' || theme === 'antique') && (
                <div className="absolute inset-0 bg-[#f4e4bc] opacity-[0.03] mix-blend-multiply" />
            )}
        </div>
    )
}
