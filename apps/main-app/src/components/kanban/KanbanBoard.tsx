'use client'

import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from '@/components/v0/KanbanCard' // Use V0 component
import { CardData, ColumnData } from '@/types/kanban'

const defaultCols: ColumnData[] = [
    { id: 'planning', title: 'Planning' },
    { id: 'production', title: 'Production' },
    { id: 'approval', title: 'Approval' },
    { id: 'running', title: 'Running' },
    { id: 'completed', title: 'Completed' },
]

const initialTasks: CardData[] = [
    {
        id: 'task1',
        columnId: 'planning',
        title: 'Summer Campaign',
        client: 'Coca-Cola',
        clientLogo: '/logos/coca-cola.png', // Placeholder
        piNumber: 'PI-123456',
        value: 15000,
        mediaType: 'outdoor',
        location: 'Av. Paulista, 1000',
        progress: 3,
        totalPhotos: 5,
        dueDate: '2024-03-20',
        assignedUsers: [
            { name: 'Ana', avatar: '/avatars/01.png' },
            { name: 'João', avatar: '/avatars/02.png' }
        ]
    },
    {
        id: 'task2',
        columnId: 'production',
        title: 'Winter Launch',
        client: 'Pepsi',
        clientLogo: '/logos/pepsi.png',
        piNumber: 'PI-789012',
        value: 25000,
        mediaType: 'tv',
        progress: 0,
        totalPhotos: 1,
        dueDate: '2024-02-28',
        assignedUsers: [
            { name: 'Carlos', avatar: '/avatars/03.png' }
        ],
        isOverdue: true
    },
    {
        id: 'task3',
        columnId: 'approval',
        title: 'Black Friday',
        client: 'Amazon',
        clientLogo: '/logos/amazon.png',
        piNumber: 'PI-345678',
        value: 50000,
        mediaType: 'digital',
        progress: 90,
        totalPhotos: 100, // Percentage based on guide prompt example
        dueDate: '2024-11-25',
        assignedUsers: [
            { name: 'Ana', avatar: '/avatars/01.png' },
            { name: 'Maria', avatar: '/avatars/04.png' },
            { name: 'Pedro', avatar: '' }
        ]
    },
]

export function KanbanBoard() {
    const [columns] = useState<ColumnData[]>(defaultCols)
    const [tasks, setTasks] = useState<CardData[]>(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function findContainer(id: string) {
        if (tasks.find((task) => task.id === id)) {
            return tasks.find((task) => task.id === id)?.columnId
        }
        return null
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        setActiveId(active.id as string)
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event
        const overId = over?.id

        if (!overId) return

        const activeContainer = findContainer(active.id as string)
        const overContainer = columns.find(col => col.id === overId)?.id || findContainer(overId as string)

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }

        setTasks((prev) => {
            const activeItems = prev.filter((item) => item.columnId === activeContainer)
            const overItems = prev.filter((item) => item.columnId === overContainer)

            const activeIndex = activeItems.findIndex((item) => item.id === active.id)
            const overIndex = overItems.findIndex((item) => item.id === overId)

            let newIndex
            if (overItems.length > 0) {
                newIndex = overIndex >= 0 ? overIndex + (active.id !== overId ? 1 : 0) : overItems.length + 1
            }

            return prev.map(t => {
                if (t.id === active.id) {
                    return { ...t, columnId: overContainer as string }
                }
                return t
            })
        })
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        const activeContainer = findContainer(active.id as string)
        const overContainer = columns.find(col => col.id === over?.id)?.id || findContainer(over?.id as string)

        if (
            activeContainer &&
            overContainer &&
            activeContainer !== overContainer
        ) {
            setTasks((prev) => {
                return prev.map(t => {
                    if (t.id === active.id) {
                        return { ...t, columnId: overContainer as string }
                    }
                    return t
                })
            })
        }
        setActiveId(null)
    }

    const activeTask = tasks.find((task) => task.id === activeId)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full gap-4 overflow-x-auto p-4 bg-[#1a1a1a] min-h-[calc(100vh-100px)]">
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId && activeTask ? (
                    <KanbanCard
                        id={activeTask.id as string}
                        title={activeTask.title}
                        clientName={activeTask.client}
                        clientLogo={activeTask.clientLogo}
                        piNumber={activeTask.piNumber}
                        mediaType={activeTask.mediaType}
                        location={activeTask.location}
                        progress={activeTask.progress}
                        totalPhotos={activeTask.totalPhotos}
                        value={activeTask.value}
                        dueDate={activeTask.dueDate}
                        assignedUsers={activeTask.assignedUsers}
                        isOverdue={activeTask.isOverdue}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
