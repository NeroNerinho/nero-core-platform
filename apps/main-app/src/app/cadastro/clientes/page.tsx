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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Building2 } from "lucide-react"

const mockClients = [
    { id: '1', name: 'Uninter', cnpj: '00.123.456/0001-01', city: 'Curitiba', segment: 'Educação' },
    { id: '2', name: 'Boticário', cnpj: '11.222.333/0001-22', city: 'São José dos Pinhais', segment: 'Varejo' },
]

export default function ClientesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cadastro de Clientes</h1>
                    <p className="text-muted-foreground">Gerenciamento completo da base de clientes e integrações RFB.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Busque os dados automaticamente pelo CNPJ na Receita Federal.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ (Receita Federal)</Label>
                                <div className="flex gap-2">
                                    <Input id="cnpj" placeholder="00.000.000/0000-00" className="bg-gray-950 border-gray-800" />
                                    <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700">Buscar</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Razão Social / Nome Fantasia</Label>
                                <Input id="name" className="bg-gray-950 border-gray-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" className="bg-gray-950 border-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="segment">Segmento</Label>
                                    <Input id="segment" className="bg-gray-950 border-gray-800" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">Salvar Cliente</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Buscar por nome, CNPJ ou cidade..." className="pl-8 bg-gray-900 border-gray-800" />
                </div>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                            <TableHead>Razão Social</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>Cidade / UF</TableHead>
                            <TableHead>Segmento</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockClients.map((client) => (
                            <TableRow key={client.id} className="border-gray-800 hover:bg-gray-800/50">
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    {client.name}
                                </TableCell>
                                <TableCell>{client.cnpj}</TableCell>
                                <TableCell>{client.city}</TableCell>
                                <TableCell>{client.segment}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-blue-500">Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
