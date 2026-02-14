import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"

const columns = [
    {
        title: 'A Fazer', tasks: [
            { id: '1', title: 'Criar KV Campanha Inverno', client: 'Boticário', priority: 'Média' },
            { id: '2', title: 'Ajustar PIT #402', client: 'Uninter', priority: 'Alta' },
        ]
    },
    {
        title: 'Em Execução', tasks: [
            { id: '3', title: 'Desenvolver Landing Page', client: 'NERO27', priority: 'Alta' },
        ]
    },
    {
        title: 'Revisão / Aprovação', tasks: [
            { id: '4', title: 'Revisão Texto Editorial', client: 'Vale', priority: 'Baixa' },
        ]
    },
    {
        title: 'Concluído', tasks: [
            { id: '5', title: 'Envio de Materiais TV', client: 'Uninter', priority: 'Alta' },
        ]
    },
]

export default function KanbanPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kanban</h1>
                    <p className="text-muted-foreground">Acompanhamento visual de tarefas e projetos.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-max">
                    {columns.map((column) => (
                        <div key={column.title} className="w-80 flex flex-col space-y-4">
                            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-t-lg border-b-2 border-blue-600">
                                <h2 className="font-semibold text-sm">{column.title}</h2>
                                <Badge variant="secondary" className="bg-gray-800">{column.tasks.length}</Badge>
                            </div>

                            <div className="flex-1 space-y-3 p-1">
                                {column.tasks.map((task) => (
                                    <Card key={task.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                                        <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                                            <div className="space-y-1">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] px-1 py-0",
                                                    task.priority === 'Alta' ? "border-red-500 text-red-500" :
                                                        task.priority === 'Média' ? "border-yellow-500 text-yellow-500" :
                                                            "border-green-500 text-green-500"
                                                )}>
                                                    {task.priority}
                                                </Badge>
                                                <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">
                                                    {task.title}
                                                </CardTitle>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-xs text-blue-400">{task.client}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="ghost" className="w-full justify-start text-xs text-gray-500 hover:text-white hover:bg-gray-800">
                                    <Plus className="mr-2 h-3 w-3" /> Adicionar tarefa
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
