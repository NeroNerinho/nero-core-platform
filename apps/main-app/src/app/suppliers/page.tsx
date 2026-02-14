'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Star, MapPin } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'

const suppliers = [
    {
        id: '1',
        name: 'Clear Channel',
        type: 'OOH',
        rating: 4.8,
        location: 'São Paulo, SP',
        checkings: 1540,
        status: 'verified'
    },
    {
        id: '2',
        name: 'JCDecaux',
        type: 'OOH',
        rating: 4.9,
        location: 'Rio de Janeiro, RJ',
        checkings: 2300,
        status: 'verified'
    },
    {
        id: '3',
        name: 'Eletromidia',
        type: 'Digital',
        rating: 4.7,
        location: 'Curitiba, PR',
        checkings: 890,
        status: 'pending'
    },
]

export default function SuppliersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Suppliers</h2>
                    <p className="text-gray-400">Manage media partners and vendors</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Supplier
                </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800 text-gray-100">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">All Suppliers</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search suppliers..."
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
                                <TableHead className="text-gray-400">Type</TableHead>
                                <TableHead className="text-gray-400">Rating</TableHead>
                                <TableHead className="text-gray-400">Checkings</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((supplier) => (
                                <TableRow key={supplier.id} className="border-gray-800 hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex flex-col">
                                            <span>{supplier.name}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin className="h-3 w-3" /> {supplier.location}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                                            {supplier.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-white">{supplier.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white">{supplier.checkings}</TableCell>
                                    <TableCell>
                                        {supplier.status === 'verified' ? (
                                            <div className="flex items-center gap-1 text-blue-400 text-xs">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Verified
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <div className="h-1.5 w-1.5 rounded-full bg-gray-500" /> Pending
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
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
