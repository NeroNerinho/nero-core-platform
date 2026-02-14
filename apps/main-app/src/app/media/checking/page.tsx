"use client";

import { KanbanBoard } from "@/components/checking/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CheckingPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Checking de Mídia 2.0</h1>
                    <p className="text-muted-foreground">
                        Fluxo de validação de veiculação OOH, Digital e Offline.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Novo Checking
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard />
            </div>
        </div>
    );
}
