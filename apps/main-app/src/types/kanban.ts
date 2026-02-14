export type Identifier = string | number

export interface ColumnData {
    id: Identifier
    title: string
}

export interface CardData {
    id: Identifier
    columnId: Identifier
    title: string
    client: string
    clientLogo?: string
    piNumber: string
    value: number
    mediaType: 'outdoor' | 'tv' | 'radio' | 'digital' | 'print' | 'frontlight' | 'busdoor'
    location?: string
    progress: number
    totalPhotos: number
    dueDate: string
    assignedUsers: { name: string; avatar?: string }[]
    isOverdue?: boolean
}

export interface Campaign {
    id: string
    name: string
    client: string
    status: string
}
