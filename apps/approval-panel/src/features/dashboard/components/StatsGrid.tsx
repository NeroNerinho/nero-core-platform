import { StatCard } from "@/components/ui/stat-card"
import { FileStack, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

interface StatsData {
    total: number
    pending: number
    approved: number
    rejected: number
}

/**
 * Fetches stats from n8n webhook
 * Uses action: 'get_stats' to fetch dashboard statistics
 * NO MOCK DATA - all data comes from n8n
 */
const fetchStats = async (): Promise<StatsData> => {
    const { data } = await api.post('', { action: 'get_stats' })
    return data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 }
}

export function StatsGrid() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStats,
        refetchInterval: 60000 // Refresh every minute
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="TOTAL DE REGISTROS"
                value={String(stats?.total || 0)}
                description="Total de materiais cadastrados"
                icon={FileStack}
                gradient="blue"
            />
            <StatCard
                title="PENDENTES"
                value={String(stats?.pending || 0)}
                description="Aguardando aprovação"
                icon={Clock}
                gradient="amber"
            />
            <StatCard
                title="APROVADOS"
                value={String(stats?.approved || 0)}
                description="Materiais aprovados"
                icon={CheckCircle2}
                gradient="green"
            />
            <StatCard
                title="REPROVADOS"
                value={String(stats?.rejected || 0)}
                description="Materiais reprovados"
                icon={AlertCircle}
                gradient="red"
            />
        </div>
    )
}
