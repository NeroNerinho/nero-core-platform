import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, AlertCircle, DollarSign, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardsProps {
    stats: {
        activeProjects: number
        pendingCheckings: number
        monthlyRevenue: number
        approvalRate: number
    }
    loading?: boolean
}

export function StatsCards({ stats, loading = false }: StatsCardsProps) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-[#262626] border-[#333] h-32 animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Active Projects */}
            <Card className="bg-[#262626] border-[#333] text-white hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg hover:border-[#2E75B6]/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
                    <FolderKanban className="h-4 w-4 text-[#2E75B6]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeProjects}</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" /> +12% vs last month
                    </p>
                    <p className="text-xs text-gray-500 mt-1">12 added this month</p>
                </CardContent>
            </Card>

            {/* Pending Checkings */}
            <Card className={`bg-[#262626] border-[#333] text-white hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg hover:border-yellow-500/50`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Pending Checkings</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${stats.pendingCheckings > 20 ? "text-red-500" : "text-yellow-500"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingCheckings}</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingDown className="h-3 w-3 mr-1" /> -8% vs last week
                    </p>
                    {stats.pendingCheckings > 20 && (
                        <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full mt-2 inline-block">Needs attention</span>
                    )}
                </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card className="bg-[#262626] border-[#333] text-white hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg hover:border-green-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.monthlyRevenue)}
                    </div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" /> +5% vs last month
                    </p>
                    <p className="text-xs text-gray-500 mt-1">R$ 820k in contracts</p>
                </CardContent>
            </Card>

            {/* Approval Rate */}
            <Card className="bg-[#262626] border-[#333] text-white hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg hover:border-purple-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Approval Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.approvalRate.toFixed(1)}%</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" /> +2.3% vs last month
                    </p>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                        <div
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(stats.approvalRate, 100)}%` }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
