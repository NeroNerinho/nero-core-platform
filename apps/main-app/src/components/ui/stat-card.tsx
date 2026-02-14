import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    gradient?: 'primary' | 'secondary' | 'green' | 'red'
}

const gradients = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
    green: 'from-emerald-500/10 to- emerald-500/5 border-emerald-500/20',
    red: 'from-red-500/10 to-rose-500/5 border-red-500/20',
}

export function StatCard({ title, value, description, icon: Icon, gradient = 'primary' }: StatCardProps) {
    return (
        <Card className={cn('bg-white/5 backdrop-blur-md border-white/10 shadow-xl overflow-hidden group', gradients[gradient])}>
            <div className="absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {title}
                </CardTitle>
                <div className={cn(
                    "p-2 rounded-lg bg-white/5 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500",
                    gradient === 'primary' && 'text-primary border-primary/20',
                    gradient === 'secondary' && 'text-secondary border-secondary/20',
                    gradient === 'green' && 'text-emerald-400 border-emerald-500/20',
                    gradient === 'red' && 'text-red-400 border-red-500/20'
                )}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-4xl font-black tracking-tighter text-white mb-1 group-hover:translate-x-1 transition-transform duration-500">
                    {value}
                </div>
                {description && (
                    <p className="text-xs text-gray-500 font-medium tracking-tight">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
