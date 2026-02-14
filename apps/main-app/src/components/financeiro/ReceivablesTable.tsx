'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getReceivables, type ReceivableTitle } from '@/app/actions/finance';
import { FileCode, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function ReceivablesTable() {
    const [titles, setTitles] = useState<ReceivableTitle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getReceivables();
                setTitles(data);
            } catch (error) {
                toast.error('Erro ao carregar títulos');
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const handleGenerateSlip = (id: string) => {
        toast.success(`Gerando boleto para título ${id}...`);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Pagador</TableHead>
                        <TableHead>Emissão</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span>Carregando financeiro...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : titles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                Nenhum título encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        titles.map((title, index) => (
                            <motion.tr
                                key={title.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <TableCell className="font-medium">{title.titleNumber}</TableCell>
                                <TableCell>{title.payerName}</TableCell>
                                <TableCell>{new Date(title.issueDate).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell>{new Date(title.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell>{title.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                <TableCell>
                                    <Badge variant={title.status === 'open' ? 'secondary' : 'default'} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/50">
                                        {title.status === 'open' ? 'Aberto' : 'Pago'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleGenerateSlip(title.titleNumber)}
                                        className="gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                                    >
                                        <FileCode className="h-4 w-4" /> Gerar Boleto
                                    </Button>
                                </TableCell>
                            </motion.tr>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
