// Placeholder for StatsGrid
'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, FileText } from 'lucide-react'

export function StatsGrid() {
    // Mock data for now, replace with API later
    const stats = [
        { title: "Total de Checkings", value: "1,234", icon: FileText, change: "+12%" },
        { title: "Aprovação Pendente", value: "56", icon: Activity, change: "+5%" },
        { title: "Usuários Ativos", value: "89", icon: Users, change: "+2%" },
        { title: "Receita Mensal", value: "R$ 45.2k", icon: DollarSign, change: "+8%" }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-black/40 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change} desde o último mês</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
