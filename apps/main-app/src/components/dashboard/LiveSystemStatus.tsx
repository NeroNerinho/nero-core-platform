'use client'
import { Badge } from "@/components/ui/badge"

export function LiveSystemStatus() {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
                <div className="relative w-2 h-2">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" />
                    <div className="relative w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-xs font-medium text-emerald-400">Sistema Online</span>
            </div>
        </div>
    )
}
