'use client'

import { StatsGrid } from "@/components/dashboard/StatsGrid"
import { RecentLogs } from "@/components/dashboard/RecentLogs"
import { DashboardCharts } from "@/components/dashboard/DashboardCharts"
import { LiveSystemStatus } from "@/components/dashboard/LiveSystemStatus"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-6 p-8 relative min-h-screen animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Painel de Aprovações</h1>
                    <p className="text-zinc-300 text-sm mt-1 drop-shadow-sm">
                        Sistema de aprovação de materiais - NERO27
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <StatsGrid />

            {/* Charts Section */}
            <DashboardCharts />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Approvals Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Clock className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Pendentes</h3>
                            <p className="text-sm text-zinc-400">Aguardando aprovação</p>
                        </div>
                    </div>
                    <Link href="/approvals?status=pending">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Pendentes <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Approved Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Aprovados</h3>
                            <p className="text-sm text-zinc-400">Materiais aprovados</p>
                        </div>
                    </div>
                    <Link href="/approvals?status=approved">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Aprovados <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Rejected Card */}
                <div className="rounded-xl border border-white/10 shadow-lg p-6 hover:shadow-xl transition-all bg-black/30 backdrop-blur-xl group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Reprovados</h3>
                            <p className="text-sm text-zinc-400">Materiais reprovados</p>
                        </div>
                    </div>
                    <Link href="/approvals?status=rejected">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                            Ver Reprovados <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Logs */}
            <RecentLogs />

            {/* Live System Status */}
            <LiveSystemStatus />
        </div>
    )
}
