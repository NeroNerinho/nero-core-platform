import { InvoicesTable } from '@/components/financeiro/InvoicesTable';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

export default function FaturamentoPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Faturamento (NFS-e)</h1>
                    <p className="text-muted-foreground">
                        Emissão e gerenciamento de Notas Fiscais de Serviço.
                    </p>
                </div>
                <Button variant="default">
                    <FilePlus className="mr-2 h-4 w-4" /> Nova Fatura
                </Button>
            </div>

            <InvoicesTable />
        </div>
    );
}
