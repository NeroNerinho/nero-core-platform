'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardData } from '@/types/kanban'
import { CalendarDays, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
    task: CardData
}

export function KanbanCard({ task }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { ...task } })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const getMediaTypeColor = (type: string) => {
        switch (type) {
            case 'outdoor': return 'bg-blue-900 text-blue-200 border-blue-800';
            case 'tv': return 'bg-red-900 text-red-200 border-red-800';
            case 'digital': return 'bg-green-900 text-green-200 border-green-800';
            default: return 'bg-gray-800 text-gray-200 border-gray-700';
        }
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="cursor-grab bg-gray-950 border-gray-800 hover:border-blue-500/50 transition-colors">
                <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-500">{task.client}</span>
                        <Badge variant="outline" className={`${getMediaTypeColor(task.mediaType)} text-[10px] px-1 py-0 border`}>
                            {task.mediaType}
                        </Badge>
                    </div>
                    <CardTitle className="text-sm font-medium text-white leading-tight">
                        {task.title}
                    </CardTitle>
                    <div className="text-xs text-gray-500 mt-1">{task.piNumber}</div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {task.value.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {task.dueDate}
                        </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${task.progress}%` }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
