"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Palette, Zap, Box, Compass, Terminal as TerminalIcon } from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const THEME_FAMILIES = [
    {
        name: "Cyber-Renaissance",
        icon: Zap,
        themes: [
            { id: "abstracao", label: "Abstração Quântica", color: "#06e8f9" },
            { id: "cyberpunk", label: "Cyberpunk Neural", color: "#fdf500" },
            { id: "quantum-sync", label: "Quantum Sync", color: "#a855f7" },
        ],
    },
    {
        name: "Technical/Blueprint",
        icon: Box,
        themes: [
            { id: "geometria", label: "Geometria Estrutural", color: "#3b82f6" },
            { id: "blueprint", label: "Structural Blueprint", color: "#0a192f" },
            { id: "ux-precision", label: "UX Precision Studio", color: "#ec5b13" },
        ],
    },
    {
        name: "Classical/Technical",
        icon: Compass,
        themes: [
            { id: "renascimento", label: "Renascimento Técnico", color: "#1152d4" },
            { id: "antique", label: "Technical Antiquity", color: "#78350f" },
            { id: "noir", label: "Noir Cinephile", color: "#ffffff" },
        ],
    },
    {
        name: "Retro/Terminal",
        icon: TerminalIcon,
        themes: [
            { id: "retro", label: "Arcade Retro", color: "#ec4899" },
            { id: "terminal", label: "Legacy Terminal", color: "#22c55e" },
            { id: "darkness", label: "Occult Darkness", color: "#f97316" },
        ],
    },
]

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-2xl bg-background border-primary/20 hover:border-primary transition-all">
                        <Palette className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuLabel className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Identidades de Design</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {THEME_FAMILIES.map((family) => (
                        <DropdownMenuGroup key={family.name}>
                            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <family.icon className="h-3 w-3" />
                                {family.name}
                            </div>
                            {family.themes.map((t) => (
                                <DropdownMenuItem
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    className={cn(
                                        "flex items-center justify-between cursor-pointer",
                                        theme === t.id && "bg-accent"
                                    )}
                                >
                                    <span>{t.label}</span>
                                    <div
                                        className="h-3 w-3 rounded-full border border-border"
                                        style={{ backgroundColor: t.color }}
                                    />
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                        </DropdownMenuGroup>
                    ))}

                    <DropdownMenuGroup>
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Monitor className="h-3 w-3" />
                            Base System
                        </div>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
