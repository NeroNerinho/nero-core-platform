'use client'

import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default function KanbanPage() {
    const params = useParams()

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                            <ArrowLeft className="h-5 w-5 text-gray-400" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Campaign Board</h2>
                        <p className="text-sm text-gray-400">Project ID: {params.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                        Filter
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-lg bg-gray-950/50 border border-gray-800/50">
                <KanbanBoard />
            </div>
        </div>
    )
}
