import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ListChecks, Search, Tv, MapPin, Send } from "lucide-react"

const mockPlans = [
    { id: 'PLN-24-01', camp: 'Vestibular de Inverno', vehicle: 'RPC Globo', type: 'TV', period: 'Jul/2024', pi: 'PI-8821', status: 'Emitido' },
    { id: 'PLN-24-02', camp: 'Promoção Dia das Mães', vehicle: 'Instagram / FB', type: 'Digital', period: 'Mai/2024', pi: 'PI-8902', status: 'Pendente' },
    { id: 'PLN-24-03', camp: 'OOH Curitiba', vehicle: 'Clear Channel', type: 'OOH', period: 'Jun/2024', pi: 'PI-9012', status: 'Em Aberto' },
]

export default function PlanoPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plano de Mídia</h1>
                    <p className="text-muted-foreground">Planejamento, reserva e emissão de Pedidos de Inserção (PI).</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-800">
                        <MapPin className="mr-2 h-4 w-4" /> Mapa de Reserva
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" /> Emitir PIs
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                        <Tv className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">TV / Rádio</p>
                        <p className="text-lg font-bold text-white">45%</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <div className="p-2 bg-green-500/10 rounded-full">
                        <ListChecks className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Projetos Ativos</p>
                        <p className="text-lg font-bold text-white">12</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                        <Search className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Check-in Eletrônico</p>
                        <p className="text-lg font-bold text-white">Ok</p>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                            <TableHead className="w-[100px]">Cod</TableHead>
                            <TableHead>Campanha</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Período</TableHead>
                            <TableHead>PI Ref</TableHead>
                            <TableHead className="text-right">Status PI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPlans.map((plan) => (
                            <TableRow key={plan.id} className="border-gray-800 hover:bg-gray-800/50">
                                <TableCell className="font-medium text-gray-400">{plan.id}</TableCell>
                                <TableCell className="font-medium">{plan.camp}</TableCell>
                                <TableCell>{plan.vehicle}</TableCell>
                                <TableCell>{plan.type}</TableCell>
                                <TableCell>{plan.period}</TableCell>
                                <TableCell className="text-blue-400 underline cursor-pointer">{plan.pi}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={cn(
                                        "bg-gray-800 border-gray-700",
                                        plan.status === 'Emitido' ? "text-green-500" :
                                            plan.status === 'Pendente' ? "text-yellow-500" :
                                                "text-gray-400"
                                    )}>
                                        {plan.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
