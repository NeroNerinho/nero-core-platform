"use client";

import React, { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckingItem, CHECKING_COLUMNS, CheckingStatus } from '@/types/checking';
import { CheckingCard } from './CheckingCard';
import { ValidationPanel } from './ValidationPanel';
import { toast } from 'sonner';

// Mock Data Generator
const generateMockItems = (): CheckingItem[] => [
    {
        id: '1',
        title: 'Campanha Verão 2026 - Outdoor Curitiba',
        description: 'Veiculação em 15 pontos de ônibus.',
        status: 'pending_docs',
        priority: 'high',
        supplier: { name: 'Clear Channel', cnpj: '12.345.678/0001-90', category: 'OOH' },
        validation: { ocrMatch: false, agencyCommission: 0, cenpCompliance: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Google Ads - Fevereiro',
        description: 'Campanha de Search e Display.',
        status: 'ocr_processing',
        priority: 'medium',
        supplier: { name: 'Google Brasil', cnpj: '00.000.000/0001-00', category: 'Digital' },
        invoice: { number: 'NF-2024-001', amount: 15400.00, issueDate: '2024-02-01', dueDate: '2024-02-28' },
        validation: { ocrMatch: true, agencyCommission: 20, cenpCompliance: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Rádio Mix - Spot 30"',
        description: 'Veiculação Spot Promocional.',
        status: 'compliance_check',
        priority: 'low',
        supplier: { name: 'Rádio Mix FM', cnpj: '98.765.432/0001-10', category: 'Radio' },
        invoice: { number: 'NF-9988', amount: 4500.00, issueDate: '2024-02-10', dueDate: '2024-03-10' },
        validation: { ocrMatch: true, agencyCommission: 18, cenpCompliance: false }, // Invalid Commission
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
];

// Sortable Item Wrapper
function SortableItem({ item, onClick }: { item: CheckingItem; onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id, data: { ...item } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
            <CheckingCard item={item} onClick={onClick} />
        </div>
    );
}

export function KanbanBoard() {
    const [items, setItems] = useState<CheckingItem[]>(generateMockItems());
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<CheckingItem | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;
        const activeItem = items.find(i => i.id === activeId);

        if (activeItem) {
            // Find if over is a container or an item
            let newStatus: CheckingStatus | undefined;

            if (CHECKING_COLUMNS.some(c => c.id === overId)) {
                newStatus = overId as CheckingStatus;
            } else {
                const overItem = items.find(i => i.id === overId);
                if (overItem) newStatus = overItem.status;
            }

            if (newStatus && newStatus !== activeItem.status) {
                setItems(items.map(i => i.id === activeId ? { ...i, status: newStatus! } : i));
                toast.success(`Card movido para: ${CHECKING_COLUMNS.find(c => c.id === newStatus)?.title}`);
            }
        }

        setActiveId(null);
    };

    const handleCardClick = (item: CheckingItem) => {
        setSelectedItem(item);
        setIsPanelOpen(true);
    };

    const handleValidation = (itemId: string, valid: boolean) => {
        if (valid) {
            // Move to next step logic (simplified)
            setItems(prev => prev.map(item => {
                if (item.id === itemId) {
                    const nextStatusMap: Record<CheckingStatus, CheckingStatus> = {
                        'pending_docs': 'ocr_processing',
                        'ocr_processing': 'compliance_check',
                        'compliance_check': 'payment_ready',
                        'payment_ready': 'completed',
                        'completed': 'completed'
                    };
                    return { ...item, status: nextStatusMap[item.status] };
                }
                return item;
            }));
            toast.success("Item aprovado e movido para a próxima etapa.");
        } else {
            toast.error("Item rejeitado. Notificação enviada ao fornecedor.");
        }
        setIsPanelOpen(false);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {CHECKING_COLUMNS.map(column => (
                    <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-muted/10 rounded-lg border border-border/50">
                        <div className="p-3 border-b border-border/50 bg-muted/20 rounded-t-lg">
                            <h3 className="font-semibold text-sm flex justify-between items-center">
                                {column.title}
                                <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full border">
                                    {items.filter(i => i.status === column.id).length}
                                </span>
                            </h3>
                        </div>

                        <div className="flex-1 p-2 overflow-y-auto min-h-[100px]">
                            <SortableContext
                                id={column.id}
                                items={items.filter(i => i.status === column.id).map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.filter(i => i.status === column.id).map(item => (
                                    <SortableItem key={item.id} item={item} onClick={() => handleCardClick(item)} />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                ))}

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <CheckingCard
                            item={items.find(i => i.id === activeId)!}
                            onClick={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <ValidationPanel
                item={selectedItem}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onValidate={handleValidation}
            />
        </div>
    );
}
