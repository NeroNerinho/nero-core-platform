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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock, Download } from "lucide-react"

const mockLogs = [
    { date: '2024-02-13', start: '09:00', end: '12:00', total: '3h', project: 'PIT-2024-001' },
    { date: '2024-02-13', start: '13:00', end: '18:00', total: '5h', project: 'PIT-2024-001' },
]

export default function TimesheetPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Timesheet</h1>
                    <p className="text-muted-foreground">Registro de horas trabalhadas e produtividade.</p>
                </div>
                <Button variant="outline" className="border-gray-800">
                    <Download className="mr-2 h-4 w-4" /> Exportar PDF
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 bg-gray-900 border-gray-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" /> Registrar Horas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Projeto / PIT</Label>
                            <Input placeholder="Selecione o projeto..." className="bg-gray-950 border-gray-800" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Horário Inicial</Label>
                                <Input type="time" className="bg-gray-950 border-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Horário Final</Label>
                                <Input type="time" className="bg-gray-950 border-gray-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Data (DataTS)</Label>
                            <Input type="date" value="2024-02-13" className="bg-gray-950 border-gray-800 text-white shadow-[0_0_10px_rgba(0,0,0,1)] [color-scheme:dark]" />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Salvar Registro</Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                    <div className="rounded-md border border-gray-800 bg-gray-900/50 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent bg-gray-900">
                                    <TableHead>Data</TableHead>
                                    <TableHead>Projeto</TableHead>
                                    <TableHead>Início</TableHead>
                                    <TableHead>Fim</TableHead>
                                    <TableHead className="text-right">Jornada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLogs.map((log, i) => (
                                    <TableRow key={i} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell>{log.date}</TableCell>
                                        <TableCell>{log.project}</TableCell>
                                        <TableCell>{log.start}</TableCell>
                                        <TableCell>{log.end}</TableCell>
                                        <TableCell className="text-right font-medium text-blue-400">{log.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
