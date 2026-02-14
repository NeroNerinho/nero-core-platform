import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const activity = [
    {
        user: 'John Doe',
        action: 'uploaded 5 photos',
        project: 'Campaign Summer 2024',
        time: '2 minutes ago',
        avatar: 'JD',
    },
    {
        user: 'Jane Smith',
        action: 'approved checking',
        project: 'PI-123456',
        time: '1 hour ago',
        avatar: 'JS',
    },
    {
        user: 'Mike Johnson',
        action: 'rejected checking',
        project: 'PI-789012',
        time: '3 hours ago',
        avatar: 'MJ',
    },
    {
        user: 'Sarah Williams',
        action: 'created new project',
        project: 'Winter Launch',
        time: '5 hours ago',
        avatar: 'SW',
    },
]

export function RecentActivity() {
    return (
        <Card className="col-span-3 lg:col-span-3 bg-gray-900 border-gray-800 text-gray-100">
            <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activity.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>{item.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-white">
                                    {item.user} <span className="text-gray-400 font-normal">{item.action}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.project}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-gray-500">{item.time}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
