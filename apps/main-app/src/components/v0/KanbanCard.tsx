import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, MoreHorizontal, GripVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export interface KanbanCardProps {
    id: string
    title: string
    clientName: string
    clientLogo?: string
    piNumber: string
    mediaType: 'outdoor' | 'tv' | 'digital' | 'radio' | 'frontlight' | 'busdoor' | 'print'
    location?: string
    progress: number // Photos received / total required
    totalPhotos: number
    value: number
    dueDate: string
    assignedUsers: { name: string; avatar?: string }[]
    isOverdue?: boolean
}

export function KanbanCard({
    id,
    title,
    clientName,
    clientLogo,
    piNumber,
    mediaType,
    location,
    progress,
    totalPhotos,
    value,
    dueDate,
    assignedUsers,
    isOverdue
}: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const getMediaTypeColor = (type: string) => {
        switch (type) {
            case 'outdoor': return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            case 'tv': return 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            case 'digital': return 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            case 'radio': return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            default: return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
        }
    }

    const percentComplete = Math.round((progress / totalPhotos) * 100) || 0

    return (
        <div ref={setNodeRef} style={style} className="touch-none mb-3">
            <Card className={`bg-[#262626] border-[#333] hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 group relative overflow-hidden ${isOverdue ? 'border-red-900/50 animate-pulse-border' : ''}`}>
                <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border-2 border-[#1a1a1a]">
                                <AvatarImage src={clientLogo} />
                                <AvatarFallback className="text-[10px] bg-gray-700">{clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-gray-400">{clientName}</span>
                        </div>
                        <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-4 w-4" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-100 leading-tight line-clamp-2">{title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{piNumber}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-0 ${getMediaTypeColor(mediaType)}`}>
                            {mediaType.toUpperCase()}
                        </Badge>
                        {location && (
                            <div className="flex items-center text-[10px] text-gray-500 max-w-[150px] truncate">
                                <MapPin className="h-3 w-3 mr-1" /> {location}
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Checking Progress</span>
                            <span>{progress}/{totalPhotos}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full w-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${percentComplete === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${percentComplete}%` }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#333]">
                        <div className="font-bold text-sm text-gray-200">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {assignedUsers.map((user, i) => (
                                    <Avatar key={i} className="h-6 w-6 border-2 border-[#262626]">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="text-[9px] bg-blue-900 text-blue-100">{user.name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            {dueDate && (
                                <div className={`flex items-center text-[10px] ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
