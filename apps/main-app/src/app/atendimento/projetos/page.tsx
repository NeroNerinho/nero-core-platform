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
import { Plus, Search, Filter } from "lucide-react"

const mockPITs = [
    { id: 'PIT-2024-001', client: 'Uninter', project: 'Campanha Vestibular 2024', status: 'Em Andamento', deadline: '2024-03-20' },
    { id: 'PIT-2024-002', client: 'NERO27', project: 'Site NERO27 Development', status: 'Planejamento', deadline: '2024-04-05' },
    { id: 'PIT-2024-003', client: 'Boticário', project: 'Promoção Dia das Mães', status: 'Concluído', deadline: '2024-02-15' },
    { id: 'PIT-2024-004', client: 'Vale', project: 'Relatório ESG 2023', status: 'Aguardando Aprovação', deadline: '2024-03-01' },
]

export default function ProjetosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projetos (PIT)</h1>
                    <p className="text-muted-foreground">Gestão integrada de briefings, prazos e demandas internas.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Buscar por cliente ou projeto..." className="pl-8 bg-gray-900 border-gray-800" />
                </div>
                <Button variant="outline" className="border-gray-800">
                    <Filter className="mr-2 h-4 w-4" /> Filtros
                </Button>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                            <TableHead className="w-[150px]">ID / PIT</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Projeto</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Prazo Campaign</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPITs.map((pit) => (
                            <TableRow key={pit.id} className="border-gray-800 hover:bg-gray-800/50">
                                <TableCell className="font-medium">{pit.id}</TableCell>
                                <TableCell>{pit.client}</TableCell>
                                <TableCell>{pit.project}</TableCell>
                                <TableCell>
                                    <Badge variant={pit.status === 'Concluído' ? 'secondary' : 'outline'} className="bg-gray-800 border-gray-700">
                                        {pit.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{pit.deadline}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
