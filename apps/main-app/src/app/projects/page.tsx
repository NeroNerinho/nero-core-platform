'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ExternalLink, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const projects = [
    {
        id: '1',
        name: 'Summer Campaign 2024',
        client: 'Coca-Cola',
        status: 'running',
        dueDate: '2024-03-20',
        budget: 'R$ 150,000',
        progress: 75,
    },
    {
        id: '2',
        name: 'Winter Launch',
        client: 'Pepsi',
        status: 'planning',
        dueDate: '2024-06-15',
        budget: 'R$ 200,000',
        progress: 10,
    },
    {
        id: '3',
        name: 'Black Friday Deals',
        client: 'Amazon',
        status: 'approval',
        dueDate: '2024-11-25',
        budget: 'R$ 500,000',
        progress: 40,
    },
]

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Projects</h2>
                    <p className="text-gray-400">Manage your campaigns and media orders</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="bg-gray-900 border-gray-800 text-gray-100 flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                                    <CardDescription className="text-gray-400 mt-1">{project.client}</CardDescription>
                                </div>
                                <Badge variant={project.status === 'running' ? 'default' : 'secondary'} className="capitalize">
                                    {project.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Budget</span>
                                <span className="font-medium text-white">{project.budget}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> Due Date
                                </span>
                                <span className="font-medium text-white">{project.dueDate}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-800">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/projects/${project.id}/kanban`} className="w-full">
                                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 hover:text-white">
                                    <ExternalLink className="mr-2 h-4 w-4" /> Open Kanban
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
