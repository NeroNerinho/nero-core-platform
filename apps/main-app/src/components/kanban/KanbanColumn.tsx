'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { KanbanCard } from '@/components/v0/KanbanCard'
import { CardData, ColumnData } from '@/types/kanban'
import { cn } from '@/lib/utils'

interface Props {
    column: ColumnData
    tasks: CardData[]
}

export function KanbanColumn({ column, tasks }: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    })

    return (
        <div className="flex h-full w-80 min-w-[320px] flex-col rounded-lg bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400">
                    {tasks.length}
                </span>
            </div>
            <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                        {tasks.map((task) => (
                            <KanbanCard
                                key={task.id}
                                id={task.id as string}
                                title={task.title}
                                clientName={task.client}
                                clientLogo={task.clientLogo}
                                piNumber={task.piNumber}
                                mediaType={task.mediaType}
                                location={task.location}
                                progress={task.progress}
                                totalPhotos={task.totalPhotos}
                                value={task.value}
                                dueDate={task.dueDate}
                                assignedUsers={task.assignedUsers}
                                isOverdue={task.isOverdue}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}
