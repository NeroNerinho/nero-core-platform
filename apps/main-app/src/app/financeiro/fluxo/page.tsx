'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', Entradas: 4000, Saidas: 2400 },
    { name: 'Fev', Entradas: 3000, Saidas: 1398 },
    { name: 'Mar', Entradas: 2000, Saidas: 9800 },
    { name: 'Abr', Entradas: 2780, Saidas: 3908 },
    { name: 'Mai', Entradas: 1890, Saidas: 4800 },
    { name: 'Jun', Entradas: 2390, Saidas: 3800 },
];

export default function FluxoDeCaixaPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
                    <p className="text-muted-foreground">
                        Visão consolidada da posição financeira.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 45.231,89</div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas (Mês)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">R$ +12.350,00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saídas (Mês)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">R$ -8.240,00</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Entradas</span>
                                                            <span className="font-bold text-green-600">R${payload[0].value}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Saídas</span>
                                                            <span className="font-bold text-red-600">R${payload[1].value}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar dataKey="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Títulos em Atraso</CardTitle>
                        <CardDescription>Cobranças pendentes e pagamentos vencidos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="receber" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="receber">A Receber</TabsTrigger>
                                <TabsTrigger value="pagar">A Pagar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="receber">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pagador</TableHead>
                                            <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Empresa X</TableCell>
                                            <TableCell className="text-right font-medium text-red-500">R$ 1.200,00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Consultoria Y</TableCell>
                                            <TableCell className="text-right font-medium text-red-500">R$ 850,00</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="pagar">
                                <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
                                    Nenhum título a pagar em atraso.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
