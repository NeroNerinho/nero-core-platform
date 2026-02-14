import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlowCard, FadeIn } from '@/components/ui/motion'
import { FolderKanban, AlertCircle, DollarSign, CheckCircle } from 'lucide-react'

// Mock data type, in real app this comes from props
interface Stats {
    activeProjects: number
    pendingCheckings: number
    monthlyRevenue: number
    approvalRate: number
}

export function StatsCards({ stats = { activeProjects: 45, pendingCheckings: 23, monthlyRevenue: 2456890, approvalRate: 94.5 } }: { stats?: Stats }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FadeIn delay={0.1}>
                <GlowCard className="bg-black/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Projetos Ativos</CardTitle>
                        <FolderKanban className="h-4 w-4 text-secondary drop-shadow-[0_0_8px_rgba(0,200,255,0.5)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
                        <p className="text-xs text-gray-500">+12% mês passado</p>
                    </CardContent>
                </GlowCard>
            </FadeIn>

            <FadeIn delay={0.2}>
                <GlowCard className="bg-black/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Checkings Pendentes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.pendingCheckings}</div>
                        <p className="text-xs text-gray-500">-8% semana passada</p>
                    </CardContent>
                </GlowCard>
            </FadeIn>

            <FadeIn delay={0.3}>
                <GlowCard className="bg-black/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Receita Mensal</CardTitle>
                        <DollarSign className="h-4 w-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">R$ {stats.monthlyRevenue.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">+5% mês passado</p>
                    </CardContent>
                </GlowCard>
            </FadeIn>

            <FadeIn delay={0.4}>
                <GlowCard className="bg-black/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Taxa de Aprovação</CardTitle>
                        <CheckCircle className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.approvalRate}%</div>
                        <p className="text-xs text-gray-500">+2.3% mês passado</p>
                    </CardContent>
                </GlowCard>
            </FadeIn>
        </div>
    )
}
