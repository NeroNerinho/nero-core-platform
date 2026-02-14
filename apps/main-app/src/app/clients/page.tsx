'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'

const clients = [
    {
        id: '1',
        name: 'Coca-Cola',
        document: '12.345.678/0001-90',
        email: 'marketing@coca-cola.com.br',
        phone: '(11) 99999-9999',
        status: 'active',
        projects: 12
    },
    {
        id: '2',
        name: 'Pepsi',
        document: '98.765.432/0001-10',
        email: 'contato@pepsi.com.br',
        phone: '(11) 88888-8888',
        status: 'active',
        projects: 8
    },
    {
        id: '3',
        name: 'Amazon',
        document: '45.678.901/0001-20',
        email: 'br-marketing@amazon.com',
        phone: '(11) 77777-7777',
        status: 'inactive',
        projects: 5
    },
]

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Clients</h2>
                    <p className="text-gray-400">Manage your client portfolio</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800 text-gray-100">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">All Clients</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search clients..."
                                className="pl-8 bg-gray-950 border-gray-800 text-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-900">
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Contact</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="text-gray-400 text-right">Projects</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id} className="border-gray-800 hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex flex-col">
                                            <span>{client.name}</span>
                                            <span className="text-xs text-gray-500">{client.document}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" /> {client.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3" /> {client.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="capitalize bg-green-900 text-green-200 hover:bg-green-800">
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-white">{client.projects}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">View details</DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Edit client</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-800" />
                                                <DropdownMenuItem className="text-red-400 hover:bg-gray-800 cursor-pointer">Delete client</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
