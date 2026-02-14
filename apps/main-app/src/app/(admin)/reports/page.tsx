'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { exportToExcel, exportToPDF, printReport, type ExportColumn } from "@/lib/exportUtils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    FileSpreadsheet,
    FileText,
    Printer,
    Search,
    Filter,
    Download,
    RefreshCw,
    Calendar,
    Loader2,
    PieChart,
    ArrowUpRight
} from "lucide-react"

interface ReportFilters {
    status: string
    dateFrom: string
    dateTo: string
    cliente: string
}

interface ApprovalLog {
    id: string
    checking_id: string
    action: 'approve' | 'reject'
    user: string
    timestamp: string
    n_pi: string
    cliente: string
    reason?: string
}

const reportColumns: ExportColumn[] = [
    { header: 'Data', key: 'timestamp', width: 18 },
    { header: 'PI', key: 'n_pi', width: 12 },
    { header: 'Cliente', key: 'cliente', width: 25 },
    { header: 'Ação', key: 'action', width: 12 },
    { header: 'Usuário', key: 'user', width: 25 },
    { header: 'Motivo', key: 'reason', width: 35 }
]

export default function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>({
        status: 'all',
        dateFrom: '',
        dateTo: '',
        cliente: ''
    })
    const [activeTab, setActiveTab] = useState<'logs' | 'checkings'>('logs')

    const { data: logs, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['approval-logs', filters],
        queryFn: async () => {
            const data = await apiRequest('get_logs', filters)
            return data.logs as ApprovalLog[]
        }
    })

    const handleExportExcel = () => {
        if (!logs || logs.length === 0) return
        exportToExcel(logs, reportColumns, 'historico_aprovacoes')
    }

    const handleExportPDF = () => {
        if (!logs || logs.length === 0) return
        exportToPDF(logs, reportColumns, 'Histórico de Aprovações', 'historico_aprovacoes')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Relatórios & Logs</h1>
                    <p className="text-secondary font-medium tracking-tight flex items-center gap-2">
                        Auditagem completa do sistema de checking
                        <ArrowUpRight className="h-3 w-3" />
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="text-gray-400 hover:text-primary"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="flex rounded-lg bg-white/5 border border-white/10 p-1 backdrop-blur-md">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('logs')}
                            className={activeTab === 'logs' ? 'bg-white/10 text-white' : 'text-gray-500'}
                        >
                            HISTÓRICO
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('checkings')}
                            className={activeTab === 'checkings' ? 'bg-white/10 text-white' : 'text-gray-500'}
                        >
                            ESTATÍSTICAS
                        </Button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            Filtros de Busca
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                                    <SelectItem value="APROVADO">Aprovado</SelectItem>
                                    <SelectItem value="REPROVADO">Reprovado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Período</Label>
                            <div className="space-y-2">
                                <Input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className="bg-black/40 border-white/10 text-white text-xs h-9"
                                />
                                <Input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className="bg-black/40 border-white/10 text-white text-xs h-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Cliente</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                <Input
                                    placeholder="Nome do cliente..."
                                    value={filters.cliente}
                                    onChange={(e) => setFilters(prev => ({ ...prev, cliente: e.target.value }))}
                                    className="pl-9 bg-black/40 border-white/10 text-white text-xs h-9"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-black font-black text-xs h-10 shadow-lg shadow-primary/10"
                            onClick={() => refetch()}
                        >
                            APLICAR FILTROS
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
                            <div>
                                <CardTitle className="text-lg font-black text-white">Histórico Detalhado</CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
                                    {logs?.length || 0} registros auditados
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleExportExcel}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-black h-8"
                                >
                                    <FileSpreadsheet className="h-3 w-3 mr-1" /> EXCEL
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleExportPDF}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black h-8"
                                >
                                    <FileText className="h-3 w-3 mr-1" /> PDF
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Compilando Dados...</p>
                                </div>
                            ) : !logs || logs.length === 0 ? (
                                <div className="p-20 text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                        <FileText className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase text-xs">Nenhum resultado para estes filtros</p>
                                </div>
                            ) : (
                                <div className="relative overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/2">
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="text-[10px] font-black text-gray-400 uppercase">Timeline</TableHead>
                                                <TableHead className="text-[10px] font-black text-gray-400 uppercase">Referência</TableHead>
                                                <TableHead className="text-[10px] font-black text-gray-400 uppercase">Cliente</TableHead>
                                                <TableHead className="text-[10px] font-black text-gray-400 uppercase">Ação</TableHead>
                                                <TableHead className="text-[10px] font-black text-gray-400 uppercase">Analista</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {logs.map((log) => (
                                                <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-mono text-[10px] text-gray-500">
                                                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-white tracking-widest text-xs">PI: {log.n_pi}</TableCell>
                                                    <TableCell className="text-xs text-gray-300 group-hover:text-white transition-colors capitalize">{log.cliente.toLowerCase()}</TableCell>
                                                    <TableCell>
                                                        <Badge className={`${log.action === 'approve' ? 'bg-emerald-500' : 'bg-red-500'
                                                            } text-black font-black text-[9px] border-0 py-0.5`}>
                                                            {log.action === 'approve' ? 'APROVADO' : 'REPROVADO'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-gray-400 font-medium">
                                                        {log.user.split('@')[0]}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                                <PieChart className="h-8 w-8 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Exploração de Tendências</h3>
                                <p className="text-xs text-gray-500 font-medium">Os filtros selecionados abrangem 14 agências e 32 campanhas ativas.</p>
                            </div>
                            <Button className="ml-auto bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-[10px] font-black">
                                VER INSIGHTS
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
