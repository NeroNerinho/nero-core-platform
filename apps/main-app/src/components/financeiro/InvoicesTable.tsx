'use client';

import React, { useState } from 'react';
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
import { Invoice } from '@/types/financeiro';
import { FileText, Send, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data for initial display
const MOCK_INVOICES: Invoice[] = [
    {
        id: '1',
        number: 'NFS-001',
        sacadoEmail: 'cliente@exemplo.com',
        value: 1500.00,
        issueDate: '2025-10-01',
        dueDate: '2025-10-15',
        status: 'pending',
        lastUpdate: '2025-10-01'
    },
    {
        id: '2',
        number: 'NFS-002',
        sacadoEmail: 'empresa@parceira.com.br',
        value: 2350.50,
        issueDate: '2025-10-02',
        dueDate: '2025-10-20',
        status: 'paid',
        lastUpdate: '2025-10-18',
        pdfUrl: '#'
    }
];

export function InvoicesTable() {
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

    const handleSendNfe = (id: string) => {
        toast.success(`Enviando NFS-e ${id} para Tecnospeed...`);
        // Simulate API call
        setTimeout(() => {
            toast.success(`NFS-e ${id} enviada com sucesso!`);
        }, 1500);
    };

    const statusMap: Record<string, string> = {
        pending: 'Pendente',
        paid: 'Pago',
        cancelled: 'Cancelado',
        overdue: 'Atrasado'
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Sacado (E-mail)</TableHead>
                        <TableHead>Valor (R$)</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.number}</TableCell>
                            <TableCell>{invoice.sacadoEmail}</TableCell>
                            <TableCell>{invoice.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                                <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                    {statusMap[invoice.status]}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button size="icon" variant="ghost" title="Ver Arquivos">
                                    <Eye className="h-4 w-4" />
                                </Button>
                                {invoice.status === 'pending' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleSendNfe(invoice.number)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Enviar
                                    </Button>
                                )}
                                {invoice.pdfUrl && (
                                    <Button size="icon" variant="outline" title="Baixar PDF">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
