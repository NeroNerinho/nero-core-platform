import { ReceivablesTable } from '@/components/financeiro/ReceivablesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ContasAReceberPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
                    <p className="text-muted-foreground">
                        Gerencie títulos, gere boletos e acompanhe recebimentos.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Novo Título
                </Button>
            </div>

            <ReceivablesTable />
        </div>
    );
}
